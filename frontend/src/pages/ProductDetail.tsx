import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, Share2, Sparkles, Truck } from 'lucide-react';
import { api } from '../services/mockApi';
import { Product } from '../types';
import { useHaptic, tg } from '../services/telegram';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const { impact, notification } = useHaptic();

  useEffect(() => {
    // Show back button on TG
    tg.BackButton.show();
    tg.BackButton.onClick(() => navigate(-1));
    return () => {
      tg.BackButton.hide();
      tg.BackButton.onClick(() => {});
    };
  }, [navigate]);

  useEffect(() => {
    if (id) {
      api.getProducts().then(products => {
        const p = products.find(p => p.id === parseInt(id));
        if (p) {
            setProduct(p);
            if (p.variants.length > 0) setSelectedVariant(p.variants[0].id);
        }
      });
    }
  }, [id]);

  const handleAddToCart = () => {
    impact('medium');
    notification('success');
    // In a real app, dispatch to context/redux
    navigate('/cart');
  };

  if (!product) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="bg-white min-h-screen pb-24 relative">
      {/* Header Image */}
      <div className="relative h-96 bg-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <button 
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-white/80 p-2 rounded-full backdrop-blur-sm shadow-sm z-10"
        >
            <ChevronLeft size={24} />
        </button>
        <button className="absolute top-4 right-4 bg-white/80 p-2 rounded-full backdrop-blur-sm shadow-sm z-10">
            <Share2 size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="-mt-6 relative bg-white rounded-t-3xl p-6 shadow-xl">
        <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight w-3/4">{product.name}</h1>
            <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
            </div>
        </div>

        {/* Cashback Banner */}
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-center gap-3 mb-6">
            <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                <Sparkles size={18} />
            </div>
            <div>
                <p className="text-sm font-bold text-amber-900">Cashback Reward</p>
                <p className="text-xs text-amber-700">You earn {Math.floor(product.reward_points / 2)} points. Upline earns {Math.floor(product.reward_points / 2)} points.</p>
            </div>
        </div>

        {/* Variants */}
        <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Select Variant</h3>
            <div className="flex flex-wrap gap-2">
                {product.variants.map(v => (
                    <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                            selectedVariant === v.id 
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                        {v.name}
                    </button>
                ))}
            </div>
        </div>

        {/* Description */}
        <div className="mb-8">
            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
                Experience premium quality with our {product.name}. Designed for comfort and durability. 
                Perfect for daily use. Shipping calculated at checkout based on your location.
            </p>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe z-50">
        <div className="flex gap-4">
             <div className="flex-1 flex flex-col justify-center">
                 <span className="text-xs text-gray-500">Total Price</span>
                 <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
             </div>
             <button 
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
             >
                <ShoppingBag size={20} />
                Buy Now
             </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
