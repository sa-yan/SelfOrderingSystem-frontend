import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import './App.css';

const AppContent = () => {
  const { isDarkTheme } = useTheme();

  return (
    <div className={`app ${isDarkTheme ? 'dark' : ''}`}>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
