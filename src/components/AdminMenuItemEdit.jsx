import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import './AdminMenuItemEdit.css';

const AdminMenuItemEdit = ({ item, onClose, onUpdate, onDelete }) => {
    const [editedItem, setEditedItem] = useState(item);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Convert editedItem to JSON string for PUT request
            const response = await axios.put(`/api/menu/${item.id}`, JSON.stringify(editedItem), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            onUpdate(response.data);
            onClose();
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Failed to update item');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvailabilityToggle = async () => {
        setIsLoading(true);
        try {
            const response = await axios.patch(`/api/menu/${item.id}/avilability`, null, {
                params: { availability: !editedItem.isavailable },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            onUpdate(response.data);
            setEditedItem(response.data);
        } catch (error) {
            console.error('Error toggling availability:', error);
            alert('Failed to update availability');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setIsLoading(true);
            try {
                await axios.delete(`/api/menu/${item.id}`);
                onDelete(item.id);
                onClose();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Failed to delete item');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="edit-modal">
            <div className="edit-modal-content">
                <h2>Edit Menu Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            value={editedItem.name}
                            onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            value={editedItem.description}
                            onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Price:</label>
                        <input
                            type="number"
                            step="0.01"
                            value={editedItem.price}
                            onChange={(e) => setEditedItem({ ...editedItem, price: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Category:</label>
                        <input
                            type="text"
                            value={editedItem.category}
                            onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })}
                        />
                    </div>
                    <div className="availability-toggle">
                        <button
                            type="button"
                            onClick={handleAvailabilityToggle}
                            className={`toggle-btn ${editedItem.isavailable ? 'available' : 'unavailable'}`}
                        >
                            {editedItem.isavailable ? 'Available' : 'Unavailable'}
                        </button>
                    </div>
                    <div className="button-group">
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="delete-btn"
                            disabled={isLoading}
                        >
                            Delete Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminMenuItemEdit;
