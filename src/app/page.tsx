
import DashboardLayout from './dashboard/layout';

export default function Home() {
  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto">
        {/* The content is now rendered by the page, not the layout */}
      </main>
    </DashboardLayout>
  );
}
