
'use client';
import DashboardNav from "@/components/dashboard/DashboardNav";
import { SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
      <>
        <DashboardNav />
        <SidebarInset>
            {children}
        </SidebarInset>
      </>
  )
}
