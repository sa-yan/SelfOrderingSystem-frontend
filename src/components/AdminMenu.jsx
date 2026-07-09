import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import AdminMenuItemEdit from './AdminMenuItemEdit';
import axios from '../utils/axiosConfig';
import { FaListUl, FaPlus, FaPen } from 'react-icons/fa';
import './AdminMenu.css';

const AdminMenu = () => {
    const { isDarkTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('list');
    const [isLoading, setIsLoading] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [menuItem, setMenuItem] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        isavailable: true
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await axios.get('/api/menu');
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('menuItem', JSON.stringify(menuItem));
        if (file) {
            formData.append('image', file);
        }

        try {
            await axios.post('/api/menu', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Menu item added successfully');
            setMenuItem({ name: '', description: '', category: '', price: '', isavailable: true });
            setFile(null);
            setActiveTab('list');
            fetchMenuItems();
        } catch (error) {
            console.error('Error adding menu item:', error);
            const message = error.response?.data?.message || error.message;
            alert(`Failed to add menu item: ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateItem = (updatedItem) => {
        setMenuItems(items =>
            items.map(item => item.id === updatedItem.id ? updatedItem : item)
        );
    };

    const handleDeleteItem = (deletedItemId) => {
        setMenuItems(items => items.filter(item => item.id !== deletedItemId));
    };

    return (
        <div className={`admin-menu-container ${isDarkTheme ? 'dark' : ''}`}>
            <div className="admin-panel">
                <div className="admin-toolbar">
                    <h2 className="admin-toolbar-title">Menu Management</h2>
                    <div className="admin-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                            onClick={() => setActiveTab('list')}
                        >
                            <FaListUl aria-hidden="true" />
                            <span>Menu Items</span>
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
                            onClick={() => setActiveTab('add')}
                        >
                            <FaPlus aria-hidden="true" />
                            <span>Add Item</span>
                        </button>
                    </div>
                </div>

                <div className="tab-content">
                    {activeTab === 'list' ? (
                        <div className="menu-items-list">
                            {menuItems.length === 0 && (
                                <div className="admin-empty-state">
                                    <p>No menu items yet. Add your first item to get started.</p>
                                </div>
                            )}
                            {menuItems.map(item => (
                                <div key={item.id} className="menu-item-row">
                                    <img
                                        className="admin-item-thumb"
                                        src={item.picUrl}
                                        alt={item.name}
                                        loading="lazy"
                                    />
                                    <div className="admin-item-info">
                                        <h3>{item.name}</h3>
                                        <p className="admin-item-meta">
                                            <span className="admin-item-category">{item.category}</span>
                                            <span className="admin-item-price">₹{item.price}</span>
                                            {item.isavailable ?
                                                <span className="status available">Available</span> :
                                                <span className="status unavailable">Out of stock</span>
                                            }
                                        </p>
                                    </div>
                                    <button
                                        className="edit-btn"
                                        onClick={() => setEditingItem(item)}
                                    >
                                        <FaPen aria-hidden="true" />
                                        <span>Edit</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="admin-menu-form">
                            <h2>Add Menu Item</h2>
                            <div className="form-grid">
                                <div className="form-field full">
                                    <label htmlFor="add-name">Name</label>
                                    <input
                                        id="add-name"
                                        type="text"
                                        placeholder="e.g. Paneer Tikka"
                                        value={menuItem.name}
                                        onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-field full">
                                    <label htmlFor="add-description">Description</label>
                                    <textarea
                                        id="add-description"
                                        placeholder="A short, tasty description"
                                        value={menuItem.description}
                                        onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
                                    />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="add-category">Category</label>
                                    <input
                                        id="add-category"
                                        type="text"
                                        placeholder="e.g. Starters"
                                        value={menuItem.category}
                                        onChange={(e) => setMenuItem({ ...menuItem, category: e.target.value })}
                                    />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="add-price">Price (₹)</label>
                                    <input
                                        id="add-price"
                                        type="number"
                                        placeholder="0"
                                        value={menuItem.price}
                                        onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
                                    />
                                </div>
                                <div className="form-field full checkbox-container">
                                    <label className="switch-label">
                                        <input
                                            type="checkbox"
                                            checked={menuItem.isavailable}
                                            onChange={(e) => setMenuItem({ ...menuItem, isavailable: e.target.checked })}
                                        />
                                        <span>Available for ordering</span>
                                    </label>
                                </div>
                                <div className="form-field full">
                                    <label htmlFor="add-image">Item image</label>
                                    <input
                                        id="add-image"
                                        type="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`btn-primary admin-submit-btn ${isLoading ? 'loading' : ''}`}
                            >
                                {isLoading ? (
                                    <div className="spinner-container">
                                        <div className="spinner"></div>
                                        <span>Adding Item...</span>
                                    </div>
                                ) : (
                                    'Add Menu Item'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {editingItem && (
                <AdminMenuItemEdit
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onUpdate={handleUpdateItem}
                    onDelete={handleDeleteItem}
                />
            )}
        </div>
    );
};

export default AdminMenu;
