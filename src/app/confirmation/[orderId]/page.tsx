
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import type { Order } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { storeSettings } from '@/data/settings';
import { Skeleton } from '@/components/ui/skeleton';

function ConfirmationSkeleton() {
    return (
         <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <Skeleton className="mx-auto h-12 w-12 rounded-full" />
                    <Skeleton className="h-8 w-3/4 mx-auto mt-4" />
                    <Skeleton className="h-5 w-1/2 mx-auto mt-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/4" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </CardContent>
                    </Card>
                    <div className="flex justify-center gap-4">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const { orderId } = params;
    const { user } = useUser();
    const firestore = useFirestore();

    const orderDocRef = useMemoFirebase(() => {
        if (!firestore || !user || !orderId) return null;
        return doc(firestore, 'users', user.uid, 'orders', orderId as string);
    }, [firestore, user, orderId]);
    
    const { data: order, isLoading } = useDoc<Order>(orderDocRef);

    useEffect(() => {
      if (!isLoading && !order) {
        // Maybe redirect to a 404 page or the orders history
        // router.push('/dashboard/orders');
      }
    }, [isLoading, order, router]);


    if (isLoading) {
        return <ConfirmationSkeleton />;
    }

    if (!order) {
        return (
            <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Order Not Found</CardTitle>
                        <CardDescription>We couldn't find the order you're looking for.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/dashboard/orders">View All Orders</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const currencySymbol = storeSettings.currency === 'INR' ? '₹' : '$';
    
    // Calculate subtotal from items for display, though total is on the order object
    const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxAmount = storeSettings.enableTaxes ? subtotal * (storeSettings.taxRate / 100) : 0;
    const shippingAmount = storeSettings.shippingFlatRate > 0 ? storeSettings.shippingFlatRate : 0;
    const additionalFee = storeSettings.additionalFeeAmount || 0;

    return (
        <div className="bg-background">
            <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="mt-4 text-3xl font-bold">Order Confirmed!</CardTitle>
                        <CardDescription>
                            Thank you for your purchase. Your order <span className="font-medium text-primary">{order.id}</span> has been placed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5" /> Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center text-sm">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                            <p>{currencySymbol}{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                                <Separator />
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <p className="text-muted-foreground">Subtotal</p>
                                        <p>{currencySymbol}{subtotal.toFixed(2)}</p>
                                    </div>
                                    {shippingAmount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span>{currencySymbol}{shippingAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {taxAmount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">GST ({storeSettings.taxRate}%)</span>
                                            <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {additionalFee > 0 && storeSettings.additionalFeeName && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">{storeSettings.additionalFeeName}</span>
                                            <span>{currencySymbol}{additionalFee.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <p>Total</p>
                                    <p>{currencySymbol}{order.total.toFixed(2)}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="flex justify-center gap-4">
                             <Button asChild>
                                <Link href="/dashboard">Continue Shopping</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/dashboard/orders">View My Orders</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
