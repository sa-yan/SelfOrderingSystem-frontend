import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import AdminLogin from './components/AdminLogin';
import AdminMenu from './components/AdminMenu';
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
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/menu" element={<AdminMenu />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
