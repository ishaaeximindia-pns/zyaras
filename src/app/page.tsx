
'use client';

import { Suspense } from 'react';
import DashboardLayout from './dashboard/layout';
import DashboardPage from './dashboard/page';
import Header from '@/components/layout/Header';
import Loading from '@/components/shared/Loading';
import { useUser } from '@/firebase';

// Force dynamic rendering (uses Firebase)
export const dynamic = 'force-dynamic';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const isLoggedIn = !isUserLoading && !!user;

  // Show dashboard layout if logged in, otherwise show public home page with header
  if (isLoggedIn) {
    return (
      <DashboardLayout>
        <Suspense fallback={<Loading />}>
          <DashboardPage />
        </Suspense>
      </DashboardLayout>
    );
  }

  // Public home page with header (shows sign in/sign up buttons)
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<Loading />}>
          <DashboardPage />
        </Suspense>
      </main>
    </div>
  );
}
