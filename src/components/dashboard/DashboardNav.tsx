'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from '@/components/ui/sidebar';
import Logo from '@/components/shared/Logo';
import {
  LayoutDashboard,
  CreditCard,
  LifeBuoy,
  LogOut,
  Settings,
  Package,
  ShoppingCart,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import CartSheet from '../cart/CartSheet';
import { useCart } from '@/context/CartContext';

export default function DashboardNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

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
                isActive={isActive('/dashboard')}
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
