import React from 'react';
import styles from './MenuItem.module.css';

const MenuItem = ({ item }) => {
    const handleAddToCart = () => {
        // You can implement cart management logic here
        // For example, using context or state management
        console.log(`Added ${item.name} to cart`);
    };

    return (
        <div className={styles.menuItem}>
      // ...existing code...
            <div className={styles.itemInfo}>
        // ...existing code...
                <button
                    className={styles.addButton}
                    onClick={handleAddToCart}
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default MenuItem;
