import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
    const [tableNumber, setTableNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch menu items to get current prices and availability
        axios.get('http://localhost:8080/api/menu')
            .then(response => {
                setMenuItems(response.data);
            })
            .catch(error => console.error('Error fetching menu items:', error));
    }, []);

    const cartItemsDetails = Object.keys(cartItems).map(id => {
        const item = menuItems.find(item => item.id === id);
        return item ? {
            ...item,
            quantity: cartItems[id]
        } : null;
    }).filter(item => item !== null);

    const total = cartItemsDetails.reduce((sum, item) =>
        sum + (item.price * item.quantity), 0
    );

    const handleCheckout = async () => {
        if (!tableNumber) {
            setError('Please enter a table number');
            return;
        }

        setIsProcessing(true);
        setError('');

        const orderItems = cartItemsDetails.map(item => ({
            menuItemId: item.id,
            quantity: item.quantity
        }));

        const orderData = {
            items: orderItems,
            tableNumber: parseInt(tableNumber)
        };

        try {
            const response = await axios.post('http://localhost:8080/api/order/', orderData);
            clearCart();
            navigate('/order-success', { state: { order: response.data } });
        } catch (err) {
            setError('Failed to place order. Please try again.');
            console.error('Order error:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItemsDetails.length === 0) {
        return (
            <>
                <Header />
                <div className="cart-empty">
                    <h2>Your cart is empty</h2>
                    <Link to="/" className="continue-shopping">Continue Shopping</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="cart-container">
                <h2>Your Cart</h2>
                <div className="cart-items">
                    {cartItemsDetails.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.picUrl} alt={item.name} />
                            <div className="cart-item-info">
                                <h3>{item.name}</h3>
                                <p className="item-price">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="cart-quantity-controls">
                                <button className="quantity-btn" onClick={() => removeFromCart(item)}>-</button>
                                <span className="quantity-display">{item.quantity}</span>
                                <button className="quantity-btn" onClick={() => addToCart(item)}>+</button>
                            </div>
                            <p className="item-total">
                                <span>Total:</span>
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <div className="table-number-input">
                        <label htmlFor="tableNumber">Table Number:</label>
                        <input
                            type="number"
                            id="tableNumber"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            min="1"
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <h3>Total: ${total.toFixed(2)}</h3>
                    <button 
                        className="checkout-btn" 
                        onClick={handleCheckout}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Cart;
