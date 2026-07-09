import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import { FaTrash } from 'react-icons/fa';
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
                {editedItem.picUrl && (
                    <div className="edit-image-preview">
                        <img src={editedItem.picUrl} alt={editedItem.name} />
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="edit-form-grid">
                        <div className="form-group full">
                            <label htmlFor="edit-name">Name</label>
                            <input
                                id="edit-name"
                                type="text"
                                value={editedItem.name}
                                onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group full">
                            <label htmlFor="edit-description">Description</label>
                            <textarea
                                id="edit-description"
                                value={editedItem.description}
                                onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit-price">Price (₹)</label>
                            <input
                                id="edit-price"
                                type="number"
                                step="0.01"
                                value={editedItem.price}
                                onChange={(e) => setEditedItem({ ...editedItem, price: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit-category">Category</label>
                            <input
                                id="edit-category"
                                type="text"
                                value={editedItem.category}
                                onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="availability-toggle">
                        <span className="availability-label">Availability</span>
                        <button
                            type="button"
                            onClick={handleAvailabilityToggle}
                            className={`toggle-btn ${editedItem.isavailable ? 'available' : 'unavailable'}`}
                            role="switch"
                            aria-checked={editedItem.isavailable}
                        >
                            <span className="toggle-knob" aria-hidden="true"></span>
                            {editedItem.isavailable ? 'Available' : 'Out of stock'}
                        </button>
                    </div>
                    <div className="button-group">
                        <button type="submit" className="btn-primary save-btn" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="delete-btn"
                            disabled={isLoading}
                        >
                            <FaTrash aria-hidden="true" />
                            <span>Delete</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminMenuItemEdit;
