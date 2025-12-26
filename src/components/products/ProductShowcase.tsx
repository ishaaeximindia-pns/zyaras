
'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from './ProductCard';
import type { ProductDocument } from '@/lib/types';
import { useSearch } from '@/context/SearchContext';
import { Skeleton } from '../ui/skeleton';

type ProductShowcaseProps = {
  allProducts: ProductDocument[];
};

function ProductShowcaseContent({ allProducts }: ProductShowcaseProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { searchTerm } = useSearch();

  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState('all');
  
  useEffect(() => {
    setIsLoading(true);
    const paramsCategory = searchParams.get('category') || 'all';
    const paramsSubCategory = searchParams.get('subcategory');

    setCategory(paramsCategory);
    setSubcategory(paramsSubCategory);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);

  }, [searchParams]);

  const categories = useMemo(() => ['all', ...Array.from(new Set(allProducts.map((p) => p.category)))], [allProducts]);
  
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-50', label: '< $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-500', label: '$100 - $500' },
    { value: '500-plus', label: '> $500' },
  ];

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = searchTerm 
        ? product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          product.tagline.toLowerCase().includes(lowerCaseSearchTerm) ||
          product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          product.category.toLowerCase().includes(lowerCaseSearchTerm) ||
          product.subcategory.toLowerCase().includes(lowerCaseSearchTerm)
        : true;
        
      const matchesCategory = category === 'all' || product.category === category;
      const matchesSubcategory = !subcategory || product.subcategory === subcategory;

      const price = product.discountPrice || product.price;
      const matchesPrice =
        priceRange === 'all' ||
        (priceRange === '0-50' && price < 50) ||
        (priceRange === '50-100' && price >= 50 && price <= 100) ||
        (priceRange === '100-500' && price > 100 && price <= 500) ||
        (priceRange === '500-plus' && price > 500);

      return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice;
    });
  }, [searchTerm, category, subcategory, priceRange, allProducts]);

  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', newCategory);
    params.delete('subcategory');
    router.push(`${pathname}?${params.toString()}`);
  }

  const title = subcategory ? subcategory : category !== 'all' ? category : 'All Products';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold capitalize">
            {title}
          </h1>
          <p className="text-muted-foreground">
            {`Browse products ${subcategory ? `in the ${subcategory}` : category !== 'all' ? `in the ${category}` : ''} category.`}
          </p>
        </div>
      </div>

       <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger>
              <SelectValue placeholder="All Prices" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold">No Products Found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}

export default function ProductShowcase({ allProducts }: ProductShowcaseProps) {
  return (
    <Suspense fallback={
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    }>
      <ProductShowcaseContent allProducts={allProducts} />
    </Suspense>
  );
}
