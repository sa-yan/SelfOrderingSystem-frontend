import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';
import { useTheme } from '../context/ThemeContext';

const Navigation = () => {
  const { isDarkTheme } = useTheme();

  return (
    <nav className={`nav-container ${isDarkTheme ? 'dark' : ''}`}>
      <div className="nav-content">
        <Link to="/" className="nav-brand">Food Corner</Link>
        <div className="nav-links">
          <Link to="/">Menu</Link>
          <Link to="/cart">Cart</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
