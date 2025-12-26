
'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, CreditCard, ShoppingBag, Repeat, Download, Package, Edit, Truck } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import type { CartItem, Order, OrderItem, ProductDocument } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';


export default function OrdersPage() {
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const { addMultipleToCart } = useCart();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'orders'));
  }, [firestore, user]);

  const { data: orders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products } = useCollection<ProductDocument>(productsQuery);

  const toggleOrder = (orderId: string) => {
    setOpenOrderId(prevId => (prevId === orderId ? null : orderId));
  };
  
  const handleRepeatOrder = (orderItems: OrderItem[]) => {
    if (!products) {
       toast({
        title: 'Error',
        description: 'Products are not loaded yet. Please try again in a moment.',
        variant: 'destructive',
      });
      return;
    }
    const itemsToAdd: CartItem[] = [];
    orderItems.forEach(orderItem => {
      const product = products.find(p => p.name === orderItem.name);
      if (product) {
        itemsToAdd.push({ product, quantity: orderItem.quantity });
      }
    });

    if (itemsToAdd.length > 0) {
      addMultipleToCart(itemsToAdd);
      toast({
        title: 'Items Added to Cart',
        description: 'The items from your previous order have been added to your cart.',
      });
    } else {
       toast({
        title: 'Error',
        description: 'Could not find products to add to cart.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDownloadInvoice = (orderId: string) => {
    toast({
      title: 'Invoice Downloading',
      description: `Your invoice for order ${orderId} is being prepared.`,
    });
    // In a real app, you would generate and trigger a file download here.
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Order History</h1>
          <p className="text-muted-foreground">
            Review your past orders, their status, and transaction details.
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="w-[120px]">Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
             <TableBody>
              {areOrdersLoading && (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-5 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              )}
              {!areOrdersLoading && orders && orders.length > 0 && orders.map((order) => {
                const isOpen = openOrderId === order.id;
                return (
                  <Collapsible asChild key={order.id} open={isOpen} onOpenChange={() => toggleOrder(order.id)}>
                    <>
                      <TableRow className="cursor-pointer">
                        <TableCell>
                          <CollapsibleTrigger asChild>
                            <button className="p-1">
                              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>
                          </CollapsibleTrigger>
                        </TableCell>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "Delivered"
                                ? "default"
                                : order.status === "Shipped"
                                ? "secondary"
                                : "outline"
                            }
                            className={cn({
                              "bg-green-500/10 text-green-700 border-green-500/20": order.status === 'Delivered',
                              "bg-yellow-500/10 text-yellow-700 border-yellow-500/20": order.status === 'Shipped',
                              "bg-blue-500/10 text-blue-700 border-blue-500/20": order.status === 'Processing',
                              "bg-gray-500/10 text-gray-700 border-gray-500/20": order.status === 'Cancelled',
                            })}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                      </TableRow>
                      <CollapsibleContent asChild>
                        <tr className="bg-muted/50">
                          <TableCell colSpan={5} className="p-0">
                            <div className="p-6 space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                  <h4 className="font-semibold mb-4 flex items-center gap-2"><ShoppingBag className="h-5 w-5" /> Order Items</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="w-[100px]">Quantity</TableHead>
                                        <TableHead className="w-[100px] text-right">Price</TableHead>
                                        {order.status === 'Delivered' && <TableHead className="w-[150px] text-right">Actions</TableHead>}
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {order.items.map((item, index) => {
                                        const product = products?.find(p => p.name === item.name);
                                        return (
                                            <TableRow key={index} className="border-none">
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                                {order.status === 'Delivered' && product && (
                                                    <TableCell className="text-right">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={`/products/${product.slug}?review=true`}>
                                                                <Edit className="mr-2 h-3 w-3" />
                                                                Write Review
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </div>
                                <div className="space-y-6">
                                    {order.transactionId && (
                                    <div>
                                        <h4 className="font-semibold mb-4 flex items-center gap-2"><CreditCard className="h-5 w-5" /> Transaction Details</h4>
                                        <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Transaction ID:</span>
                                            <span className="font-medium">{order.transactionId}</span>
                                        </div>
                                        </div>
                                    </div>
                                    )}
                                    {(order.status === 'Shipped' || order.status === 'Delivered') && (
                                    <div>
                                        <h4 className="font-semibold mb-4 flex items-center gap-2"><Truck className="h-5 w-5" /> Shipping Details</h4>
                                        <div className="space-y-2 text-sm">
                                            {order.carrier && (
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Carrier:</span>
                                                    <span className="font-medium">{order.carrier}</span>
                                                </div>
                                            )}
                                            {order.trackingNumber && (
                                                 <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Tracking #:</span>
                                                    <span className="font-mono text-xs">{order.trackingNumber}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    )}
                                </div>
                              </div>
                              <div className="flex items-center justify-end gap-4">
                                <Button variant="outline" onClick={() => handleRepeatOrder(order.items)}>
                                  <Repeat className="mr-2 h-4 w-4" />
                                  Repeat Order
                                </Button>
                                <Button variant="outline" onClick={() => handleDownloadInvoice(order.id)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Invoice
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </tr>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                );
              })}
            </TableBody>
          </Table>
           {!areOrdersLoading && (!orders || orders.length === 0) && (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-xl font-semibold">No Orders Yet</h3>
                  <p className="mt-2 text-muted-foreground">You haven't placed any orders. Start shopping to see them here.</p>
                  <Button asChild className="mt-6">
                      <Link href="/dashboard">Start Shopping</Link>
                  </Button>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
