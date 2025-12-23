
'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { orders } from "@/data/account";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function OrdersPage() {
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  const toggleOrder = (orderId: string) => {
    setOpenOrderId(prevId => (prevId === orderId ? null : orderId));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Order History</h1>
          <p className="text-muted-foreground">
            Review your past orders and their status.
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
              {orders.map((order) => (
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
                          <div className="p-4">
                            <h4 className="font-semibold mb-2">Order Items</h4>
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
                        </TableCell>
                      </tr>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
