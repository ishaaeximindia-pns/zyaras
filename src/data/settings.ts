
export type StoreSettings = {
  storeName: string;
  storeEmail: string;
  storePhone?: string;
  storeAddress?: string;
  shippingFlatRate: number;
  enableTaxes: boolean;
  taxRate: number; // as a percentage
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR';
  language: 'en' | 'es' | 'fr';
  additionalFeeName?: string;
  additionalFeeAmount?: number;
};

// Mock settings data
export const storeSettings: StoreSettings = {
  storeName: 'Synergy Suite',
  storeEmail: 'contact@synergysuite.com',
  storePhone: '123-456-7890',
  storeAddress: '123 Tech Lane, Innovation City, 12345',
  shippingFlatRate: 5.00,
  enableTaxes: true,
  taxRate: 18,
  currency: 'INR',
  language: 'en',
  additionalFeeName: 'Handling Fee',
  additionalFeeAmount: 2.50,
};
