import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { User } from '../types';
import { ArrowUpRight, ArrowRightLeft, Download, History, CreditCard, AlertCircle, Copy } from 'lucide-react';
import { useHaptic } from '../services/telegram';

const Wallet: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'topup' | 'exchange' | 'withdraw'>('topup');
  const [amount, setAmount] = useState('');
  const [transRef, setTransRef] = useState('');
  const [loading, setLoading] = useState(false);
  const { impact, notification } = useHaptic();

  useEffect(() => {
    api.checkRegistration().then(setUser);
  }, []);

  const handleTopUp = async () => {
    if (!amount || !transRef) return;
    setLoading(true);
    await api.submitTopUp(parseFloat(amount), transRef);
    setLoading(false);
    notification('success');
    setAmount('');
    setTransRef('');
    alert("Top-up request submitted!");
  };

  const handleExchange = async () => {
    if (!amount) return;
    setLoading(true);
    try {
        await api.exchangePoints(parseInt(amount));
        notification('success');
        api.checkRegistration().then(setUser); // Refresh
        setAmount('');
    } catch (e) {
        notification('error');
        alert(e);
    }
    setLoading(false);
  };

  if (!user) return <div className="p-6">Loading wallet...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header Card */}
      <div className="bg-blue-600 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-10 -translate-y-10"></div>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <p className="text-blue-100 text-sm">Total Assets</p>
            <h1 className="text-3xl font-bold">${(user.wallets.default + user.wallets.shopping).toFixed(2)}</h1>
          </div>
          <div className="bg-blue-500/50 p-2 rounded-full">
            <History size={20} className="text-white" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 relative z-10">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <p className="text-[10px] text-blue-100 uppercase tracking-wider mb-1">Top-Up Bal</p>
                <p className="font-semibold">${user.wallets.default.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <p className="text-[10px] text-blue-100 uppercase tracking-wider mb-1">Shopping</p>
                <p className="font-semibold">${user.wallets.shopping.toFixed(2)}</p>
            </div>
            <div className="bg-amber-400/20 border border-amber-300/30 p-3 rounded-xl backdrop-blur-sm">
                <p className="text-[10px] text-amber-100 uppercase tracking-wider mb-1">Points</p>
                <p className="font-semibold text-amber-100">{user.wallets.points}</p>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-2 flex justify-between">
            {[
                { id: 'topup', label: 'Top Up', icon: ArrowUpRight },
                { id: 'exchange', label: 'Exchange', icon: ArrowRightLeft },
                { id: 'withdraw', label: 'Withdraw', icon: Download },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => {
                        impact('light');
                        setActiveTab(tab.id as any);
                        setAmount('');
                    }}
                    className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all ${
                        activeTab === tab.id 
                        ? 'bg-blue-50 text-blue-600 shadow-sm' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                >
                    <tab.icon size={20} className="mb-1" />
                    <span className="text-xs font-medium">{tab.label}</span>
                </button>
            ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 mt-2">
        {activeTab === 'topup' && (
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-2">Bank Transfer</h3>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
                        <div className="bg-red-500 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold">ABA</div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500">Account Number</p>
                            <p className="font-mono font-medium text-gray-800">000 123 456</p>
                        </div>
                        <button className="text-blue-600"><Copy size={18}/></button>
                    </div>
                    
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        placeholder="0.00"
                    />

                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Ref ID (Required)</label>
                    <input 
                        type="text" 
                        value={transRef}
                        onChange={(e) => setTransRef(e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        placeholder="Last 8-9 digits"
                    />

                    <button 
                        onClick={handleTopUp}
                        disabled={loading || !amount || !transRef}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md disabled:bg-gray-300 disabled:shadow-none active:scale-95 transition-transform"
                    >
                        {loading ? 'Processing...' : 'Submit Request'}
                    </button>
                </div>
            </div>
        )}

        {activeTab === 'exchange' && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg mb-4">
                    <AlertCircle size={18} />
                    <p className="text-xs font-medium">10 Points = $1.00 Shopping Balance. Irreversible.</p>
                </div>

                <div className="mb-6 text-center">
                     <p className="text-sm text-gray-500 mb-1">Available Points</p>
                     <p className="text-3xl font-bold text-gray-800">{user.wallets.points}</p>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1">Points to Exchange</label>
                <div className="relative mb-6">
                    <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="0"
                    />
                    <div className="absolute right-3 top-3.5 text-sm font-medium text-gray-400">Pts</div>
                </div>

                <div className="flex justify-between items-center mb-6 px-2">
                    <span className="text-sm text-gray-500">You Receive:</span>
                    <span className="font-bold text-lg text-green-600">${((parseInt(amount || '0') / 10)).toFixed(2)}</span>
                </div>

                <button 
                    onClick={handleExchange}
                    disabled={loading || !amount}
                    className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl shadow-md shadow-amber-200 disabled:bg-gray-300 disabled:shadow-none active:scale-95 transition-transform"
                >
                    {loading ? 'Processing...' : 'Exchange Now'}
                </button>
            </div>
        )}

        {activeTab === 'withdraw' && (
             <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center">
                 <h3 className="text-gray-900 font-bold mb-4">Cash Out Points</h3>
                 <p className="text-sm text-gray-500 mb-6">Select a withdrawal tier. Funds will be sent to your registered bank account.</p>
                 
                 <div className="space-y-3">
                     {[
                         { pts: 110, usd: 10 },
                         { pts: 540, usd: 50 },
                         { pts: 1060, usd: 100 },
                     ].map(tier => (
                         <div key={tier.pts} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:border-blue-500 cursor-pointer" onClick={() => { impact('medium'); }}>
                             <div className="flex items-center gap-2">
                                 <div className="bg-amber-100 text-amber-600 font-bold text-xs px-2 py-1 rounded">{tier.pts} Pts</div>
                             </div>
                             <div className="font-bold text-gray-800">${tier.usd} Cash</div>
                         </div>
                     ))}
                 </div>
                 
                 <button className="mt-6 w-full py-3 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed">Select a Tier</button>
             </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
