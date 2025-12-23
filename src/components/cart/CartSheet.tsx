
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

const B2B_MINIMUM_CART_VALUE = 15000;

export default function CartSheet({ children, model }: { children: React.ReactNode, model: 'B2C' | 'B2B' }) {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const isB2B = model === 'B2B';
  const isBelowB2BMinimum = isB2B && subtotal < B2B_MINIMUM_CART_VALUE;
  const amountNeededForB2B = B2B_MINIMUM_CART_VALUE - subtotal;

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((item) => {
                const productImage = PlaceHolderImages.find(p => p.id === item.product.heroImage)
                return (
                  <div key={item.product.id} className="flex items-center gap-4">
                     <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        {productImage && (
                          <Image
                            src={productImage.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                     </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                        className="h-8 w-16"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
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
          <SheetFooter className="mt-auto">
            <div className="w-full space-y-4">
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {isBelowB2BMinimum && (
                <Alert variant="destructive">
                  <AlertDescription>
                    For B2B orders, you need to add ${amountNeededForB2B.toFixed(2)} more to reach the minimum order value of ${B2B_MINIMUM_CART_VALUE.toFixed(2)}.
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
