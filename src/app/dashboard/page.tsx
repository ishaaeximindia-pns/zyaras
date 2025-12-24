
'use client';

import { products } from '@/data';
import ProductShowcase from '@/components/products/ProductShowcase';
import ProductCarousel from '@/components/products/ProductCarousel';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const model = (searchParams.get('model') as 'B2C' | 'B2B') || 'B2C';
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const productsForModel = products.filter(p => p.model === model);

  const featuredProducts = productsForModel.filter(p => p.isFeatured);
  const newProducts = productsForModel.filter(p => p.status === 'New');
  const saleProducts = productsForModel.filter(p => p.status === 'Sale');

  return (
    <div className="p-4 sm:p-6 lg:p-8">
       <div className="space-y-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-headline font-bold">Welcome, User Name!</h1>
                <p className="text-muted-foreground">
                Here's your personal dashboard. Explore products, manage orders, and more.
                </p>
            </div>
            
            {isClient && (
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

                <ProductShowcase allProducts={productsForModel} />
                </>
            )}
        </div>
    </div>
  );
}
