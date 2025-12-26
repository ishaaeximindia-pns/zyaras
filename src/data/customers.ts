
export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
};

export const customers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Liam Johnson',
    email: 'liam@example.com',
    phone: '555-0101',
    avatar: 'https://picsum.photos/seed/avatar1/100/100',
    totalOrders: 3,
    totalSpent: 250.00,
    joinDate: '2023-10-20',
  },
  {
    id: 'CUST-002',
    name: 'Olivia Smith',
    email: 'olivia@example.com',
    phone: '555-0102',
    avatar: 'https://picsum.photos/seed/avatar2/100/100',
    totalOrders: 5,
    totalSpent: 450.75,
    joinDate: '2023-01-15',
  },
  {
    id: 'CUST-003',
    name: 'Noah Williams',
    email: 'noah@example.com',
    phone: '555-0103',
    avatar: 'https://picsum.photos/seed/avatar3/100/100',
    totalOrders: 1,
    totalSpent: 55.00,
    joinDate: '2024-05-10',
  },
  {
    id: 'CUST-004',
    name: 'Emma Brown',
    email: 'emma@example.com',
    phone: '555-0104',
    avatar: 'https://picsum.photos/seed/avatar4/100/100',
    totalOrders: 8,
    totalSpent: 890.50,
    joinDate: '2022-03-25',
  },
  {
    id: 'CUST-005',
    name: 'James Jones',
    email: 'james@example.com',
    phone: '555-0105',
    avatar: 'https://picsum.photos/seed/avatar5/100/100',
    totalOrders: 2,
    totalSpent: 120.25,
    joinDate: '2024-07-01',
  },
];
