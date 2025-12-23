
'use client';

import { useState } from 'react';
import { orders as initialOrders } from '@/data/account';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Order } from '@/lib/types';
import { Input } from '@/components/ui/input';


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const { toast } = useToast();

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast({
      title: 'Order Status Updated',
      description: `Order ${orderId} is now ${newStatus}. (This is a mock-up, data is not persisted).`,
    });
  };

  const handleShippingInfoChange = (orderId: string, field: 'carrier' | 'trackingNumber', value: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, [field]: value } : order
      )
    );
     toast({
      title: 'Shipping Info Updated',
      description: `Updated ${field} for order ${orderId}. (This is a mock-up, data is not persisted).`,
    });
  };


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status & Shipping</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>Mock Customer</TableCell> {/* Placeholder */}
                  <TableCell>{order.date}</TableCell>
                  <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Select
                            value={order.status}
                            onValueChange={(newStatus: Order['status']) => handleStatusChange(order.id, newStatus)}
                            >
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Processing">Processing</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                            </Select>
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
                        </div>
                        {(order.status === 'Shipped' || order.status === 'Delivered') && (
                            <div className="flex items-center gap-2">
                                <Input 
                                    placeholder="Carrier Name" 
                                    value={order.carrier || ''}
                                    onChange={(e) => handleShippingInfoChange(order.id, 'carrier', e.target.value)}
                                    className="h-9 flex-1"
                                />
                                <Input 
                                    placeholder="Tracking Number" 
                                    value={order.trackingNumber || ''}
                                    onChange={(e) => handleShippingInfoChange(order.id, 'trackingNumber', e.target.value)}
                                    className="h-9 flex-1"
                                />
                            </div>
                        )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>View Customer</DropdownMenuItem>
                         <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete Order</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
