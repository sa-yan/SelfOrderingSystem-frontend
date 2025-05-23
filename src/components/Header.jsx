import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaUtensils, FaBars, FaTimes } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
    const { isDarkTheme } = useTheme();
    const { cartItems } = useCart();
    const location = useLocation();
    const isCartPage = location.pathname === '/cart';

    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    const cartItemCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

    return (
        <header className={`header ${isDarkTheme ? 'dark' : ''}`}>
            <div className="header-content">
                <Link to="/" className="logo" onClick={closeMenu}>
                    <span className="logo-text">Food</span>
                    <span className="logo-accent">Corner</span>
                </Link>

                <button className="mobile-menu-btn" onClick={toggleMenu}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
                    <NavLink to="/" className="nav-link" onClick={closeMenu}>
                        Menu
                    </NavLink>
                    <NavLink to="/admin" className="nav-link admin-link" onClick={closeMenu}>
                        <FaUser className="nav-icon" /> Admin
                    </NavLink>
                    <NavLink to="/kitchen" className="nav-link" onClick={closeMenu}>
                        <FaUtensils className="nav-icon" /> Kitchen
                    </NavLink>
                    <NavLink to="/track-order" className="nav-link" onClick={closeMenu}>
                        Track Order
                    </NavLink>
                    {!isCartPage && (
                        <Link to="/cart" className="nav-link cart-link" onClick={closeMenu}>
                            <FaShoppingCart className="nav-icon" />
                            {cartItemCount > 0 && (
                                <span className="cart-badge">{cartItemCount}</span>
                            )}
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
