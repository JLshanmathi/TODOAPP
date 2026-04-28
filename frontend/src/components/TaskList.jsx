import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { taskAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        search: ''
    });
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchTasks();
    }, [filters.status]);

    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        
        try {
            const params = {};
            if (filters.status !== 'all') {
                params.status = filters.status;
            }
            
            const response = await taskAPI.getTasks(params);
            setTasks(response.data.data);
        } catch (error) {
            setError('Failed to fetch tasks');
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (taskId) => {
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    };

    const handleUpdate = (taskId, updatedData) => {
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task._id === taskId 
                    ? { ...task, ...updatedData } 
                    : task
            )
        );
    };

    const handleTaskAdded = (newTask) => {
        setShowForm(false);
        setTasks(prevTasks => [newTask, ...prevTasks]);
    };

    const filteredTasks = tasks.filter(task => {
        if (filters.search) {
            return task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                   task.description?.toLowerCase().includes(filters.search.toLowerCase());
        }
        return true;
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-wrap gap-4 items-center">
                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 w-40"
                >
                    <option value="all">All Tasks</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
                
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 min-w-[250px]"
                />
                
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                >
                    {showForm ? 'Cancel' : '+ Add New Task'}
                </button>
            </div>

            {showForm && (
                <div className="mb-8">
                    <TaskForm onSuccess={handleTaskAdded} />
                </div>
            )}

            {error && (
                <div className="error-message">
                    <span className="text-xl">⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div className="text-center py-16">
                    <div className="inline-block h-8 w-8 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600">Loading tasks...</p>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300">
                    <p className="text-6xl mb-4">📝</p>
                    <p className="text-xl text-gray-600">
                        {filters.search || filters.status !== 'all' 
                            ? 'No tasks match your criteria' 
                            : 'No tasks found. Create your first task!'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                        Your Tasks ({filteredTasks.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTasks.map(task => (
                            <TaskItem
                                key={task._id}
                                task={task}
                                onDelete={handleDelete}
                                onUpdate={handleUpdate}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;