import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import './OrderStatus.css';

const OrderStatus = () => {
    const { isDarkTheme } = useTheme();
    const [orderNumber, setOrderNumber] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [allOrders, setAllOrders] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchAllOrders();
        const interval = setInterval(fetchAllOrders, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/kitchen/orders');
            // Filter delivered orders and sort by date (newest first)
            const activeOrders = response.data
                .filter(order => order.orderStatus !== 'DELIVERED')
                .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            setAllOrders(activeOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const trackOrder = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSelectedOrder(null);

        const found = allOrders.find(order => order.orderNumber.toString() === orderNumber);
        if (found) {
            if (found.orderStatus === 'DELIVERED') {
                setError('This order has been delivered');
            } else {
                setSelectedOrder(found);
            }
        } else {
            setError('Order not found or already delivered');
        }
        setIsLoading(false);
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PLACED': return 'Order Received';
            case 'PREPARING': return 'Being Prepared';
            case 'READY': return 'Done! Pick from Counter';
            case 'DELIVERED': return 'Collected';
            default: return status;
        }
    };

    return (
        <>
            <Header />
            <div className={`order-status-container ${isDarkTheme ? 'dark' : ''}`}>
                <div className="order-status-content">
                    <h2>Track Your Order</h2>

                    <form onSubmit={trackOrder} className="tracking-form">
                        <input
                            type="text"
                            placeholder="Enter Order Number"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Tracking...' : 'Track Order'}
                        </button>
                    </form>

                    {error && <div className="error-message">{error}</div>}

                    {selectedOrder ? (
                        <div className="order-details">
                            <div className="status-header">
                                <h3>Order #{selectedOrder.orderNumber}</h3>
                                <span className={`status-badge ${selectedOrder.orderStatus.toLowerCase()}`}>
                                    {getStatusText(selectedOrder.orderStatus)}
                                </span>
                            </div>

                            <div className="order-info">
                                <p>Table Number: {selectedOrder.tableNumber}</p>
                                <p>Total Amount: ${selectedOrder.totalAmount.toFixed(2)}</p>
                            </div>

                            <div className="order-items">
                                <h4>Items Ordered:</h4>
                                {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="item">
                                        <span>{item.name}</span>
                                        <span>x {item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="status-timeline">
                                {['PLACED', 'PREPARING', 'READY', 'DELIVERED'].map((status, index) => (
                                    <div
                                        key={status}
                                        className={`timeline-point ${selectedOrder.orderStatus === status ? 'current' :
                                            index < ['PLACED', 'PREPARING', 'READY', 'DELIVERED']
                                                .indexOf(selectedOrder.orderStatus) ? 'completed' : ''
                                            }`}
                                    >
                                        <div className="point"></div>
                                        <span>{getStatusText(status)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="all-orders">
                            <h3>Recent Orders</h3>
                            <div className="orders-list">
                                {allOrders.map(order => (
                                    <div
                                        key={order.id}
                                        className="order-list-item"
                                        onClick={() => {
                                            setOrderNumber(order.orderNumber.toString());
                                            setSelectedOrder(order);
                                        }}
                                    >
                                        <div className="order-list-header">
                                            <span className="order-list-number">#{order.orderNumber}</span>
                                            <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                                                {getStatusText(order.orderStatus)}
                                            </span>
                                        </div>
                                        <div className="order-list-details">
                                            <span>Table {order.tableNumber}</span>
                                            <span>${order.totalAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="order-list-items">
                                            {order.items.map((item, idx) => (
                                                <span key={idx}>{item.name} x{item.quantity}</span>
                                            )).slice(0, 2)}
                                            {order.items.length > 2 &&
                                                <span>+{order.items.length - 2} more</span>
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default OrderStatus;
