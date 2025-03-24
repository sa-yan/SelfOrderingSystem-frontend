import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const { isDarkTheme } = useTheme();
    const [adminCode, setAdminCode] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (adminCode == 'SAYAN2003') {
            localStorage.setItem('adminToken', adminCode);
            navigate('/admin/menu');
        } else {
            alert('Invalid admin code');
        }
    };

    return (
        <div className={`admin-login-container ${isDarkTheme ? 'dark' : ''}`}>
            <form onSubmit={handleSubmit} className="admin-login-form">
                <h2>Admin Login</h2>
                <input
                    type="password"
                    placeholder="Enter Admin Code"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;
