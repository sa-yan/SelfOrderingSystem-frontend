import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaLock, FaExclamationCircle } from 'react-icons/fa';
import './AdminLogin.css';

const AdminLogin = () => {
    const { isDarkTheme } = useTheme();
    const [adminCode, setAdminCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (adminCode === import.meta.env.VITE_ADMIN_CODE) {
            localStorage.setItem('adminToken', adminCode);
            navigate('/admin/menu');
        } else {
            setError('Invalid admin code');
        }
    };

    return (
        <div className={`admin-login-container ${isDarkTheme ? 'dark' : ''}`}>
            <form onSubmit={handleSubmit} className="admin-login-form">
                <div className="admin-login-icon" aria-hidden="true">
                    <FaLock />
                </div>
                <h2>Admin Login</h2>
                <p className="admin-login-subtitle">Enter your admin code to manage Food Corner</p>

                {error && (
                    <div className="admin-login-error" role="alert">
                        <FaExclamationCircle />
                        <span>{error}</span>
                    </div>
                )}

                <div className="admin-login-field">
                    <label htmlFor="admin-code">Admin code</label>
                    <input
                        id="admin-code"
                        type="password"
                        placeholder="Enter Admin Code"
                        value={adminCode}
                        onChange={(e) => {
                            setAdminCode(e.target.value);
                            if (error) setError('');
                        }}
                    />
                </div>

                <button type="submit" className="btn-primary admin-login-submit">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;
