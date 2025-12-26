

'use client';

import ProductShowcase from '@/components/products/ProductShowcase';
import ProductCarousel from '@/components/products/ProductCarousel';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { ProductDocument } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const model = (searchParams.get('model') as 'B2C' | 'B2B') || 'B2C';
  
  const firestore = useFirestore();
  const { user } = useUser();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc(userDocRef);

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), where('model', '==', model));
  }, [firestore, model]);

  const { data: productsForModel, isLoading } = useCollection<ProductDocument>(productsQuery);

  const featuredProducts = productsForModel?.filter(p => p.isFeatured) || [];
  const newProducts = productsForModel?.filter(p => p.status === 'New') || [];
  const saleProducts = productsForModel?.filter(p => p.status === 'Sale') || [];

  const handleModelChange = (newModel: 'B2B' | 'B2C') => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('model', newModel);
    newSearchParams.delete('category');
    newSearchParams.delete('subcategory');
    router.push(`${pathname}?${newSearchParams.toString()}`);
  }
  
  const welcomeMessage = useMemo(() => {
    if (userProfile) {
        return `Welcome, ${userProfile.firstName}!`;
    }
    if (user) {
        return `Welcome!`;
    }
    return 'Welcome!';
  }, [userProfile, user]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
       <div className="space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-headline font-bold">{welcomeMessage}</h1>
                    <p className="text-muted-foreground">
                    Here's your personal dashboard. Explore products, manage orders, and more.
                    </p>
                </div>
                 <Tabs value={model} onValueChange={(value) => handleModelChange(value as 'B2B' | 'B2C')} className="w-full sm:w-auto">
                    <TabsList>
                        <TabsTrigger value="B2C">For Individuals (B2C)</TabsTrigger>
                        <TabsTrigger value="B2B">For Business (B2B)</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            
            {isLoading ? (
              <div className="space-y-12">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            ) : (
              <>
                {featuredProducts.length > 0 && (
                    <ProductCarousel title="Featured Products" products={featuredProducts} />
                )}
                
                {newProducts.length > 0 && (
                    <ProductCarousel title="New Arrivals" products={newProducts} />
                )}

                {saleProducts.length > 0 && (
                    <ProductCarousel title="On Sale Now" products={saleProducts} />
                )}

                <ProductShowcase allProducts={productsForModel || []} />
              </>
            )}
        </div>
    </div>
  );
}
