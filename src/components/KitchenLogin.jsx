import React, { useState } from 'react';
import { FaUtensils, FaExclamationCircle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import './KitchenLogin.css';

const KitchenLogin = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { isDarkTheme } = useTheme();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === import.meta.env.VITE_KITCHEN_CODE) {
            onLogin();
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className={`kitchen-login-container ${isDarkTheme ? 'dark' : ''}`}>
            <div className="kitchen-login-card">
                <div className="kitchen-login-icon">
                    <FaUtensils />
                </div>
                <h2 className="kitchen-login-title">Kitchen Login</h2>
                <p className="kitchen-login-subtitle">Enter the kitchen access code to continue</p>
                <form onSubmit={handleSubmit} className="kitchen-login-form">
                    <input
                        type="password"
                        className="form-input"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                        <div className="error-message">
                            <FaExclamationCircle /> {error}
                        </div>
                    )}
                    <button type="submit" className="btn-primary">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default KitchenLogin;
