export interface User {
  id: number;
  telegram_id: number;
  first_name: string;
  username?: string;
  referrer_id?: number;
  wallets: {
    default: number; // Top-up Balance (USD)
    shopping: number; // Shopping Balance (USD)
    points: number; // Points (Int)
  };
  is_registered: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  reward_points: number; // The base points for the product
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export enum PaymentMethod {
  DEFAULT = 'default',
  SHOPPING = 'shopping'
}

export interface Transaction {
  id: number;
  type: 'topup' | 'exchange' | 'withdraw' | 'commission';
  amount: number; // In cents or points
  status: 'pending' | 'success' | 'failed';
  date: string;
}
