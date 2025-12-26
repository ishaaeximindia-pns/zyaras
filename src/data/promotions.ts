
export type Promotion = {
  code: string;
  discountType: 'Percentage' | 'Fixed Amount' | 'Tiered Discount';
  discount: number;
  status: 'Active' | 'Expired';
  expiryDate: string;
  usageCount: number;
  usageLimit: number;
  minimumSpend?: number;
  tieredDiscount?: number;
  customerIds?: string[];
};

export const promotions: Promotion[] = [
  {
    code: 'SUMMER20',
    discountType: 'Percentage',
    discount: 20,
    status: 'Active',
    expiryDate: '2024-08-31',
    usageCount: 45,
    usageLimit: 200,
  },
  {
    code: 'WELCOME10',
    discountType: 'Fixed Amount',
    discount: 10,
    status: 'Active',
    expiryDate: '2024-12-31',
    usageCount: 112,
    usageLimit: 1000,
  },
  {
    code: 'SPENDSAVE100',
    discountType: 'Tiered Discount',
    discount: 10, // 10%
    minimumSpend: 1000,
    tieredDiscount: 100, // $100
    status: 'Active',
    expiryDate: '2024-10-31',
    usageCount: 5,
    usageLimit: 100,
  },
  {
    code: 'SPRINGCLEAN',
    discountType: 'Percentage',
    discount: 15,
    status: 'Expired',
    expiryDate: '2024-04-30',
    usageCount: 150,
    usageLimit: 150,
  },
   {
    code: 'B2BLaunch',
    discountType: 'Percentage',
    discount: 25,
    status: 'Active',
    expiryDate: '2024-09-30',
    usageCount: 10,
    usageLimit: 50,
  },
  {
    code: 'EMMAONLY',
    discountType: 'Percentage',
    discount: 50,
    status: 'Active',
    expiryDate: '2024-09-30',
    usageCount: 0,
    usageLimit: 1,
    customerIds: ['CUST-004']
  }
];

