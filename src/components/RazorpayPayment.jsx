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
        console.log(import.meta.env.VITE_REACT_APP_API_URL);
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
            const amountInRupees = Math.round(orderDetails.total);
            const response = await fetch(
                `${import.meta.env.VITE_REACT_APP_API_URL}/api/payment/createOrder?amount=${amountInRupees}&currency=INR`,
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
                handler: async function (response) {
                    try {
                        // Disable the pay button immediately after payment
                        setIsLoading(true);

                        const confirmResponse = await fetch(
                            `${import.meta.env.VITE_REACT_APP_API_URL}/api/payment/confirm?orderId=${orderDetails.order.id}&razorpayPaymentId=${response.razorpay_payment_id}`,
                            { method: 'POST' }
                        );

                        if (!confirmResponse.ok) {
                            throw new Error('Payment confirmation failed');
                        }

                        // Clear cart and navigate immediately
                        clearCart();
                        // Navigate to thank you page and replace current history entry
                        navigate('/thankyou', {
                            state: {
                                orderId: orderDetails.order.id,
                                paymentId: response.razorpay_payment_id,
                                orderDetails: orderDetails
                            },
                            replace: true // This will replace the current entry in history
                        });
                    } catch (err) {
                        console.error("Failed to process payment:", err);
                        setError("Payment succeeded but failed to complete the process.");
                        setIsLoading(false); // Re-enable the button only on error
                    }
                },
                prefill: {
                    name: "Customer Name"
                },
                theme: {
                    color: "#3399cc"
                },
                modal: {
                    ondismiss: function () {
                        setIsLoading(false); // Re-enable the button if modal is dismissed
                    }
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
