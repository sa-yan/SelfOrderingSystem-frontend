import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState({});

    const addToCart = (item) => {
        setCartItems(prev => ({
            ...prev,
            [item.id]: (prev[item.id] || 0) + 1
        }));
    };

    const removeFromCart = (item) => {
        setCartItems(prev => {
            const newCart = { ...prev };
            if (newCart[item.id] === 1) {
                delete newCart[item.id];
            } else {
                newCart[item.id] = newCart[item.id] - 1;
            }
            return newCart;
        });
    };

    const toggleCartItem = (item) => {
        setCartItems(prev => {
            const newCart = { ...prev };
            if (newCart[item.id]) {
                delete newCart[item.id];
            } else {
                newCart[item.id] = 1;
            }
            return newCart;
        });
    };

    const clearCart = () => {
        setCartItems({});
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            toggleCartItem,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
