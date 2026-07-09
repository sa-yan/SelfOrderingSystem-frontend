import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaCreditCard, FaLock } from 'react-icons/fa';
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
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: 'INR',
                name: "Food Corner",
                description: `Order #${orderDetails.order.orderNumber}`,
                order_id: order.id,
                handler: async function (response) {
                    // Disable the pay button immediately after payment
                    setIsLoading(true);

                    try {
                        // Don't wait forever on confirmation — the payment itself already succeeded
                        const controller = new AbortController();
                        const timeout = setTimeout(() => controller.abort(), 30000);

                        const confirmResponse = await fetch(
                            `${import.meta.env.VITE_REACT_APP_API_URL}/api/payment/confirm?orderId=${orderDetails.order.id}&razorpayPaymentId=${response.razorpay_payment_id}`,
                            { method: 'POST', signal: controller.signal }
                        );
                        clearTimeout(timeout);

                        if (!confirmResponse.ok) {
                            throw new Error('Payment confirmation failed');
                        }
                    } catch (err) {
                        // Payment is complete at Razorpay; log and continue rather than stranding the user
                        console.error('Payment confirmation call failed:', err);
                    }

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
                },
                prefill: {
                    name: "Customer Name"
                },
                theme: {
                    color: "#ea580c"
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
                <div className={styles.cardIcon}>
                    <FaCreditCard />
                </div>
                <h2 className={styles.title}>Complete Your Payment</h2>
                <div className={styles.orderSummary}>
                    <p><span>Order</span> <span>#{orderDetails.order.orderNumber}</span></p>
                    <p><span>Table Number</span> <span>{orderDetails.tableNumber}</span></p>
                    <p><span>Total Items</span> <span>{orderDetails.items.length}</span></p>
                    <p><span>Total Amount</span> <span>₹{orderDetails.total.toFixed(2)}</span></p>
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button
                    onClick={handlePayment}
                    className={styles.payButton}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className={styles.buttonSpinner}></span>
                            Processing...
                        </>
                    ) : (
                        'Pay Now'
                    )}
                </button>
                <p className={styles.secureNote}>
                    <FaLock /> Secured by Razorpay
                </p>
            </div>
        </div>
    );
};

export default RazorpayPayment;
