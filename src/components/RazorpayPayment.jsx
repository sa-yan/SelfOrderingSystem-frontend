import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './RazorpayPayment.module.css';

const RazorpayPayment = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const orderDetails = location.state;

    // Redirect if no order details
    useEffect(() => {
        if (!orderDetails) {
            navigate('/cart');
        }
    }, [orderDetails, navigate]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Format amount to whole number
            const amountInRupees = Math.round(orderDetails.total);

            // Create order using query parameters
            const response = await fetch(
                `http://localhost:8080/api/payment/createOrder?amount=${amountInRupees}&currency=INR`,
                { method: 'POST' }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const order = await response.json();

            const options = {
                key: "rzp_test_QVVYHJR2HzB6Ap",
                amount: order.amount,
                currency: order.currency,
                name: "Restaurant Name",
                description: `Order #${orderDetails.order.id}`,
                order_id: order.id,
                handler: function (response) {
                    // Payment success handler with query parameters
                    fetch(
                        `http://localhost:8080/api/payment/confirm?orderId=${orderDetails.order.id}&razorpayPaymentId=${response.razorpay_payment_id}`,
                        { method: 'POST' }
                      )                      
                        .then(res => {
                            if (!res.ok) throw new Error('Payment confirmation failed');
                            return res.text();
                        })
                        .then(() => {
                            clearCart();
                            // Navigate directly to thank you page
                            navigate('/thankyou', {
                                state: {
                                    orderId: orderDetails.order.id,
                                    paymentId: response.razorpay_payment_id,
                                    orderDetails: orderDetails
                                }
                            });
                        })
                        .catch(err => {
                            console.error("Failed to confirm payment:", err);
                            setError("Payment succeeded but failed to update order status.");
                        });
                },
                prefill: {
                    name: "Customer Name",
                    email: "customer@example.com"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('Payment error:', err);
            setError(err.message || 'Payment initialization failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!orderDetails) return null;

    return (
        <div className={styles.paymentContainer}>
            <div className={styles.paymentCard}>
                <h2 className={styles.title}>Complete Your Payment</h2>
                <div className={styles.orderSummary}>
                    <p>Order #{orderDetails.order.id}</p>
                    <p>Table Number: {orderDetails.tableNumber}</p>
                    <p>Total Items: {orderDetails.items.length}</p>
                    <p>Total Amount: ₹{orderDetails.total}</p>
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button
                    onClick={handlePayment}
                    className={styles.payButton}
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : 'Pay Now'}
                </button>
            </div>
        </div>
    );
};

export default RazorpayPayment;
