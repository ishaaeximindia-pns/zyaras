
'use client';
import DashboardNav from "@/components/dashboard/DashboardNav";
import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

// Force dynamic rendering for dashboard pages (they require Firebase and authentication)
export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
      <>
        <DashboardNav />
        <SidebarInset>
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
        </SidebarInset>
      </>
  )
}
