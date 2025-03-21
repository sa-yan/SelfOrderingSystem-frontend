import React from 'react';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { menuItems } from '../data/menuData';
import './Cart.css';

const Cart = () => {
    const { cartItems, addToCart, removeFromCart } = useCart();

    const cartItemsDetails = Object.keys(cartItems).map(id => {
        const item = menuItems.find(item => item.id === parseInt(id));
        return {
            ...item,
            quantity: cartItems[id]
        };
    });

    const total = cartItemsDetails.reduce((sum, item) =>
        sum + (item.price * item.quantity), 0
    );

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
                            <img src={item.image} alt={item.name} />
                            <div className="cart-item-info">
                                <h3>{item.name}</h3>
                                <p className="item-price">${item.price}</p>
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
                    <h3>Total: ${total.toFixed(2)}</h3>
                    <button className="checkout-btn">Proceed to Checkout</button>
                </div>
            </div>
        </>
    );
};

export default Cart;
