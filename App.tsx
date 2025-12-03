import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Wallet from './pages/Wallet';
import Cart from './pages/Cart';
import Login from './pages/Login';
import BottomNav from './components/BottomNav';
import { api } from './services/mockApi';
import { tg } from './services/telegram';

const App: React.FC = () => {
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  useEffect(() => {
    // Initial App Setup
    tg.ready();
    tg.expand();
    
    const checkAuth = async () => {
        try {
            const user = await api.checkRegistration();
            setIsRegistered(user.is_registered);
        } catch {
            setIsRegistered(false);
        }
    };
    checkAuth();
  }, []);

  if (isRegistered === null) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>;
  }

  return (
    <HashRouter>
      <div className="font-sans antialiased text-gray-900 max-w-md mx-auto min-h-screen shadow-2xl bg-white relative">
        <Routes>
          <Route path="/login" element={isRegistered ? <Navigate to="/" /> : <Login />} />
          <Route path="/" element={!isRegistered ? <Navigate to="/login" /> : <Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        {isRegistered && <BottomNav />}
      </div>
    </HashRouter>
  );
};

export default App;
