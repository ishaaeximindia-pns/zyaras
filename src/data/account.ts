
import type { Order, Transaction } from '@/lib/types';

export const orders: Order[] = [
  {
    id: 'ORD-001',
    transactionId: 'TRN-001',
    date: '2024-07-28',
    status: 'Delivered',
    total: 113.00,
    items: [
      { name: 'Classic Blue Jeans', quantity: 1, price: 68.00 },
      { name: 'Silk Blend Scarf', quantity: 1, price: 45.00 },
    ],
  },
  {
    id: 'ORD-002',
    transactionId: 'TRN-002',
    date: '2024-07-25',
    status: 'Shipped',
    total: 55.00,
    items: [
      { name: 'Men\'s Oxford Shirt', quantity: 1, price: 55.00 },
    ],
  },
  {
    id: 'ORD-003',
    transactionId: 'TRN-003',
    date: '2024-07-22',
    status: 'Delivered',
    total: 147.00,
    items: [
      { name: 'Floral Print Dress', quantity: 1, price: 85.00 },
      { name: 'Men\'s Leather Belt', quantity: 1, price: 48.00 },
      { name: 'Kids\' Graphic T-Shirt', quantity: 1, price: 22.00 },
    ],
  },
   {
    id: 'ORD-004',
    transactionId: 'TRN-004',
    date: '2024-07-20',
    status: 'Processing',
    total: 35.00,
    items: [
      { name: 'Kids\' Dino Pajamas', quantity: 1, price: 35.00 },
    ],
  },
];

export const transactions: Transaction[] = [
    {
        id: 'TRN-001',
        date: '2024-07-28',
        amount: 113.00,
        paymentMethod: 'Visa **** 4242',
        status: 'Completed'
    },
    {
        id: 'TRN-002',
        date: '2024-07-25',
        amount: 55.00,
        paymentMethod: 'PayPal',
        status: 'Completed'
    },
    {
        id: 'TRN-003',
        date: '2024-07-22',
        amount: 147.00,
        paymentMethod: 'Visa **** 4242',
        status: 'Completed'
    },
    {
        id: 'TRN-004',
        date: '2024-07-20',
        amount: 35.00,
        paymentMethod: 'Mastercard **** 5555',
        status: 'Pending'
    }
]
