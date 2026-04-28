import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const { register: registerUser, registerError, clearRegisterError } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirm: false
    });

    const name = watch('name');
    const email = watch('email');
    const password = watch('password');
    const confirmPassword = watch('confirmPassword');

    useEffect(() => {
        if (registerError && (name || email || password || confirmPassword)) {
            clearRegisterError();
        }
    }, [name, email, password, confirmPassword, registerError, clearRegisterError]);

    const onSubmit = async (data) => {
        setLoading(true);
        
        const result = await registerUser(data.name, data.email, data.password);
        
        if (result.success) {
            navigate('/login', { 
                state: { message: 'Registration successful! Please login.' } 
            });
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
                <h2 className="auth-title">Create Account</h2>
                
                {registerError && (
                    <div className="error-message">
                        <span className="text-xl">⚠️</span>
                        <span>{registerError}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="form-label">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            className={`form-input ${errors.name ? 'border-red-500 ring-red-100' : ''}`}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            {...register('name', {
                                required: 'Name is required',
                                minLength: {
                                    value: 2,
                                    message: 'Name must be at least 2 characters'
                                }
                            })}
                            disabled={loading}
                        />
                        {errors.name && (
                            <span className="error-text">
                                <span>⚠️</span>
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="form-label">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={`form-input ${errors.email ? 'border-red-500 ring-red-100' : ''}`}
                            placeholder="Enter your email"
                            autoComplete="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Please enter a valid email address'
                                }
                            })}
                            disabled={loading}
                        />
                        {errors.email && (
                            <span className="error-text">
                                <span>⚠️</span>
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword.password ? 'text' : 'password'}
                                className={`form-input ${errors.password ? 'border-red-500 ring-red-100' : ''} pr-20`}
                                placeholder="Create a password"
                                autoComplete="new-password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => togglePassword('password')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-primary-600 font-medium"
                                disabled={loading}
                            >
                                {showPassword.password ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="error-text">
                                <span>⚠️</span>
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showPassword.confirm ? 'text' : 'password'}
                                className={`form-input ${errors.confirmPassword ? 'border-red-500 ring-red-100' : ''} pr-20`}
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: value =>
                                        value === password || 'Passwords do not match'
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

                    <button
                        type="submit"
                        className="btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="loading-spinner"></span>
                                Creating account...
                            </span>
                        ) : 'Create Account'}
                    </button>
                </form>
                
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;