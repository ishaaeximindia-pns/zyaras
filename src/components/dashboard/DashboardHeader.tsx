
'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { useAuth, useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, Settings } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/shared/ModeToggle';
import { Themes } from '@/components/themes';
import { useToast } from '@/hooks/use-toast';

export function DashboardHeader() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const handleLogout = async () => {
    if (!auth) {
      toast({
        title: 'Error',
        description: 'Authentication service is not available.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await signOut(auth);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      // Redirect to login page
      router.push('/login');
      // Force a page reload to clear any cached state
      router.refresh();
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: error.message || 'An error occurred while logging out.',
        variant: 'destructive',
      });
    }
  };

  const userInitial = useMemo(() => {
    if (userProfile?.firstName) {
        return userProfile.firstName.charAt(0).toUpperCase();
    }
    if (user?.email) {
        return user.email.charAt(0).toUpperCase();
    }
    return '?';
  }, [userProfile, user]);

  if (isUserLoading || isProfileLoading) {
    return (
      <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:px-6">
        <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </header>
    );
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
        <SidebarTrigger className="md:hidden" />
        <div className="w-full flex-1">
            {/* Can add search bar here later */}
        </div>
        <div className="flex items-center gap-2">
            <Themes />
            <ModeToggle />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/100/100`} />
                        <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                     <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>
  );
}
