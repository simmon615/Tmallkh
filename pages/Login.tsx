import React, { useState } from 'react';
import { api } from '../services/mockApi';
import { useNavigate } from 'react-router-dom';
import { useHaptic, tg } from '../services/telegram';
import { UserPlus, CheckCircle, XCircle, Smartphone } from 'lucide-react';

const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [referrer, setReferrer] = useState('');
  const [referrerValid, setReferrerValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { impact, notification } = useHaptic();

  const handleReferrerBlur = async () => {
    if (!referrer) {
      setReferrerValid(null);
      return;
    }
    const isValid = await api.checkReferrer(referrer);
    setReferrerValid(isValid);
    if (isValid) impact('light');
    else notification('error');
  };

  const handleRequestContact = () => {
    impact('medium');
    // Simulate TG Request Contact
    setTimeout(() => {
        setPhone("12999999"); // Mocked response
        notification('success');
    }, 500);
  };

  const handleRegister = async () => {
    if (!phone || !referrer || !referrerValid) return;
    setLoading(true);
    impact('medium');
    await api.register(referrer, phone);
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
            
            {/* Simulation of Telegram Contact Button */}
            <button 
                onClick={handleRequestContact}
                className="mt-3 w-full bg-blue-50 text-blue-600 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
            >
                <Smartphone size={14} />
                Share Telegram Phone Number
            </button>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referrer ID (Required)</label>
            <div className="relative">
                <input 
                    type="number"
                    value={referrer}
                    onChange={(e) => {
                        setReferrer(e.target.value);
                        setReferrerValid(null);
                    }}
                    onBlur={handleReferrerBlur}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        referrerValid === false 
                        ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                        : referrerValid === true
                        ? 'border-green-300 focus:ring-green-500 bg-green-50'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter ID"
                />
                <div className="absolute right-3 top-3.5">
                    {referrerValid === true && <CheckCircle size={20} className="text-green-500" />}
                    {referrerValid === false && <XCircle size={20} className="text-red-500" />}
                </div>
            </div>
            {referrerValid === false && <p className="text-xs text-red-500 mt-1">Invalid Referrer ID.</p>}
            {referrerValid === null && <p className="text-xs text-gray-400 mt-1">You must have an invitation to join.</p>}
        </div>

        <button 
            onClick={handleRegister}
            disabled={!phone || !referrer || !referrerValid || loading}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg mt-6 disabled:bg-gray-300 disabled:shadow-none transition-all active:scale-95"
        >
            {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </div>
  );
};

export default Login;