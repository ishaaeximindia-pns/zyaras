
'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { orders, transactions } from "@/data/account";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, CreditCard, ShoppingBag, Repeat, Download } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { products } from '@/data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/lib/types';


export default function OrdersPage() {
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const { addMultipleToCart } = useCart();
  const { toast } = useToast();

  const toggleOrder = (orderId: string) => {
    setOpenOrderId(prevId => (prevId === orderId ? null : orderId));
  };
  
  const handleRepeatOrder = (orderItems: { name: string; quantity: number; price: number }[]) => {
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
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
              {orders.map((order) => {
                const transaction = transactions.find(t => t.id === order.transactionId);
                return (
                  <Collapsible asChild key={order.id} open={openOrderId === order.id} onOpenChange={() => toggleOrder(order.id)}>
                    <>
                      <TableRow className="cursor-pointer">
                        <TableCell>
                          <CollapsibleTrigger asChild>
                            <button className="p-1">
                              {openOrderId === order.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>
                          </CollapsibleTrigger>
                        </TableCell>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
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
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-4 flex items-center gap-2"><ShoppingBag className="h-5 w-5" /> Order Items</h4>
                                    <Table>
                                    <TableHeader>
                                        <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="w-[100px]">Quantity</TableHead>
                                        <TableHead className="w-[100px] text-right">Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item, index) => (
                                        <TableRow key={index} className="border-none">
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                    </Table>
                                </div>
                                {transaction && (
                                    <div>
                                    <h4 className="font-semibold mb-4 flex items-center gap-2"><CreditCard className="h-5 w-5" /> Transaction Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Transaction ID:</span>
                                            <span className="font-medium">{transaction.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Payment Method:</span>
                                            <span className="font-medium">{transaction.paymentMethod}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Transaction Status:</span>
                                            <Badge
                                                variant={transaction.status === "Completed" ? "default" : "secondary"}
                                                className={cn({
                                                    "bg-green-500/10 text-green-700 border-green-500/20": transaction.status === 'Completed',
                                                    "bg-yellow-500/10 text-yellow-700 border-yellow-500/20": transaction.status === 'Pending',
                                                })}
                                            >
                                                {transaction.status}
                                            </Badge>
                                        </div>
                                        <Separator className="my-2" />
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-muted-foreground">Amount Paid:</span>
                                            <span>${transaction.amount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    </div>
                                )}
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
                )
            })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
