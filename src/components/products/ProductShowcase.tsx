
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearch } from '@/context/SearchContext';

type ProductShowcaseProps = {
  allProducts: Product[];
};

export default function ProductShowcase({ allProducts }: ProductShowcaseProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { searchTerm } = useSearch();

  const [isClient, setIsClient] = useState(false);
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  
  const model = (searchParams.get('model') as 'B2C' | 'B2B') || 'B2C';

  useEffect(() => {
    setIsClient(true);
    const paramsCategory = searchParams.get('category') || 'all';
    const paramsSubCategory = searchParams.get('subcategory');

    if (paramsSubCategory) {
        // If there's a subcategory, we can usually infer the main category.
        // For this app, we'll just set the category filter if it exists.
        if (paramsCategory) {
            setCategory(paramsCategory);
        }
    } else {
        setCategory(paramsCategory);
    }
  }, [searchParams]);

  const handleModelChange = (newModel: 'B2B' | 'B2C') => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('model', newModel);
    newSearchParams.delete('category');
    newSearchParams.delete('subcategory');
    router.push(`${pathname}?${newSearchParams.toString()}`);
  }

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
      const price = product.discountPrice || product.price;
      const matchesPrice =
        priceRange === 'all' ||
        (priceRange === '0-50' && price < 50) ||
        (priceRange === '50-100' && price >= 50 && price <= 100) ||
        (priceRange === '100-500' && price > 100 && price <= 500) ||
        (priceRange === '500-plus' && price > 500);

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchTerm, category, priceRange, allProducts]);
  
  if (!isClient) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold capitalize">
            {category !== 'all' ? category : 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            {category !== 'all' ? `Browse products in the ${category} category.` : 'Discover our curated collection of products.'}
          </p>
        </div>
        <Tabs value={model} onValueChange={(value) => handleModelChange(value as 'B2B' | 'B2C')} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="B2C">For Individuals (B2C)</TabsTrigger>
            <TabsTrigger value="B2B">For Business (B2B)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

       <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select value={category} onValueChange={setCategory}>
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


      {filteredProducts.length > 0 ? (
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
