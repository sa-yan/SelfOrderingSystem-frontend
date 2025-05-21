import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Header.css';
import { FaShoppingCart, FaUser, FaUtensils } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const Header = () => {
    const { isDarkTheme } = useTheme();
    const { cartItems } = useCart();
    const location = useLocation();
    const isCartPage = location.pathname === '/cart';

    const cartItemCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

    return (
        <header className={`header ${isDarkTheme ? 'dark' : ''}`}>
            <div className="header-content">
                <Link to="/" className="logo">
                    <span className="logo-text">Food</span>
                    <span className="logo-accent">Corner</span>
                </Link>

                <nav className="nav-menu">
                    <NavLink to="/" className="nav-link">
                        Menu
                    </NavLink>
                    <NavLink to="/admin" className="nav-link admin-link">
                        <FaUser className="nav-icon" /> Admin
                    </NavLink>
                    <NavLink to="/kitchen" className="nav-link">
                        <FaUtensils className="nav-icon" /> Kitchen
                    </NavLink>
                    <NavLink to="/track-order" className="nav-link">
                        Track Order
                    </NavLink>
                    {!isCartPage && (
                        <Link to="/cart" className="nav-link cart-link">
                            <FaShoppingCart className="nav-icon" />
                            {cartItemCount > 0 && (
                                <span className="cart-badge">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
