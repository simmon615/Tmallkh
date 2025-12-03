import { Product, User, Transaction } from '../types';

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
  is_registered: true,
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

// Service Methods
export const api = {
  checkRegistration: async (): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUser), 500);
    });
  },

  register: async (referrerId: string): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockUser.is_registered = true;
        mockUser.referrer_id = parseInt(referrerId);
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
  }
};
