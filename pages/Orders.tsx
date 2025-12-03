import React, { useEffect, useState } from 'react';
import { api } from '../services/mockApi';
import { Order } from '../types';
import { Package, Truck, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { useHaptic } from '../services/telegram';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const { impact, notification } = useHaptic();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await api.getOrders();
    // Sort by date desc
    setOrders(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setLoading(false);
  };

  const handleConfirm = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm("Confirm you have received this order?")) return;
    
    setProcessingId(id);
    impact('heavy');
    
    await api.confirmReceipt(id);
    
    notification('success');
    setProcessingId(null);
    loadOrders(); // Refresh
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { color: 'bg-gray-100 text-gray-500', icon: Clock, label: 'Pending' };
      case 'processing': return { color: 'bg-blue-50 text-blue-600', icon: Package, label: 'Processing' };
      case 'shipped': return { color: 'bg-amber-50 text-amber-600', icon: Truck, label: 'Shipped' };
      case 'delivered': return { color: 'bg-green-50 text-green-600', icon: CheckCircle, label: 'Delivered' };
      default: return { color: 'bg-gray-100 text-gray-400', icon: Package, label: status };
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-400">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map(order => {
          const config = getStatusConfig(order.status);
          const StatusIcon = config.icon;
          
          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                    <span className="text-xs text-gray-400">Order #{order.id}</span>
                    <p className="text-sm font-bold text-gray-800">{order.date}</p>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
                    <StatusIcon size={12} />
                    <span>{config.label}</span>
                </div>
              </div>

              <div className="border-t border-b border-gray-50 py-3 mb-3 space-y-2">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600 truncate w-2/3">{item.quantity}x {item.name}</span>
                        <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                    </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-gray-900">${order.total.toFixed(2)}</span>
                
                {order.status === 'shipped' && (
                  <button 
                    onClick={(e) => handleConfirm(e, order.id)}
                    disabled={processingId === order.id}
                    className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md active:scale-95 transition-transform disabled:bg-gray-300"
                  >
                    {processingId === order.id ? 'Updating...' : 'Confirm Receipt'}
                  </button>
                )}
                
                {order.status !== 'shipped' && (
                     <button className="text-gray-400 flex items-center text-xs">
                        Details <ChevronRight size={14} />
                     </button>
                )}
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
            <div className="text-center py-10 text-gray-400">
                <Package size={48} className="mx-auto mb-2 opacity-20" />
                <p>No orders found</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Orders;