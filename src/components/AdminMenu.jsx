import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import './AdminMenu.css';

const AdminMenu = () => {
    const { isDarkTheme } = useTheme();
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
        const formData = new FormData();
        formData.append('menuItem', JSON.stringify(menuItem));
        if (file) {
            formData.append('file', file);
        }

        const config = {
            method: 'post',
            url: 'http://localhost:8080/api/menu/admin',
            data: formData,
            headers: { 
                'X-ADMIN-API-KEY': 'SAYAN2003',
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*'
            },
            withCredentials: false,
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        };

        try {
            const response = await axios(config);
            
            if (response.status === 200) {
                console.log('Response:', response.data);
                alert('Menu item added successfully');
                setMenuItem({
                    name: '',
                    description: '',
                    category: '',
                    price: '',
                    isavailable: true
                });
                setFile(null);
                if (document.querySelector('input[type="file"]')) {
                    document.querySelector('input[type="file"]').value = '';
                }
            }
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                request: error.request
            });
            
            if (error.response) {
                // Server responded with error
                alert(`Server error: ${error.response.data}`);
            } else if (error.request) {
                // Request made but no response
                alert('No response from server. Please check if the backend is running.');
            } else {
                // Error in request setup
                alert(`Error: ${error.message}`);
            }
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
                    onChange={(e) => setMenuItem({...menuItem, name: e.target.value})}
                />
                <textarea
                    placeholder="Description"
                    value={menuItem.description}
                    onChange={(e) => setMenuItem({...menuItem, description: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={menuItem.category}
                    onChange={(e) => setMenuItem({...menuItem, category: e.target.value})}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={menuItem.price}
                    onChange={(e) => setMenuItem({...menuItem, price: e.target.value})}
                />
                <div className="checkbox-container">
                    <label>
                        <input
                            type="checkbox"
                            checked={menuItem.isavailable}
                            onChange={(e) => setMenuItem({...menuItem, isavailable: e.target.checked})}
                        />
                        Available
                    </label>
                </div>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button type="submit">Add Menu Item</button>
            </form>
        </div>
    );
};

export default AdminMenu;
