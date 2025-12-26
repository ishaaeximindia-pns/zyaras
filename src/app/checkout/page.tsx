
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Home, Building, MapPin, Plus, CreditCard, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { AddressDocument, ProductDocument, Order, OrderItem } from '@/lib/types';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import { storeSettings } from '@/data/settings';
import { AddressFormDialog } from '@/components/dashboard/AddressFormDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function CheckoutSkeleton() {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-12 md:px-6">
            <Skeleton className="h-10 w-48 mb-8" />
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                           <Skeleton className="h-6 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-24 w-full" />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card>
                         <CardHeader>
                           <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Separator />
                            <Skeleton className="h-8 w-full" />
                             <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


export default function CheckoutPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { cart, clearCart } = useCart();
  
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  const addressesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'addresses');
  }, [user, firestore]);

  const { data: addresses, isLoading: areAddressesLoading } = useCollection<AddressDocument>(addressesQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    // Set default address if it exists
    if (addresses) {
      const defaultAddress = addresses.find(a => a.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else if (addresses.length > 0) {
        setSelectedAddress(addresses[0].id);
      }
    }
  }, [addresses]);

  const subtotal = cart.reduce((acc, item) => acc + ((item.product as ProductDocument).discountPrice || (item.product as ProductDocument).price) * item.quantity, 0);
  const currencySymbol = storeSettings.currency === 'INR' ? '₹' : '$';
  const taxAmount = storeSettings.enableTaxes ? subtotal * (storeSettings.taxRate / 100) : 0;
  const shippingAmount = storeSettings.shippingFlatRate > 0 ? storeSettings.shippingFlatRate : 0;
  const additionalFee = storeSettings.additionalFeeAmount || 0;
  const grandTotal = subtotal + taxAmount + shippingAmount + additionalFee;

  const handlePlaceOrder = async () => {
    if (!firestore || !user || !selectedAddress || cart.length === 0) return;

    const ordersCollection = collection(firestore, 'users', user.uid, 'orders');
    const newOrderId = doc(ordersCollection).id;
    const newOrderRef = doc(ordersCollection, newOrderId);

    const orderItems: OrderItem[] = cart.map(item => ({
        name: (item.product as ProductDocument).name,
        quantity: item.quantity,
        price: (item.product as ProductDocument).discountPrice || (item.product as ProductDocument).price
    }));

    const newOrder: Order = {
        id: newOrderId,
        transactionId: `TRN-${Date.now()}`, // Mock transaction ID
        date: new Date().toISOString(),
        status: 'Processing',
        total: grandTotal,
        items: orderItems,
    };
    
    addDocumentNonBlocking(ordersCollection, newOrder);
    clearCart();

    router.push(`/confirmation/${newOrderId}`);
  };

  if (isUserLoading || areAddressesLoading) {
    return <CheckoutSkeleton />;
  }
  
  const getAddressIcon = (type: AddressDocument['type']) => {
    switch (type) {
      case 'Home': return <Home className="h-5 w-5" />;
      case 'Office': return <Building className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  if (cart.length === 0 && !isUserLoading) {
    router.push('/dashboard');
    return null;
  }

  return (
    <>
      <div className="container mx-auto max-w-6xl px-4 py-12 md:px-6">
        <h1 className="text-3xl font-headline font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Shipping Address</CardTitle>
                <CardDescription>Select where you'd like your order delivered.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {addresses && addresses.map(address => (
                   <div key={address.id} onClick={() => setSelectedAddress(address.id)} className={cn(
                       "rounded-lg border p-4 cursor-pointer transition-all",
                       selectedAddress === address.id ? "border-primary ring-2 ring-primary" : "hover:border-primary/50"
                   )}>
                       <div className="flex items-center gap-3 mb-2">
                           {getAddressIcon(address.type)}
                           <h3 className="font-semibold">{address.type}</h3>
                           {address.isDefault && <span className="text-xs font-normal text-muted-foreground">(Default)</span>}
                       </div>
                       <div className="text-sm text-muted-foreground">
                            <p>{address.addressLine1}</p>
                            {address.addressLine2 && <p>{address.addressLine2}</p>}
                            <p>{address.city}, {address.state} {address.postalCode}</p>
                            <p>{address.country}</p>
                       </div>
                   </div>
                ))}
                 <button onClick={() => setIsAddressDialogOpen(true)} className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/50 p-4 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                   <Plus className="h-8 w-8" />
                   <span>Add New Address</span>
                 </button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> 2. Payment Details</CardTitle>
                 <CardDescription>Enter your payment information. This is a mock form.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="**** **** **** 1234" />
                    </div>
                     <div>
                        <Label htmlFor="card-name">Name on Card</Label>
                        <Input id="card-name" placeholder="John Doe" />
                    </div>
                 </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                        <Label htmlFor="expiry-date">Expiry Date</Label>
                        <Input id="expiry-date" placeholder="MM/YY" />
                    </div>
                     <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                    </div>
                 </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {cart.map(item => {
                    const product = item.product as ProductDocument;
                    const productImage = PlaceHolderImages.find(p => p.id === product.heroImage);
                    const cartItemId = `${product.id}-${JSON.stringify(item.selectedVariants)}`;
                    return (
                      <div key={cartItemId} className="flex items-center gap-4 text-sm">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden">
                          {productImage && <Image src={productImage.imageUrl} alt={product.name} fill className="object-cover" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                           {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                            <p className="text-xs text-muted-foreground">
                                {Object.values(item.selectedVariants).join(' / ')}
                            </p>
                           )}
                          <p className="text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{currencySymbol}{((product.discountPrice || product.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>
                <Separator />
                 <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{currencySymbol}{subtotal.toFixed(2)}</span>
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
                    <span>Total</span>
                    <span>{currencySymbol}{grandTotal.toFixed(2)}</span>
                  </div>
                  <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={!selectedAddress}>
                    Place Order
                  </Button>
                  {!selectedAddress && <p className="text-center text-sm text-destructive">Please select or add a shipping address.</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <AddressFormDialog isOpen={isAddressDialogOpen} setIsOpen={setIsAddressDialogOpen} />
    </>
  );
}
