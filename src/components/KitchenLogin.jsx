import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './KitchenLogin.css';

const KitchenLogin = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { isDarkTheme } = useTheme();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === 'kitchen123') {
            onLogin();
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className={`kitchen-login-container ${isDarkTheme ? 'dark' : ''}`}>
            <div className="kitchen-login-card">
                <h2 className="kitchen-login-title">Kitchen Login</h2>
                <form onSubmit={handleSubmit} className="kitchen-login-form">
                    <input
                        type="password"
                        className="form-input"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="login-btn">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default KitchenLogin;
