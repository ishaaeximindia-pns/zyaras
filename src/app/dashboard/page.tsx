
'use client';

import { useSearchParams } from 'next/navigation';
import { products } from '@/data';
import ProductShowcase from '@/components/products/ProductShowcase';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const model = (searchParams.get('model') as 'B2C' | 'B2B') || 'B2C';
  
  const productsForModel = products.filter(p => p.model === model);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold">Welcome, User Name!</h1>
        <p className="text-muted-foreground">
          Here's your personal dashboard. Explore products, manage orders, and more.
        </p>
      </div>
       <ProductShowcase allProducts={productsForModel} />
    </div>
  );
}
