
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  Settings,
  ShoppingBag,
  Ticket,
  Users,
  LayoutGrid,
  Tag
} from 'lucide-react';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/promotions', label: 'Promotions', icon: Ticket },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen">
      <nav className="w-64 border-r bg-muted/40 p-4">
        <h2 className="mb-4 text-lg font-semibold">Admin Menu</h2>
        <div className="flex flex-col gap-2">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  isActive(item.href) ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
