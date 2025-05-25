import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import AdminMenuItemEdit from './AdminMenuItemEdit';
import axios from '../utils/axiosConfig';
import './AdminMenu.css';

const AdminMenu = () => {
    const { isDarkTheme } = useTheme();
    const navigate = useNavigate();
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
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/menu`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-ADMIN-API-KEY': 'SAYAN2003'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Response:', data);
                alert('Menu item added successfully');
                navigate('/');
            } else {
                throw new Error(`Server responded with ${response.status}`);
            }
        } catch (error) {
            console.error('Error details:', error);
            if (error.message.includes('Server responded')) {
                alert(`Server error: ${error.message}`);
            } else {
                alert(`Error: ${error.message}`);
            }
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
                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                        onClick={() => setActiveTab('list')}
                    >
                        Menu Items List
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
                        onClick={() => setActiveTab('add')}
                    >
                        Add New Item
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'list' ? (
                        <div className="menu-items-list">
                            {menuItems.map(item => (
                                <div key={item.id} className="menu-item-row">
                                    <div className="item-info">
                                        <h3>{item.name}</h3>
                                        <p>
                                            {item.category} - ${item.price} -
                                            {item.isavailable ?
                                                <span className="status available">Available</span> :
                                                <span className="status unavailable">Unavailable</span>
                                            }
                                        </p>
                                    </div>
                                    <button
                                        className="edit-btn"
                                        onClick={() => setEditingItem(item)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="admin-menu-form">
                            <h2>Add Menu Item</h2>
                            <input
                                type="text"
                                placeholder="Name"
                                value={menuItem.name}
                                onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
                            />
                            <textarea
                                placeholder="Description"
                                value={menuItem.description}
                                onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Category"
                                value={menuItem.category}
                                onChange={(e) => setMenuItem({ ...menuItem, category: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={menuItem.price}
                                onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
                            />
                            <div className="checkbox-container">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={menuItem.isavailable}
                                        onChange={(e) => setMenuItem({ ...menuItem, isavailable: e.target.checked })}
                                    />
                                    Available
                                </label>
                            </div>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <button type="submit" disabled={isLoading} className={isLoading ? 'loading' : ''}>
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
