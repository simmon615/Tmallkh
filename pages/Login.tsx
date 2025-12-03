import React, { useState } from 'react';
import { api } from '../services/mockApi';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from '../services/telegram';
import { UserPlus } from 'lucide-react';

const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [referrer, setReferrer] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { impact } = useHaptic();

  const handleRegister = async () => {
    if (!phone || !referrer) return;
    setLoading(true);
    impact('medium');
    await api.register(referrer);
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col justify-center">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <UserPlus size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome</h1>
        <p className="text-gray-500">Join the social e-commerce revolution</p>
      </div>

      <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="flex">
                <div className="bg-gray-100 border border-gray-300 rounded-l-lg px-3 flex items-center text-gray-500 text-sm border-r-0">
                    +855
                </div>
                <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12 345 678"
                />
            </div>
            {/* Telegram Native Contact Button would go here in real app */}
            <button className="mt-2 text-xs text-blue-600 font-medium">Use Telegram Number</button>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referrer ID (Required)</label>
            <input 
                type="number"
                value={referrer}
                onChange={(e) => setReferrer(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter ID"
            />
            <p className="text-xs text-gray-400 mt-1">You must have an invitation to join.</p>
        </div>

        <button 
            onClick={handleRegister}
            disabled={!phone || !referrer || loading}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg mt-6 disabled:bg-gray-300 disabled:shadow-none"
        >
            {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </div>
  );
};

export default Login;
