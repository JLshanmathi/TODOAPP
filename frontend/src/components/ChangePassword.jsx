import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ChangePassword = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const { changePassword, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const newPassword = watch('newPassword');

    const onSubmit = async (data) => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        const result = await changePassword(data.currentPassword, data.newPassword);

        if (result.success) {
            setMessage({
                type: 'success',
                text: '✅ Password changed successfully! Please login again.'
            });

            // Logout after 2 seconds
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);
        } else {
            setMessage({ type: 'error', text: result.message });
        }

        setLoading(false);
    };

    const togglePassword = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Change Password</h2>
                <p className="auth-subtitle">Update your password to keep your account secure</p>

                {message.text && (
                    <div style={{
                        backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                        borderLeft: message.type === 'success' ? '4px solid #10b981' : '4px solid #ef4444',
                        color: message.type === 'success' ? '#065f46' : '#b91c1c',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
                        <span>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Current Password */}
                    <div>
                        <label htmlFor="currentPassword" className="form-label">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                id="currentPassword"
                                type={showPassword.current ? 'text' : 'password'}
                                className={`form-input ${errors.currentPassword ? 'border-red-500 ring-red-100' : ''}`}
                                placeholder="Enter current password"
                                {...register('currentPassword', {
                                    required: 'Current password is required'
                                })}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => togglePassword('current')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-primary-600 font-medium"
                                disabled={loading}
                            >
                                {showPassword.current ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <span className="error-text">
                                <span>⚠️</span>
                                {errors.currentPassword.message}
                            </span>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <label htmlFor="newPassword" className="form-label">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                id="newPassword"
                                type={showPassword.new ? 'text' : 'password'}
                                className={`form-input ${errors.newPassword ? 'border-red-500 ring-red-100' : ''}`}
                                placeholder="Enter new password"
                                {...register('newPassword', {
                                    required: 'New password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => togglePassword('new')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-primary-600 font-medium"
                                disabled={loading}
                            >
                                {showPassword.new ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <span className="error-text">
                                <span>⚠️</span>
                                {errors.newPassword.message}
                            </span>
                        )}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showPassword.confirm ? 'text' : 'password'}
                                className={`form-input ${errors.confirmPassword ? 'border-red-500 ring-red-100' : ''}`}
                                placeholder="Confirm new password"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: value =>
                                        value === newPassword || 'Passwords do not match'
                                })}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => togglePassword('confirm')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-primary-600 font-medium"
                                disabled={loading}
                            >
                                {showPassword.confirm ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <span className="error-text">
                                <span>⚠️</span>
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </div>

                    {/* Password strength indicator */}
                    {newPassword && newPassword.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                            <div style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '5px' }}>
                                Password strength:
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <div style={{
                                    height: '4px',
                                    flex: 1,
                                    borderRadius: '2px',
                                    backgroundColor: newPassword.length >= 6 ? '#22c55e' : '#e5e7eb'
                                }}></div>
                                <div style={{
                                    height: '4px',
                                    flex: 1,
                                    borderRadius: '2px',
                                    backgroundColor: newPassword.length >= 8 && /[0-9]/.test(newPassword) ? '#22c55e' : '#e5e7eb'
                                }}></div>
                                <div style={{
                                    height: '4px',
                                    flex: 1,
                                    borderRadius: '2px',
                                    backgroundColor: newPassword.length >= 10 && /[!@#$%^&*]/.test(newPassword) ? '#22c55e' : '#e5e7eb'
                                }}></div>
                            </div>
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
                                    Changing...
                                </span>
                            ) : 'Change Password'}
                        </button>

                        <button
                            type="button"
                            className="btn-primary"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;