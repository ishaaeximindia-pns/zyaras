
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
       <ProductShowcase allProducts={productsForModel} />
    </div>
  );
}
