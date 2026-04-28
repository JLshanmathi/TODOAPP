import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false
    });

    const newPassword = watch('newPassword');

    const onEmailSubmit = async (data) => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/forgot-password',
                { email: data.email }
            );

            setEmail(data.email);
            setMessage({
                type: 'success',
                text: response.data.message || 'Reset link sent to your email!'
            });
            setStep(2);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to send reset email'
            });
        } finally {
            setLoading(false);
        }
    };

    const onPasswordSubmit = async (data) => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/reset-password',
                {
                    email: email,
                    newPassword: data.newPassword
                }
            );

            setMessage({
                type: 'success',
                text: response.data.message || 'Password reset successful! Redirecting...'
            });

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to reset password'
            });
        } finally {
            setLoading(false);
        }
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
                <h2 className="auth-title">
                    {step === 1 ? 'Forgot Password?' : 'Reset Password'}
                </h2>

                <p className="auth-subtitle">
                    {step === 1
                        ? 'Enter your email to reset your password'
                        : `Enter new password for ${email}`}
                </p>

                {message.text && (
                    <div
                        style={{
                            backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                            borderLeft: message.type === 'success' ? '4px solid #10b981' : '4px solid #ef4444',
                            color: message.type === 'success' ? '#065f46' : '#b91c1c',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
                        <span>{message.text}</span>
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                className={`form-input ${errors.email ? 'border-red-500 ring-red-100' : ''}`}
                                placeholder="Enter your email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                disabled={loading}
                            />
                            {errors.email && (
                                <span className="error-text">
                                    ⚠️ {errors.email.message}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-5">
                        <div>
                            <label htmlFor="newPassword" className="form-label">
                                New Password
                            </label>
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
                            {errors.newPassword && (
                                <span className="error-text">
                                    ⚠️ {errors.newPassword.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm New Password
                            </label>
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
                            {errors.confirmPassword && (
                                <span className="error-text">
                                    ⚠️ {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="btn-primary flex-1"
                                disabled={loading}
                            >
                                Back
                            </button>

                            <button
                                type="submit"
                                className="btn-primary flex-1"
                                disabled={loading}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Remember your password?{' '}
                        <Link
                            to="/login"
                            className="text-primary-600 hover:text-primary-700 font-semibold"
                        >
                            Back to Login
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default ForgotPassword;