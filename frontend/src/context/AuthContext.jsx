import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loginError, setLoginError] = useState(null);
    const [registerError, setRegisterError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await authAPI.getMe();
            setUser(response.data.data);
            setLoginError(null);
            setRegisterError(null);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setLoading(true);
            setLoginError(null);
            
            const response = await authAPI.login({ email, password });
            
            localStorage.setItem('token', response.data.data.token);
            setUser(response.data.data);
            
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
                    console.log('Setting error message:', message); // ✅ DEBUG

            setLoginError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        try {
            setLoading(true);
            setRegisterError(null);
            
            const response = await authAPI.register({ name, email, password });
            
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            setRegisterError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setLoginError(null);
        setRegisterError(null);
    };
const changePassword = async (currentPassword, newPassword) => {
    try {
        setLoading(true);
        const response = await authAPI.changePassword({ currentPassword, newPassword });
        return { success: true, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to change password';
        return { success: false, message };
    } finally {
        setLoading(false);
    }
};
    const clearLoginError = () => setLoginError(null);
    const clearRegisterError = () => setRegisterError(null);

    const value = {
        user,
        loading,
        loginError,
        registerError,
        login,
        register,
        changePassword, 
        logout,
        clearLoginError,
        clearRegisterError,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};