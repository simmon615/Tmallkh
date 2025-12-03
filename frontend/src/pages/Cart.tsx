import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from '../services/telegram';
import { Wallet, CreditCard, MapPin } from 'lucide-react';
import { PaymentMethod } from '../types';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { impact, notification } = useHaptic();
  
  // Mock cart
  const cartTotal = 299.00;
  const shipping = 2.50;
  const total = cartTotal + shipping;
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.DEFAULT);
  
  // Mock User balances
  const balances = {
      default: 120.00,
      shopping: 45.00
  };

  const handleCheckout = () => {
    // Logic to check balance
    const balance = balances[paymentMethod];
    if (balance < total) {
        notification('error');
        alert("Insufficient balance in selected wallet!");
        return;
    }

    impact('heavy');
    notification('success');
    alert("Order Placed Successfully!");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {/* Address */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-2 text-gray-500">
            <MapPin size={16} />
            <span className="text-xs font-bold uppercase tracking-wide">Delivery Location</span>
        </div>
        <div className="pl-6 border-l-2 border-gray-100">
             <p className="font-medium text-gray-900">Sopheak Tra</p>
             <p className="text-sm text-gray-500">+855 12 345 678</p>
             <p className="text-sm text-gray-500 mt-1">#123, St 456, Toul Tompoung, Phnom Penh</p>
        </div>
      </div>

      {/* Payment Method Selection - Mutually Exclusive */}
      <h2 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide ml-1">Payment Method</h2>
      <div className="space-y-3 mb-6">
        
        {/* Default Wallet */}
        <div 
            onClick={() => setPaymentMethod(PaymentMethod.DEFAULT)}
            className={`bg-white p-4 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center ${
                paymentMethod === PaymentMethod.DEFAULT ? 'border-blue-600 bg-blue-50' : 'border-transparent'
            }`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${paymentMethod === PaymentMethod.DEFAULT ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    <CreditCard size={20} />
                </div>
                <div>
                    <p className="font-bold text-sm">Top-up Balance</p>
                    <p className={`text-xs ${balances.default < total ? 'text-red-500' : 'text-gray-500'}`}>
                        Available: ${balances.default.toFixed(2)}
                    </p>
                </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === PaymentMethod.DEFAULT ? 'border-blue-600' : 'border-gray-300'}`}>
                {paymentMethod === PaymentMethod.DEFAULT && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
            </div>
        </div>

        {/* Shopping Wallet */}
        <div 
            onClick={() => setPaymentMethod(PaymentMethod.SHOPPING)}
            className={`bg-white p-4 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center ${
                paymentMethod === PaymentMethod.SHOPPING ? 'border-blue-600 bg-blue-50' : 'border-transparent'
            }`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${paymentMethod === PaymentMethod.SHOPPING ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    <Wallet size={20} />
                </div>
                <div>
                    <p className="font-bold text-sm">Shopping Balance</p>
                    <p className={`text-xs ${balances.shopping < total ? 'text-red-500' : 'text-gray-500'}`}>
                        Available: ${balances.shopping.toFixed(2)}
                    </p>
                </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === PaymentMethod.SHOPPING ? 'border-blue-600' : 'border-gray-300'}`}>
                {paymentMethod === PaymentMethod.SHOPPING && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
            </div>
        </div>

      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex justify-between mb-2 text-sm text-gray-500">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2 text-sm text-gray-500">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-100 my-2 pt-2 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
      >
        Pay Now
      </button>

    </div>
  );
};

export default Cart;
