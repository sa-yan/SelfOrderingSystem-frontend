import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import './AdminMenu.css';

const AdminMenu = () => {
    const { isDarkTheme } = useTheme();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [menuItem, setMenuItem] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        isavailable: true
    });
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('menuItem', JSON.stringify(menuItem));
        if (file) {
            formData.append('image', file);
        }

        try {
            const response = await fetch('http://localhost:8080/api/menu', {
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

    return (
        <div className={`admin-menu-container ${isDarkTheme ? 'dark' : ''}`}>
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
        </div>
    );
};

export default AdminMenu;
