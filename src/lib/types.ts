
import { type LucideIcon } from 'lucide-react';

export type ProductFeature = {
  title: string;
  description: string;
  icon: string;
};

export type ProductFAQ = {
  question: string;
  answer: string;
};

export type PricingTier = {
  name: string;
  price: string;
  priceSuffix: string;
  features: string[];
  cta: string;
  isFeatured?: boolean;
};

export type ProductVariantOption = {
  value: string;
};

export type ProductVariant = {
  name: string; // e.g., 'Color', 'Size'
  options: ProductVariantOption[];
};


export type Product = {
  id: string;
  slug: string;
  name: string;
  category: 'Women' | 'Men' | 'Kids' | 'Services';
  subcategory: string;
  model: 'B2B' | 'B2C';
  tagline: string;
  description: string;
  keyBenefit: string;
  price: number;
  discountPrice?: number;
  offer?: 'BOGO' | 'B2G1';
  status?: 'New' | 'Popular' | 'Sale';
  isFeatured?: boolean;
  heroImage: string;
  videoUrl?: string;
  features: ProductFeature[];
  variants?: ProductVariant[];
  useCases: { title: string; description: string; image: string }[];
  faqs: ProductFAQ[];
  pricing?: PricingTier[]; // Optional pricing tiers
};

export type CartItem = {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
};

export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
}

export type Order = {
  id: string;
  transactionId: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: OrderItem[];
  carrier?: string;
  trackingNumber?: string;
};

export type Transaction = {
    id: string;
    date: string;
    amount: number;
    paymentMethod: string;
    status: 'Completed' | 'Pending' | 'Failed';
}
