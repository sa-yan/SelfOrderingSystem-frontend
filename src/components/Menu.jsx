import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import Header from './Header';
import './Menu.css';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const Menu = () => {
  const { isDarkTheme } = useTheme();
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/menu`)
      .then(response => {
        setMenuItems(response.data);
        const uniqueCategories = ['all', ...new Set(response.data.map(item => item.category))];
        setCategories(uniqueCategories);
      })
      .catch(error => {
        console.error('Error fetching menu items:', error);
        setLoadError('Could not load the menu. Please try again in a moment.');
      })
      .finally(() => setIsLoading(false));
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
        <p className="menu-eyebrow">Freshly made, straight to your table</p>
        <h2>Our Menu</h2>
        <div className="search-container">
          <FaSearch className="search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search dishes, categories..."
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
          {isLoading ? (
            <div className="no-results">
              <div className="spinner" style={{ margin: '0 auto 0.75rem' }} />
              <p>Loading menu…</p>
            </div>
          ) : loadError ? (
            <div className="no-results">
              <p>{loadError}</p>
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id} className={`menu-item ${!item.isavailable ? 'out-of-stock' : ''}`}>
                <img src={item.picUrl} alt={item.name} className="item-image" />
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="description">{item.description}</p>
                  <div className="price-cart-container">
                    <p className="price">₹{item.price}</p>
                    {!item.isavailable && <span className="unavailable-badge">Out of Stock</span>}
                    {item.isavailable && (
                      cartItems[item.id] ? (
                        <div className="qty-stepper" aria-label={`Quantity of ${item.name}`}>
                          <button
                            className="qty-btn"
                            onClick={() => removeFromCart(item)}
                            aria-label="Remove one"
                          >
                            −
                          </button>
                          <span className="qty-count">{cartItems[item.id]}</span>
                          <button
                            className="qty-btn"
                            onClick={() => addToCart(item)}
                            aria-label="Add one"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className="add-to-cart-btn"
                          onClick={() => addToCart(item)}
                          aria-label={`Add ${item.name} to cart`}
                        >
                          +
                        </button>
                      )
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
