'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { products } from '@/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/products/ProductCard';

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [model, setModel] = useState<'B2C' | 'B2B'>( (searchParams.get('model') as 'B2C' | 'B2B') || 'B2C');
  
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  useEffect(() => {
    const currentModel = searchParams.get('model');
    if (currentModel && (currentModel === 'B2B' || currentModel === 'B2C')) {
      setModel(currentModel);
    } else {
      // Default to B2C if no model is specified or if it's invalid
      handleModelChange('B2C');
    }
  }, [searchParams]);

  const handleModelChange = (newModel: 'B2B' | 'B2C') => {
    setModel(newModel);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('model', newModel);
    // Reset category when model changes
    newSearchParams.delete('category');
    newSearchParams.delete('subcategory');
    router.push(`${pathname}?${newSearchParams.toString()}`);
  }

  const recommendedProducts = products.filter(p => {
    const modelMatch = p.model === model;
    const categoryMatch = !category || category === 'all' || p.category === category;
    const subcategoryMatch = !subcategory || p.subcategory === subcategory;
    return modelMatch && categoryMatch && subcategoryMatch;
  });

  const pageTitle = subcategory || (category && category !== 'all' ? category : 'All Products');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold capitalize">
            {pageTitle}
          </h1>
          <p className="text-muted-foreground">Browse our products and find the best fit for you.</p>
        </div>
        <Tabs value={model} onValueChange={(value) => handleModelChange(value as 'B2B' | 'B2C')} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="B2C">For Individuals (B2C)</TabsTrigger>
            <TabsTrigger value="B2B">For Business (B2B)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recommendedProducts.length > 0 ? recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          )) : <p>No products found in this category.</p>}
        </div>
      </section>
    </div>
  );
}
