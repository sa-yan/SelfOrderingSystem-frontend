import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;
    const [isProcessing, setIsProcessing] = useState(false);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        // Redirect to thank you page after 5 seconds
        const redirect = setTimeout(() => {
            navigate('/thankyou');
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [navigate]);

    if (!order) {
        navigate('/');
        return null;
    }

    const handlePaymentConfirmation = async (isPaid) => {
        setIsProcessing(true);
        try {
            if (isPaid) {
                // In future, you can add API call here to update payment status
                navigate('/');
            } else {
                // Just reset the processing state and stay on the same page
                setIsProcessing(false);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Header />
            <div className="order-success-container">
                <div className="order-details">
                    <h2>Order Placed Successfully!</h2>
                    <p className="order-number">Order #{order.orderNumber}</p>
                    <div className="order-items">
                        {order.items.map((item, index) => (
                            <div key={index} className="order-item">
                                <span>{item.name} x {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="order-total">
                        <span>Total Amount:</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="payment-confirmation">
                        <h3>Payment Status</h3>
                        <div className="confirmation-buttons">
                            <button
                                className="confirm-btn paid"
                                onClick={() => handlePaymentConfirmation(true)}
                                disabled={isProcessing}
                            >
                                Payment Done
                            </button>
                            <button
                                className="confirm-btn unpaid"
                                onClick={() => handlePaymentConfirmation(false)}
                                disabled={isProcessing}
                            >
                                Payment Not Done
                            </button>
                        </div>
                        {isProcessing && <div className="processing">Processing...</div>}
                    </div>
                    <p>Redirecting to thank you page in {countdown} seconds...</p>
                </div>
            </div>
        </>
    );
};

export default OrderSuccess;
