import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const { login, loginError, clearLoginError, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const email = watch('email');
    const password = watch('password');
    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    useEffect(() => {
    if (loginError) {
        clearLoginError();
    }
}, [email, password]);

    const onSubmit = async (data) => {
        setLoading(true);
        
        const result = await login(data.email, data.password);
        
        if (result.success) {
            navigate('/');
        }
        
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Welcome Back</h2>
                
                {/* ✅ SINGLE ERROR DISPLAY - USING INLINE STYLES TO ENSURE VISIBILITY */}
                {loginError && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        border: '1px solid #fecaca',
                        borderLeft: '4px solid #ef4444',
                        color: '#b91c1c',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}>
                        <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                        <span>{loginError}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                            autoFocus
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
                                type={showPassword ? 'text' : 'password'}
                                className={`form-input ${errors.password ? 'border-red-500 ring-red-100' : ''} pr-20`}
                                placeholder="Enter your password"
                                autoComplete="current-password"
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
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-primary-600 font-medium"
                                disabled={loading}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="error-text">
                                <span>⚠️</span>
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    <div className="text-right">
                        <Link 
                            to="/forgot-password" 
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
Forgot password                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full"
                        disabled={loading || Object.keys(errors).length > 0}
                        style={{
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'wait' : 'pointer'
                        }}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="loading-spinner"></span>
                                Logging in...
                            </span>
                        ) : 'Sign In'}
                    </button>
                </form>
                
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;