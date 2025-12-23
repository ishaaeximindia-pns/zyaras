
export type Promotion = {
  code: string;
  discount: number; // percentage
  status: 'Active' | 'Expired';
  expiryDate: string;
  usageCount: number;
  usageLimit: number;
};

export const promotions: Promotion[] = [
  {
    code: 'SUMMER20',
    discount: 20,
    status: 'Active',
    expiryDate: '2024-08-31',
    usageCount: 45,
    usageLimit: 200,
  },
  {
    code: 'WELCOME10',
    discount: 10,
    status: 'Active',
    expiryDate: '2024-12-31',
    usageCount: 112,
    usageLimit: 1000,
  },
  {
    code: 'SPRINGCLEAN',
    discount: 15,
    status: 'Expired',
    expiryDate: '2024-04-30',
    usageCount: 150,
    usageLimit: 150,
  },
   {
    code: 'B2BLaunch',
    discount: 25,
    status: 'Active',
    expiryDate: '2024-09-30',
    usageCount: 10,
    usageLimit: 50,
  },
];
