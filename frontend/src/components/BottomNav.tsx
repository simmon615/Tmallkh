import React from 'react';
import { Home, ShoppingBag, Wallet, User as UserIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHaptic } from '../services/telegram';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { impact } = useHaptic();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/cart', icon: ShoppingBag, label: 'Cart' },
    { path: '/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/profile', icon: UserIcon, label: 'Profile' },
  ];

  const handleNav = (path: string) => {
    if (location.pathname !== path) {
      impact('light');
      navigate(path);
    }
  };

  // Don't show on product detail, checkout or login
  const hidePaths = ['/product/', '/checkout', '/login'];
  if (hidePaths.some(p => location.pathname.startsWith(p))) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe pt-2 px-6 flex justify-between items-center z-50 h-[80px]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path === '/profile' && location.pathname === '/orders');
        return (
          <button
            key={item.path}
            onClick={() => handleNav(item.path)}
            className={`flex flex-col items-center space-y-1 w-16 transition-colors duration-200 ${
              isActive ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
