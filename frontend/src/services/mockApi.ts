import { Product, User, Transaction, Order } from '../types';

// Mock Data
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones",
    price: 299.00,
    image: "https://picsum.photos/300/300?random=1",
    reward_points: 600,
    variants: [{ id: 101, name: "Black", sku: "WNH-BLK" }, { id: 102, name: "Silver", sku: "WNH-SLV" }]
  },
  {
    id: 2,
    name: "Smart Fitness Watch Pro",
    price: 149.50,
    image: "https://picsum.photos/300/300?random=2",
    reward_points: 300,
    variants: [{ id: 201, name: "Standard", sku: "SFW-STD" }]
  },
  {
    id: 3,
    name: "Organic Green Tea Set",
    price: 45.00,
    image: "https://picsum.photos/300/300?random=3",
    reward_points: 90,
    variants: [{ id: 301, name: "Gift Box", sku: "OGT-GFT" }]
  },
  {
    id: 4,
    name: "Ergonomic Office Chair",
    price: 199.99,
    image: "https://picsum.photos/300/300?random=4",
    reward_points: 400,
    variants: [{ id: 401, name: "Grey", sku: "EOC-GRY" }]
  },
  {
    id: 5,
    name: "4K Gaming Monitor",
    price: 350.00,
    image: "https://picsum.photos/300/300?random=5",
    reward_points: 700,
    variants: [{ id: 501, name: "27 inch", sku: "4GM-27" }]
  }
];

let mockUser: User = {
  id: 1,
  telegram_id: 12345678,
  first_name: "Sopheak",
  username: "sopheak_dev",
  is_registered: true,
  phone_number: "+855 12 999 999",
  wallets: {
    default: 120.00, // Top-up balance
    shopping: 45.00, // Exchange balance
    points: 1250     // Points
  }
};

const mockTransactions: Transaction[] = [
  { id: 1, type: 'commission', amount: 300, status: 'success', date: '2023-10-25' },
  { id: 2, type: 'topup', amount: 10000, status: 'success', date: '2023-10-20' }, // stored in cents usually, but here float for simplicity of display
];

const mockOrders: Order[] = [
  {
    id: 1001,
    total: 301.50,
    status: 'shipped',
    date: '2023-10-28',
    tracking_number: 'LUN-888-999',
    items: [
      { name: "Wireless Noise Cancelling Headphones", quantity: 1, price: 299.00 }
    ]
  },
  {
    id: 1002,
    total: 45.00,
    status: 'delivered',
    date: '2023-10-15',
    items: [
      { name: "Organic Green Tea Set", quantity: 1, price: 45.00 }
    ]
  },
  {
    id: 1003,
    total: 149.50,
    status: 'processing',
    date: '2023-11-01',
    items: [
      { name: "Smart Fitness Watch Pro", quantity: 1, price: 149.50 }
    ]
  }
];

// Service Methods
export const api = {
  checkRegistration: async (): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUser), 500);
    });
  },

  checkReferrer: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Mock logic: IDs starting with '8' are invalid, others valid
      setTimeout(() => resolve(!id.startsWith('8')), 600);
    });
  },

  register: async (referrerId: string, phone: string): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockUser.is_registered = true;
        mockUser.referrer_id = parseInt(referrerId);
        mockUser.phone_number = phone;
        resolve(mockUser);
      }, 1000);
    });
  },

  getProducts: async (query: string = ''): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query) resolve(MOCK_PRODUCTS);
        resolve(MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase())));
      }, 600);
    });
  },

  submitTopUp: async (amount: number, ref: string): Promise<boolean> => {
    return new Promise(resolve => setTimeout(() => resolve(true), 1500));
  },

  exchangePoints: async (points: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (mockUser.wallets.points < points) reject("Insufficient points");
        setTimeout(() => {
            mockUser.wallets.points -= points;
            mockUser.wallets.shopping += (points / 10);
            resolve(true);
        }, 1000);
    });
  },

  withdraw: async (tierId: number): Promise<boolean> => {
     return new Promise(resolve => setTimeout(() => resolve(true), 1000));
  },

  getOrders: async (): Promise<Order[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockOrders), 800));
  },

  confirmReceipt: async (orderId: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = mockOrders.find(o => o.id === orderId);
        if (order) order.status = 'delivered';
        resolve(true);
      }, 1000);
    });
  }
};
