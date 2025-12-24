
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '@/data';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/products/ProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const model = (searchParams.get('model') as 'B2C' | 'B2B') || 'B2C';
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  const handleModelChange = (newModel: 'B2B' | 'B2C') => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('model', newModel);
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

  const featuredProducts = products.filter(p => p.isFeatured && p.model === model);
  const newProducts = products.filter(p => p.status === 'New' && p.model === model);
  const saleProducts = products.filter(p => p.status === 'Sale' && p.model === model);

  const showFilterResults = category || subcategory;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold capitalize">
            {showFilterResults ? (subcategory || category) : 'Welcome'}
          </h1>
          <p className="text-muted-foreground">
            {showFilterResults ? 'Browse products in this category.' : 'Discover our curated collection of products.'}
          </p>
        </div>
        <Tabs value={model} onValueChange={(value) => handleModelChange(value as 'B2B' | 'B2C')} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="B2C">For Individuals (B2C)</TabsTrigger>
            <TabsTrigger value="B2B">For Business (B2B)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {showFilterResults ? (
        <section>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recommendedProducts.length > 0 ? recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            )) : <p>No products found in this category.</p>}
          </div>
        </section>
      ) : (
        <div className="space-y-12">
            {featuredProducts.length > 0 && (
                <section>
                    <h2 className="text-2xl font-headline font-bold mb-6">Featured Products</h2>
                    <Carousel opts={{ align: "start", loop: true }} className="w-full">
                    <CarouselContent>
                        {featuredProducts.map((product) => (
                        <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                            <div className="p-1">
                                <ProductCard product={product} />
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:flex" />
                    <CarouselNext className="hidden lg:flex" />
                    </Carousel>
                </section>
            )}

            {saleProducts.length > 0 && (
                <section>
                    <h2 className="text-2xl font-headline font-bold mb-6">Festive Sale</h2>
                    <Carousel opts={{ align: "start", loop: true }} className="w-full">
                    <CarouselContent>
                        {saleProducts.map((product) => (
                        <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                            <div className="p-1">
                                <ProductCard product={product} />
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:flex" />
                    <CarouselNext className="hidden lg:flex" />
                    </Carousel>
                </section>
            )}

            {newProducts.length > 0 && (
                <section>
                    <h2 className="text-2xl font-headline font-bold mb-6">New Arrivals</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {newProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            <section>
                <h2 className="text-2xl font-headline font-bold mb-6">All Products</h2>
                <div className="grid gap-6 md-grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {recommendedProducts.length > 0 ? recommendedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                )) : <p>No products found.</p>}
                </div>
            </section>
        </div>
      )}
    </div>
  );
}
