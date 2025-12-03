import React, { useEffect, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { api } from '../services/mockApi';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { ProductSkeleton } from '../components/Skeleton';
import { useHaptic } from '../services/telegram';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { impact } = useHaptic();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await api.getProducts(search);
      setProducts(data);
      setLoading(false);
    };
    // Debounce search
    const timeout = setTimeout(fetch, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleProductClick = (id: number) => {
    impact('light');
    navigate(`/product/${id}`);
  };

  return (
    <div className="pb-24 pt-4 px-4 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Discover</h1>
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Sparkles size={12} />
          <span>Double Points</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
      </div>

      {/* Banner */}
      <div className="mb-8 relative overflow-hidden rounded-2xl shadow-lg h-40 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center p-6 text-white">
        <div className="z-10">
          <h2 className="text-xl font-bold mb-1">Invite Friends</h2>
          <p className="text-blue-100 text-sm mb-3">Earn infinite commissions up to 50 levels deep!</p>
          <button className="bg-white text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-md active:scale-95 transition-transform">
            Get Link
          </button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4">
           <Sparkles size={120} />
        </div>
      </div>

      {/* Product Grid */}
      <h3 className="font-bold text-lg text-gray-800 mb-4">Trending Now</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
          : products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="bg-white p-3 rounded-xl shadow-sm active:scale-[0.98] transition-transform duration-100 cursor-pointer"
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-medium text-gray-800 text-sm line-clamp-2 h-10 leading-tight mb-1">
                  {product.name}
                </h4>
                <div className="flex items-end justify-between">
                  <span className="font-bold text-lg text-gray-900">${product.price.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md w-fit">
                    <Sparkles size={10} />
                    <span>Get {Math.floor(product.reward_points / 2)} Pts</span>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Home;
