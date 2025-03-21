import React from 'react';
import styles from './MenuItem.module.css';

const MenuItem = ({ item, onAddToCart }) => {
    return (
        <div className={styles.menuItem}>
            <img src={item.image} alt={item.name} className={styles.itemImage} />
            <div className={styles.itemInfo}>
                <h3>{item.name}</h3>
                <p className={styles.description}>{item.description}</p>
                <div className={styles.priceCartContainer}>
                    <p className={styles.price}>${item.price}</p>
                    <button
                        className={styles.addToCartBtn}
                        onClick={() => onAddToCart(item)}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuItem;
