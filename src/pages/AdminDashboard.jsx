import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useTheme } from '../context/ThemeContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { isAdmin, logout } = useAdmin();
    const { isDarkTheme } = useTheme();
    const navigate = useNavigate();
    const [newItem, setNewItem] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        image: ''
    });

    React.useEffect(() => {
        if (!isAdmin) {
            navigate('/admin/login');
        }
    }, [isAdmin, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add logic to save the menu item
        console.log('New item:', newItem);
        // Reset form
        setNewItem({
            name: '',
            category: '',
            description: '',
            price: '',
            image: ''
        });
    };

    return (
        <div className={`${isDarkTheme ? 'dark' : ''}`}>
            <div className="admin-dashboard">
                <div className="admin-header">
                    <h2>Admin Dashboard</h2>
                    <button onClick={() => {
                        logout();
                        navigate('/admin/login');
                    }}>Logout</button>
                </div>

                <form onSubmit={handleSubmit} className="add-item-form">
                    <h3>Add New Menu Item</h3>

                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category:</label>
                        <select
                            value={newItem.category}
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            required
                        >
                            <option value="">Select category</option>
                            <option value="burgers">Burgers</option>
                            <option value="pizzas">Pizzas</option>
                            <option value="pasta">Pasta</option>
                            <option value="salads">Salads</option>
                            <option value="desserts">Desserts</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Price:</label>
                        <input
                            type="number"
                            step="0.01"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Image URL:</label>
                        <input
                            type="url"
                            value={newItem.image}
                            onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit">Add Item</button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
