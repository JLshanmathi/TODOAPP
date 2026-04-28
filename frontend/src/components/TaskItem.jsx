import React, { useState } from 'react';
import { taskAPI } from '../services/api';
import TaskForm from './TaskForm';

const TaskItem = ({ task, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            setLoading(true);
            try {
                await taskAPI.deleteTask(task._id);
                if (onDelete) onDelete(task._id);
            } catch (error) {
                console.error('Failed to delete task:', error);
                window.confirm('Failed to delete task. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleToggleStatus = async () => {
        setLoading(true);
        try {
            const newStatus = task.status === 'pending' ? 'completed' : 'pending';
            await taskAPI.updateTask(task._id, { status: newStatus });
            if (onUpdate) onUpdate(task._id, { status: newStatus });
        } catch (error) {
            console.error('Failed to update task:', error);
            window.confirm('Failed to update task status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSuccess = (updatedTask) => {
        setIsEditing(false);
        if (onUpdate) onUpdate(task._id, updatedTask);
    };

    if (isEditing) {
        return (
            <TaskForm
                task={task}
                onSuccess={handleFormSuccess}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    return (
        <div className={`bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 
            ${task.status === 'completed' ? 'bg-opacity-70' : ''} 
            border-l-4 ${task.status === 'completed' ? 'border-green-500' : 'border-primary-500'}`}>
            
            <div className="flex justify-between items-start mb-3">
                <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${task.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'}`}>
                    {task.status === 'pending' ? '⏳ Pending' : '✅ Completed'}
                </span>
            </div>
            
            {task.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {task.description}
                </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>📅 {new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex gap-2">
                <button
                    onClick={handleToggleStatus}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${task.status === 'pending' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                    disabled={loading}
                >
                    {task.status === 'pending' ? '✓ Complete' : '↩ Pending'}
                </button>
                
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-200 text-sm font-medium"
                    disabled={loading}
                >
                    ✏️ Edit
                </button>
                
                <button
                    onClick={handleDelete}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 text-sm font-medium"
                    disabled={loading}
                >
                    🗑️ Delete
                </button>
            </div>
        </div>
    );
};

export default TaskItem;