import React, { useEffect, useState } from 'react';
import { User, Settings, Package, HelpCircle, LogOut, ChevronRight, Copy } from 'lucide-react';
import { api } from '../services/mockApi';
import { User as UserType } from '../types';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from '../services/telegram';

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();
  const { impact } = useHaptic();

  useEffect(() => {
    api.checkRegistration().then(setUser);
  }, []);

  const handleNav = (path: string) => {
    impact('light');
    navigate(path);
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white p-6 pt-8 pb-8 rounded-b-[2rem] shadow-sm mb-6">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">
                {user.first_name.charAt(0)}
            </div>
            <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">{user.first_name} {user.username && `(@${user.username})`}</h1>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">ID: {user.telegram_id}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 space-y-4">
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button 
                onClick={() => handleNav('/orders')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Package size={20} /></div>
                    <span className="font-medium text-gray-800">My Orders</span>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="bg-green-50 p-2 rounded-lg text-green-600"><Copy size={20} /></div>
                    <span className="font-medium text-gray-800">Referral Link</span>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
            </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-50 p-2 rounded-lg text-gray-600"><Settings size={20} /></div>
                    <span className="font-medium text-gray-800">Settings</span>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-50 p-2 rounded-lg text-gray-600"><HelpCircle size={20} /></div>
                    <span className="font-medium text-gray-800">Support</span>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
            </button>
        </div>
        
        <button className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-medium text-sm">
            <LogOut size={16} />
            <span>Log Out</span>
        </button>

      </div>
    </div>
  );
};

export default Profile;
