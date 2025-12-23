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
  status?: 'New' | 'Popular';
  heroImage: string;
  features: ProductFeature[];
  useCases: { title: string; description: string; image: string }[];
  faqs: ProductFAQ[];
  pricing?: PricingTier[]; // Optional pricing tiers
};

export type CartItem = {
  product: Product;
  quantity: number;
};
