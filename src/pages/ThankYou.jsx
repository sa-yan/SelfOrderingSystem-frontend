import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './ThankYou.css';

const ThankYou = () => {
    const { isDarkTheme } = useTheme();
    const orderNumber = Math.floor(100000 + Math.random() * 900000);

    return (
        <div className={`thank-you-container ${isDarkTheme ? 'dark' : ''}`}>
            <div className="thank-you-card">
                <div className="success-icon-container">
                    <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="thank-you-title">Payment Successful!</h1>
                <div className="order-details">
                    <p>Your order has been successfully placed and payment received.</p>
                    <p className="order-number">Order Number: #{orderNumber}</p>
                    <p>We'll send you an email with the order details and tracking information.</p>
                </div>
                <div className="action-buttons">
                    <Link to="/" className="continue-shopping-btn">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;
