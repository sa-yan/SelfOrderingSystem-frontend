import React, { useState, useEffect } from 'react';
import axios from 'axios';
import KitchenLogin from './KitchenLogin';
import { useTheme } from '../context/ThemeContext';
import './Kitchen.css';

// Add ORDER_STATUS outside component
const ORDER_STATUS = {
    PLACED: 'PLACED',
    PREPARING: 'PREPARING',
    READY: 'READY',
    DELIVERED: 'DELIVERED'
};

const Kitchen = () => {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState({}); // Add loading state
    const { isDarkTheme } = useTheme();

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders(); // Initial fetch
            const interval = setInterval(fetchOrders, 30000); // Poll every 30 seconds
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/kitchen/orders');
            console.log('Fetched orders:', response.data); // ← Add this
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    

    const updateOrderStatus = async (orderId, action) => {
        try {
            setIsLoading(prev => ({ ...prev, [orderId]: true }));
            console.log(`Updating order ${orderId} to ${action}`);

            // Map the actions to the correct endpoint paths
            const actionToEndpoint = {
                'PREPARING': 'preparing',
                'READY': 'ready',
                'DELIVERED': 'deliver'
            };

            const endpoint = `http://localhost:8080/api/kitchen/order/${orderId}/${actionToEndpoint[action]}`;
            // console.log('Request endpoint:', endpoint);

            const response = await axios.patch(endpoint);
            // console.log('Update response:', response.data);

            await fetchOrders();
        } catch (error) {
            // console.error('Error updating order:', error);
            alert('Failed to update order status. Please try again.');
        } finally {
            setIsLoading(prev => ({ ...prev, [orderId]: false }));
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            month: 'short',
            day: 'numeric'
        });
    };

    if (!isAuthenticated) {
        return <KitchenLogin onLogin={() => setIsAuthenticated(true)} />;
    }



    const getFilteredOrders = () => {
        if (filterStatus === 'ALL') {
            return [...orders].sort((a, b) => {
                const priority = {
                    PLACED: 0,
                    PREPARING: 1,
                    READY: 2,
                    DELIVERED: 3
                };
                return priority[a.orderStatus?.toUpperCase()] - priority[b.orderStatus?.toUpperCase()] ||
                    new Date(b.orderDate) - new Date(a.orderDate);
            });
        }
    
        const filtered = orders.filter(order => {
            const backendStatus = order.orderStatus?.toUpperCase();
            const filterTarget = filterStatus.toUpperCase();
            console.log(`Comparing ${backendStatus} === ${filterTarget}`);
            return backendStatus === filterTarget;
        });
    
        console.log(`Filtered for ${filterStatus}:`, filtered);
        return filtered;
    };
    
    
    

    const getStatusLabel = (status) => {
        switch (status) {
            case ORDER_STATUS.PLACED: return 'New Order';
            case ORDER_STATUS.PREPARING: return 'Preparing';
            case ORDER_STATUS.READY: return 'Ready for Pickup';
            case ORDER_STATUS.DELIVERED: return 'Delivered';
            default: return status;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case ORDER_STATUS.PLACED: return 'status-placed';
            case ORDER_STATUS.PREPARING: return 'status-preparing';
            case ORDER_STATUS.READY: return 'status-ready';
            case ORDER_STATUS.DELIVERED: return 'status-delivered';
            default: return '';
        }
    };

    return (
        <div className={`kitchen-container ${isDarkTheme ? 'dark' : ''}`}>
            <h2 className="kitchen-title">Kitchen Dashboard</h2>
            <div className="status-filters">
                <button
                    className={`filter-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('ALL')}
                >
                    All Orders
                </button>
                {Object.values(ORDER_STATUS).map(status => (
                    <button
                        key={status}
                        className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                        onClick={() => setFilterStatus(status)}
                    >
                        {getStatusLabel(status)}
                    </button>
                ))}
            </div>
            <div className="orders-grid">
                {getFilteredOrders().map(order => (
                    <div key={order.id} className={`order-card ${getStatusClass(order.orderStatus)}`}>
                        <div className="order-header">
                            <span className="order-number">Order #{order.orderNumber}</span>
                            <span className={`order-status ${getStatusClass(order.orderStatus)}`}>
                                {getStatusLabel(order.orderStatus)}
                            </span>
                        </div>
                        <div className="order-time">

                            <span>Ordered: {formatDate(order.orderDate)}</span>
                        </div>
                        <div className="order-items">
                            <h3>Items:</h3>
                            {order.items && order.items.length > 0 ? (
                                order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <span className="item-name">{item.name || 'Unknown Item'}</span>
                                        <span className="item-quantity">x {item.quantity || 0}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="no-items">No items found</div>
                            )}
                        </div>
                        <div className="order-info">
                            <p>Table: {order.tableNumber || 'N/A'}</p>
                            <p>Total: ${order.totalAmount.toFixed(2)}</p>
                        </div>
                        <div className="order-actions">
                            {order.orderStatus === ORDER_STATUS.PLACED && (
                                <button
                                    className="action-btn prepare-btn"
                                    onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                                    disabled={isLoading[order.id]}
                                >
                                    {isLoading[order.id] ? 'Processing...' : 'Start Preparing'}
                                </button>
                            )}
                            {order.orderStatus === ORDER_STATUS.PREPARING && (
                                <button
                                    className="action-btn ready-btn"
                                    onClick={() => updateOrderStatus(order.id, 'READY')}
                                    disabled={isLoading[order.id]}
                                >
                                    {isLoading[order.id] ? 'Processing...' : 'Mark as Ready'}
                                </button>
                            )}
                            {order.orderStatus === ORDER_STATUS.READY && (
                                <button
                                    className="action-btn deliver-btn"
                                    onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                                    disabled={isLoading[order.id]}
                                >
                                    {isLoading[order.id] ? 'Processing...' : 'Mark as Delivered'}
                                </button>
                            )}
                        </div>
                        {/* Add debug info */}
                        <div className="debug-info" style={{ fontSize: '12px', color: '#666' }}>
                            Status: {order.orderStatus}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Kitchen;
