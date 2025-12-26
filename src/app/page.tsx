
import { Suspense } from 'react';
import DashboardLayout from './dashboard/layout';
import DashboardPage from './dashboard/page';
import Loading from '@/components/shared/Loading';

// Force dynamic rendering (uses Firebase)
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <DashboardLayout>
      <Suspense fallback={<Loading />}>
        <DashboardPage />
      </Suspense>
    </DashboardLayout>
  );
}
