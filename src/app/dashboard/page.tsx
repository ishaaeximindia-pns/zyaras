'use client';

import { useState } from 'react';
import { products } from '@/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/products/ProductCard';

export default function DashboardPage() {
  const [model, setModel] = useState<'B2B' | 'B2C'>('B2C');

  const recommendedProducts = products.filter(p => p.model === model).slice(0, 4);
  const billingHistory = [
    { invoice: 'INV-001', date: '2023-10-01', amount: '$25.00', status: 'Paid' },
    { invoice: 'INV-002', date: '2023-09-01', amount: '$25.00', status: 'Paid' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your account.</p>
        </div>
        <Tabs value={model} onValueChange={(value) => setModel(value as 'B2B' | 'B2C')} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="B2C">For Individuals (B2C)</TabsTrigger>
            <TabsTrigger value="B2B">For Business (B2B)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Tabs value={model}>
        <TabsContent value="B2C">
           <section>
            <h2 className="text-2xl font-semibold mb-4">Recommended Products</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="B2B">
           <section>
            <h2 className="text-2xl font-semibold mb-4">Recommended Products for your Business</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>


      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Billing History</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((item) => (
                <TableRow key={item.invoice}>
                  <TableCell className="font-medium">{item.invoice}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Paid' ? 'secondary' : 'destructive'}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Download</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>
    </div>
  );
}
