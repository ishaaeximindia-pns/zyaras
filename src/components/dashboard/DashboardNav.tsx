

'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarInput,
} from '@/components/ui/sidebar';
import Logo from '@/components/shared/Logo';
import {
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Settings,
  ShoppingCart,
  ChevronDown,
  Tag,
  Briefcase,
  User,
  Baby,
  Package,
  Shield,
  Search,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import CartSheet from '../cart/CartSheet';
import { useCart } from '@/context/CartContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSearch } from '@/context/SearchContext';
import { useCollection, useFirestore, useMemoFirebase, useUser, useAuth, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { ProductDocument } from '@/lib/types';
import { signOut } from 'firebase/auth';


interface CategoryWithSubcategories {
  name: string;
  subcategories: string[];
  icon: React.ElementType;
}

function CategoryList() {
  const searchParams = useSearchParams();
  const model = searchParams.get('model') || 'B2C';
  const activeSubcategory = searchParams.get('subcategory');

  const [openCategories, setOpenCategories] = useState<string[]>(['Women', 'Men', 'Kids', 'Services']);
  
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), where('model', '==', model));
  }, [firestore, model]);

  const { data: filteredProducts } = useCollection<ProductDocument>(productsQuery);

  const categories = useMemo(() => {
    if (!filteredProducts) return [];

    const categoryMap: Record<string, { icon: React.ElementType, subcategories: Set<string> }> = {
      'Women': { icon: User, subcategories: new Set() },
      'Men': { icon: User, subcategories: new Set() },
      'Kids': { icon: Baby, subcategories: new Set() },
      'Services': { icon: Briefcase, subcategories: new Set() },
    };

    filteredProducts.forEach(p => {
      if (categoryMap[p.category]) {
        categoryMap[p.category].subcategories.add(p.subcategory);
      } else {
        if (!categoryMap[p.category]) {
           categoryMap[p.category] = { icon: Tag, subcategories: new Set() };
        }
        categoryMap[p.category].subcategories.add(p.subcategory);
      }
    });

    return Object.keys(categoryMap)
      .filter(catName => categoryMap[catName].subcategories.size > 0)
      .map(catName => ({
        name: catName,
        icon: categoryMap[catName].icon,
        subcategories: Array.from(categoryMap[catName].subcategories).sort(),
      }));

  }, [filteredProducts]);

  const toggleCategory = (categoryName: string) => {
    setOpenCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };
  
  if (!categories.length) return null;

  return (
    <>
      {categories.map((category) => {
        const Icon = category.icon;
        const isOpen = openCategories.includes(category.name);
        return (
          <Collapsible asChild key={category.name} open={isOpen} onOpenChange={() => toggleCategory(category.name)}>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton variant="ghost" className="w-full justify-start pr-2">
                    <Icon className="h-4 w-4 mr-2" />
                    <span>{category.name}</span>
                    <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {category.subcategories.map((subcategory) => (
                      <SidebarMenuItem key={subcategory}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={activeSubcategory === subcategory}
                        >
                          <Link href={`/dashboard?model=${model}&category=${category.name}&subcategory=${subcategory}`}>
                            {subcategory}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
           </Collapsible>
        )
      })}
    </>
  );
}


export default function DashboardNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const model = searchParams.get('model') || 'B2C';
  const { searchTerm, setSearchTerm } = useSearch();

  const auth = useAuth();
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc(userDocRef);


  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  const userName = userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : user?.email;
  const userEmail = userProfile?.email || user?.email;


  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
             <div className="relative mb-2 px-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <SidebarInput 
                placeholder="Search products..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/dashboard"
                asChild
                isActive={isActive('/dashboard') && !searchParams.get('category')}
                tooltip="Dashboard"
              >
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Shop</SidebarGroupLabel>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={searchParams.get('category') === 'all'}
              >
                <Link href={`/dashboard?model=${model}&category=all`}>
                  <Tag /> All Products
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {isClient && <CategoryList />}

             <SidebarMenuItem>
                {isClient ? (
                  <CartSheet model={model as 'B2C' | 'B2B'}>
                    <SidebarMenuButton tooltip="Cart">
                      <ShoppingCart />
                      <span>Cart</span>
                      {totalItems > 0 && (
                        <span className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                          {totalItems}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </CartSheet>
                ) : (
                  <SidebarMenuButton tooltip="Cart" disabled>
                    <ShoppingCart />
                    <span>Cart</span>
                  </SidebarMenuButton>
                )}
            </SidebarMenuItem>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
             <SidebarMenuItem>
              <SidebarMenuButton
                href="/dashboard/orders"
                asChild
                isActive={isActive('/dashboard/orders')}
                tooltip="Orders"
              >
                <Link href="/dashboard/orders">
                  <Package />
                  <span>Orders</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/dashboard/settings"
                asChild
                isActive={isActive('/dashboard/settings')}
                tooltip="Settings"
              >
                <Link href="/dashboard/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/support" asChild tooltip="Support">
                <Link href="#">
                  <LifeBuoy />
                  <span>Support</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
             <SidebarMenuItem>
              <SidebarMenuButton
                href="/admin"
                asChild
                isActive={isActive('/admin')}
                tooltip="Admin Panel"
              >
                <Link href="/admin">
                  <Shield />
                  <span>Admin Panel</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>

        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 p-2 rounded-md bg-sidebar-accent">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/100/100`} />
            <AvatarFallback>{userName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span className="font-semibold text-sidebar-accent-foreground">{userName}</span>
            <span className="text-xs text-muted-foreground">{userEmail}</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto text-sidebar-accent-foreground" onClick={handleLogout}>
              <LogOut />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
