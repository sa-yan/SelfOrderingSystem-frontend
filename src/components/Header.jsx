import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Header.css';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const Header = () => {
    const { isDarkTheme } = useTheme();
    const { cartItems } = useCart();
    const location = useLocation();
    const isCartPage = location.pathname === '/cart';
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className={`header ${isDarkTheme ? 'dark' : ''}`}>
            <div className="header-content">
                <Link to="/" className="logo" onClick={closeMenu}>
                    <span className="logo-text">Food</span>
                    <span className="logo-accent">Corner</span>
                </Link>

                <button className="mobile-menu-btn" onClick={toggleMenu}>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                    <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
                        Menu
                    </NavLink>
                    <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
                        About
                    </NavLink>
                    <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
                        Contact
                    </NavLink>
                </nav>

                <div className="header-actions">
                    {!isCartPage && (
                        <Link to="/cart" className="cart-link" onClick={closeMenu}>
                            <FaShoppingCart />
                            {Object.values(cartItems).reduce((a, b) => a + b, 0) > 0 && (
                                <span className="cart-badge">
                                    {Object.values(cartItems).reduce((a, b) => a + b, 0)}
                                </span>
                            )}
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
