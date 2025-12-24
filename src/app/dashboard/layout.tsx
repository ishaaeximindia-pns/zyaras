
'use client';
import DashboardNav from "@/components/dashboard/DashboardNav";
import { SidebarInset } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import DashboardPage from "./page";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoot = pathname === '/dashboard' || pathname === '/';

  return (
      <>
        <DashboardNav />
        <SidebarInset>
          {isDashboardRoot ? <DashboardPage /> : children}
        </SidebarInset>
      </>
  )
}
