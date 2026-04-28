import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const [isLogoutHovered, setIsLogoutHovered] = useState(false);

    return (
        <nav className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="flex items-center">
                        <h1 className="text-2xl font-bold text-white tracking-wider">
                            TODO APP
                        </h1>
                    </Link>

                    {user && (
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full">
                            <span className="text-white font-medium">
                                Welcome, <span className="text-yellow-300 font-bold capitalize">{user.name}</span>
                            </span>
                            
                            <Link
                                to="/change-password"
                                className="px-3 py-1 text-sm text-white bg-white/10 rounded-full hover:bg-white/20 transition-all duration-200"
                            >
                                🔑 Change Password
                            </Link>
                            
                            <button
                                onClick={logout}
                                onMouseEnter={() => setIsLogoutHovered(true)}
                                onMouseLeave={() => setIsLogoutHovered(false)}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 
                                    ${isLogoutHovered 
                                        ? 'bg-red-500 text-white shadow-lg -translate-y-0.5' 
                                        : 'bg-white/10 text-white border border-white/30'}`}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;