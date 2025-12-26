
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '../ui/input';
import { Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { storeSettings } from '@/data/settings';
import type { ProductDocument } from '@/lib/types';

const B2B_MINIMUM_CART_VALUE = 15000;

export default function CartSheet({ children, model }: { children: React.ReactNode, model: 'B2C' | 'B2B' }) {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartItemId } = useCart();
  const subtotal = cart.reduce((acc, item) => acc + ((item.product as ProductDocument).discountPrice || (item.product as ProductDocument).price) * item.quantity, 0);

  const isB2B = model === 'B2B';
  const isBelowB2BMinimum = isB2B && subtotal < B2B_MINIMUM_CART_VALUE;
  const amountNeededForB2B = B2B_MINIMUM_CART_VALUE - subtotal;
  
  const currencySymbol = storeSettings.currency === 'INR' ? '₹' : '$';

  const taxAmount = storeSettings.enableTaxes ? subtotal * (storeSettings.taxRate / 100) : 0;
  const shippingAmount = storeSettings.shippingFlatRate > 0 ? storeSettings.shippingFlatRate : 0;
  const additionalFee = storeSettings.additionalFeeAmount || 0;
  const grandTotal = subtotal + taxAmount + shippingAmount + additionalFee;

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto pr-4">
          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((item) => {
                const product = item.product as ProductDocument;
                const productImage = PlaceHolderImages.find(p => p.id === product.heroImage)
                const cartItemId = getCartItemId(product, item.selectedVariants);
                return (
                  <div key={cartItemId} className="flex items-start gap-4">
                     <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        {productImage && (
                          <Image
                            src={productImage.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                     </div>
                    <div className="flex-1">
                      <p className="font-semibold">{product.name}</p>
                      {item.selectedVariants && (
                        <div className="text-xs text-muted-foreground">
                          {Object.entries(item.selectedVariants).map(([name, value]) => (
                            <span key={name} className="mr-2">{name}: {value}</span>
                          ))}
                        </div>
                      )}
                       <div className="flex items-center gap-2">
                        {product.discountPrice ? (
                            <>
                                <p className="text-sm text-primary font-semibold">{currencySymbol}{product.discountPrice.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground line-through">{currencySymbol}{product.price.toFixed(2)}</p>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">{currencySymbol}{product.price.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(cartItemId, parseInt(e.target.value))}
                        className="h-8 w-16"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(cartItemId)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <p className="text-muted-foreground">Your cart is empty.</p>
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <SheetFooter className="mt-auto pr-4">
            <div className="w-full space-y-4">
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                {shippingAmount > 0 && (
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{currencySymbol}{shippingAmount.toFixed(2)}</span>
                    </div>
                )}
                {taxAmount > 0 && (
                     <div className="flex justify-between">
                        <span>GST ({storeSettings.taxRate}%)</span>
                        <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
                    </div>
                )}
                {additionalFee > 0 && storeSettings.additionalFeeName && (
                    <div className="flex justify-between">
                        <span>{storeSettings.additionalFeeName}</span>
                        <span>{currencySymbol}{additionalFee.toFixed(2)}</span>
                    </div>
                )}
              </div>
              <Separator />
               <div className="flex justify-between font-semibold text-lg">
                <span>Grand Total</span>
                <span>{currencySymbol}{grandTotal.toFixed(2)}</span>
              </div>
              
              {isBelowB2BMinimum && (
                <Alert variant="destructive">
                  <AlertDescription>
                    For B2B orders, you need to add {currencySymbol}{(amountNeededForB2B).toFixed(2)} more to reach the minimum order value of {currencySymbol}{B2B_MINIMUM_CART_VALUE.toFixed(2)}.
                  </AlertDescription>
                </Alert>
              )}

              <Button className="w-full" disabled={isBelowB2BMinimum}>
                Proceed to Checkout
              </Button>
              <Button variant="outline" className="w-full" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
