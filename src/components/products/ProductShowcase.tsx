'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type ProductShowcaseProps = {
  allProducts: Product[];
};

export default function ProductShowcase({ allProducts }: ProductShowcaseProps) {
  const [model, setModel] = useState<'B2C' | 'B2B'>('B2C');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const productsForModel = useMemo(() => allProducts.filter(p => p.model === model), [model, allProducts]);

  const categories = ['all', ...Array.from(new Set(productsForModel.map((p) => p.category)))];
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-25', label: '< $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50-100', label: '$50 - $100' },
  ];

  const filteredProducts = useMemo(() => {
    return productsForModel.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.tagline.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      const matchesPrice =
        priceRange === 'all' ||
        (priceRange === '0-25' && product.price < 25) ||
        (priceRange === '25-50' && product.price >= 25 && product.price <= 50) ||
        (priceRange === '50-100' && product.price > 50 && product.price <= 100);

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchTerm, category, priceRange, productsForModel]);

  return (
    <section id="products" className="w-full py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold tracking-tight">
            Explore Our Suite of Products
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Find the perfect tools to elevate your projects and streamline your workflow.
          </p>
        </div>

        <Tabs value={model} onValueChange={(value) => setModel(value as 'B2B' | 'B2C')} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto">
            <TabsTrigger value="B2C">For Individuals (B2C)</TabsTrigger>
            <TabsTrigger value="B2B">For Business (B2B)</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
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
            <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </section>
  );
}
