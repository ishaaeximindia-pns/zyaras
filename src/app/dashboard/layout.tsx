import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardNav />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
