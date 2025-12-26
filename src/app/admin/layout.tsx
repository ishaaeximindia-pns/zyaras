
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Package,
  Settings,
  ShoppingBag,
  Ticket,
  Users,
  LayoutGrid,
  Tag,
  ShieldAlert,
} from 'lucide-react';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Force dynamic rendering for admin pages (they require Firebase and authentication)
export const dynamic = 'force-dynamic';

const SUPER_ADMIN_UID = '0Nmw3GyfeCUL0gpr5EWO29kODZA2';
const SUPER_ADMIN_EMAIL = 'ishaaeximindia@gmail.com';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/promotions', label: 'Promotions', icon: Ticket },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function AdminAccessDenied() {
    return (
        <div className="flex-1 flex items-center justify-center p-6">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                        <ShieldAlert className="h-6 w-6 text-destructive" />
                        Access Denied
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        You do not have permission to view this page. Please log in with a super admin account.
                    </p>
                    <Button asChild>
                        <Link href="/login">Go to Login</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

function AdminLoadingSkeleton() {
    return (
        <>
            <nav className="w-64 border-r bg-muted/40 p-4 hidden md:block">
                <Skeleton className="h-8 w-32 mb-4" />
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    ))}
                </div>
            </nav>
            <main className="flex-1 p-6">
                 <Skeleton className="h-8 w-48 mb-6" />
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                 </div>
            </main>
        </>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const isActive = (path: string) => pathname === path;

  if (isUserLoading) {
    return <div className="flex min-h-screen"><AdminLoadingSkeleton /></div>;
  }
  
  // Check if user is admin by UUID or email
  const isAdmin = user && (user.uid === SUPER_ADMIN_UID || user.email === SUPER_ADMIN_EMAIL);
  
  if (!user || !isAdmin) {
    return <div className="flex min-h-screen"><AdminAccessDenied /></div>;
  }

  return (
    <div className="flex min-h-screen">
      <nav className="w-64 border-r bg-muted/40 p-4 hidden md:block">
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
