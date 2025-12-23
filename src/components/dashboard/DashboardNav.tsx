
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
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import CartSheet from '../cart/CartSheet';
import { useCart } from '@/context/CartContext';
import { products } from '@/data';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CategoryWithSubcategories {
  name: string;
  subcategories: string[];
  icon: React.ElementType;
}

function CategoryList() {
  const searchParams = useSearchParams();
  const model = searchParams.get('model') || 'B2C';
  const activeCategory = searchParams.get('category');
  const activeSubcategory = searchParams.get('subcategory');

  const [openCategories, setOpenCategories] = useState<string[]>(['Women', 'Men', 'Kids', 'Services']);

  const categories = useMemo(() => {
    const productModel = model as 'B2C' | 'B2B';
    const filteredProducts = products.filter(p => p.model === productModel);

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

  }, [model]);

  const toggleCategory = (categoryName: string) => {
    setOpenCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <>
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <SidebarMenuItem key={category.name}>
            <Collapsible open={openCategories.includes(category.name)} onOpenChange={() => toggleCategory(category.name)}>
              <CollapsibleTrigger asChild>
                 <SidebarMenuButton variant="ghost" className="w-full justify-start pr-2">
                   <Icon className="h-4 w-4 mr-2" />
                  <span>{category.name}</span>
                  <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", openCategories.includes(category.name) && "rotate-180")} />
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
            </Collapsible>
          </SidebarMenuItem>
        )
      })}
    </>
  );
}


export default function DashboardNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isActive = (path: string) => pathname === path;
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const model = searchParams.get('model') || 'B2C';

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

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

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={!searchParams.get('category') || searchParams.get('category') === 'all'}
              >
                <Link href={`/dashboard?model=${model}&category=all`}>
                  <Tag /> All Products
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {isClient && <CategoryList />}

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
