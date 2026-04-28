import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { taskAPI } from '../services/api';

const TaskForm = ({ task, onSuccess, onCancel }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: task || {
            title: '',
            description: '',
            status: 'pending'
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            let response;
            if (task) {
                response = await taskAPI.updateTask(task._id, data);
                if (onSuccess) onSuccess(response.data.data);
            } else {
                response = await taskAPI.createTask(data);
                reset();
                if (onSuccess) onSuccess(response.data.data);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-0.5 rounded-xl shadow-lg animate-slideDown">
            <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-100">
                    {task ? '✏️ Edit Task' : '✨ Add New Task'}
                </h3>
                
                {error && (
                    <div className="error-message">
                        <span className="text-xl">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="form-label">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            className={`form-input ${errors.title ? 'border-red-500 ring-red-100' : ''}`}
                            placeholder="Enter task title"
                            {...register('title', {
                                required: 'Title is required',
                                maxLength: {
                                    value: 200,
                                    message: 'Title cannot exceed 200 characters'
                                }
                            })}
                            disabled={loading}
                        />
                        {errors.title && (
                            <span className="error-text">
                                <span>⚠️</span>
                                {errors.title.message}
                            </span>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows="3"
                            className={`form-input ${errors.description ? 'border-red-500 ring-red-100' : ''}`}
                            placeholder="Enter task description (optional)"
                            {...register('description', {
                                maxLength: {
                                    value: 1000,
                                    message: 'Description cannot exceed 1000 characters'
                                }
                            })}
                            disabled={loading}
                        />
                        {errors.description && (
                            <span className="error-text">
                                <span>⚠️</span>
                                {errors.description.message}
                            </span>
                        )}
                    </div>

                    {task && (
                        <div>
                            <label htmlFor="status" className="form-label">
                                Status
                            </label>
                            <select
                                id="status"
                                className="form-input"
                                {...register('status')}
                                disabled={loading}
                            >
                                <option value="pending">⏳ Pending</option>
                                <option value="completed">✅ Completed</option>
                            </select>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="btn-primary flex-1"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="loading-spinner"></span>
                                    Saving...
                                </span>
                            ) : (task ? 'Update Task' : 'Add Task')}
                        </button>
                        
                        {task && onCancel && (
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;