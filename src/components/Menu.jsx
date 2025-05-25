import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import './Menu.css';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const Menu = () => {
  const { isDarkTheme } = useTheme();
  const { cartItems, toggleCartItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log(`${import.meta.env.VITE_REACT_APP_API_URL}`)
    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/menu`)
      .then(response => {
        setMenuItems(response.data);
        const uniqueCategories = ['all', ...new Set(response.data.map(item => item.category))];
        setCategories(uniqueCategories);
      })
      .catch(error => console.error('Error fetching menu items:', error));
  }, []);

  const filteredItems = menuItems
    .filter(item => {
      const matchesCategory = selectedCategory === 'all' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });

  return (
    <div className={isDarkTheme ? 'dark' : ''}>
      <Header />
      <div className="menu-title">
        <h2>Our Menu</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
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
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id} className={`menu-item ${!item.isavailable ? 'out-of-stock' : ''}`}>
                <img src={item.picUrl} alt={item.name} className="item-image" />
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="description">{item.description}</p>
                  <div className="price-cart-container">
                    <p className="price">${item.price}</p>
                    {!item.isavailable && <span className="unavailable-badge">Out of Stock</span>}
                    {item.isavailable && (
                      <button
                        className={`add-to-cart-btn ${cartItems[item.id] ? 'added' : ''}`}
                        onClick={() => toggleCartItem(item)}
                      >
                        {cartItems[item.id] ? '✓' : '+'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No items matched your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
