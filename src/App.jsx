import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Cart from './pages/Cart';
import AdminLogin from './components/AdminLogin';
import AdminMenu from './components/AdminMenu';
import ThankYou from './pages/ThankYou';
import Kitchen from './components/Kitchen';
import OrderStatus from './pages/OrderStatus';
import RazorpayPayment from './components/RazorpayPayment';
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
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/menu" element={<AdminMenu />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/track-order" element={<OrderStatus />} />
        <Route path="/payment" element={<RazorpayPayment />} />
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
