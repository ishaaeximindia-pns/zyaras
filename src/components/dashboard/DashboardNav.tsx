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
  SidebarMenuSubItem,
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
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import CartSheet from '../cart/CartSheet';
import { useCart } from '@/context/CartContext';
import { products } from '@/data';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface CategoryWithSubcategories {
  name: string;
  subcategories: string[];
}

export default function DashboardNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isActive = (path: string) => pathname === path;
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const categories = useMemo(() => {
    const cats: CategoryWithSubcategories[] = [];
    const categoryNames = [...new Set(products.map((p) => p.category))];

    categoryNames.forEach(catName => {
      const subcategories = [...new Set(products.filter(p => p.category === catName).map(p => p.subcategory))];
      cats.push({ name: catName, subcategories });
    });

    return cats;
  }, []);

  const activeCategory = searchParams.get('category');
  const activeSubcategory = searchParams.get('subcategory');

  const toggleCategory = (categoryName: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };
  
  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
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
            
            <SidebarMenuSubItem>
              <SidebarMenuSubButton 
                asChild 
                isActive={!activeCategory || activeCategory === 'all'}
              >
                <Link href="/dashboard?category=all">
                  <Tag className="mr-2 h-4 w-4" /> All Products
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            
            {categories.map((category) => (
              <Collapsible key={category.name} open={openCategories.includes(category.name)} onOpenChange={() => toggleCategory(category.name)}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton variant="ghost" className="w-full justify-start">
                    <span>{category.name}</span>
                    <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", openCategories.includes(category.name) && "rotate-180")} />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {category.subcategories.map((subcategory) => (
                      <SidebarMenuSubItem key={subcategory}>
                        <SidebarMenuSubButton 
                          asChild 
                          isActive={activeSubcategory === subcategory}
                        >
                          <Link href={`/dashboard?category=${category.name}&subcategory=${subcategory}`}>
                            {subcategory}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ))}

             <SidebarMenuItem>
                <CartSheet>
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
            </SidebarMenuItem>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/dashboard/settings"
                asChild
                isActive={isActive('/dashboard/settings')}
                tooltip="Settings"
              >
                <Link href="#">
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
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 p-2 rounded-md bg-sidebar-accent">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://picsum.photos/seed/avatar/100/100" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span className="font-semibold text-sidebar-accent-foreground">User Name</span>
            <span className="text-xs text-muted-foreground">user@example.com</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto text-sidebar-accent-foreground" asChild>
            <Link href="/">
              <LogOut />
            </Link>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
