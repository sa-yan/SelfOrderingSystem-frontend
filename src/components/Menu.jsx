import React, { useState } from 'react';
import { menuItems, categories } from '../data/menuData';
import Header from './Header';
import './Menu.css';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const Menu = () => {
  const { isDarkTheme } = useTheme();
  const { cartItems, toggleCartItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className={isDarkTheme ? 'dark' : ''}>
      <Header />
      <div className="menu-title">
        <h2>Our Menu</h2>
      </div>
      <div className="menu-container">
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="menu-items">
          {filteredItems.map(item => (
            <div key={item.id} className="menu-item">
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="item-info">
                <h3>{item.name}</h3>
                <p className="description">{item.description}</p>
                <div className="price-cart-container">
                  <p className="price">${item.price}</p>
                  <button
                    className={`add-to-cart-btn ${cartItems[item.id] ? 'added' : ''}`}
                    onClick={() => toggleCartItem(item)}
                  >
                    {cartItems[item.id] ? '✓' : '+'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
