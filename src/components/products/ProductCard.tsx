
'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ProductDocument } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { storeSettings } from '@/data/settings';

type ProductCardProps = {
  product: ProductDocument;
};

export default function ProductCard({ product }: ProductCardProps) {
  const productImage = PlaceHolderImages.find((p) => p.id === product.heroImage);
  const { cart, addToCart, updateQuantity, removeFromCart, getCartItemId } = useCart();
  const { toast } = useToast();

  const cartItemId = getCartItemId(product);
  const cartItem = cart.find(item => getCartItemId(item.product, item.selectedVariants) === cartItemId);

  const currencySymbol = storeSettings.currency === 'INR' ? '₹' : '$';
  
  const hasVariants = product.variants && product.variants.length > 0;

  const handleAddToCart = () => {
    if (hasVariants) {
        toast({
            title: "Please select options",
            description: `Visit the product page to choose your preferences for ${product.name}.`,
            variant: "default"
        });
        return;
    }
    
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      updateQuantity(cartItemId, cartItem.quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(cartItemId, cartItem.quantity - 1);
      } else {
        removeFromCart(cartItemId);
      }
    }
  };


  return (
    <Card className="flex h-full flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative h-48 w-full">
            {productImage ? (
              <Image
                src={productImage.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={productImage.imageHint}
              />
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
            <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
              {product.status && (
                <Badge
                  className={cn({
                    'bg-red-500 text-white border-red-500': product.status === 'Sale',
                  })}
                  variant={product.status === 'Sale' ? 'destructive' : 'secondary'}
                >
                  {product.status}
                </Badge>
              )}
               {product.offer && (
                <Badge variant="destructive">
                  {product.offer === 'BOGO' ? 'BOGO' : 'B2G1'}
                </Badge>
              )}
            </div>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <Badge variant="outline" className="mb-2">{product.category}</Badge>
        <CardTitle className="text-xl">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </CardTitle>
        <CardDescription className="mt-2 text-sm">{product.tagline}</CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex flex-col">
            {product.discountPrice ? (
              <>
                <p className="text-lg font-semibold">{currencySymbol}{product.discountPrice.toFixed(2)}</p>
                <p className="text-sm font-normal text-muted-foreground line-through">
                  {currencySymbol}{product.price.toFixed(2)}
                </p>
              </>
            ) : (
               <p className="text-lg font-semibold">{currencySymbol}{product.price.toFixed(2)}</p>
            )}
        </div>
        {cartItem && !hasVariants ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDecreaseQuantity}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-bold">{cartItem.quantity}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleIncreaseQuantity}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button asChild={hasVariants} onClick={!hasVariants ? handleAddToCart : undefined} size="sm">
            {hasVariants ? (
                <Link href={`/products/${product.slug}`}>
                    <Plus className="mr-2 h-4 w-4" /> Select Options
                </Link>
            ) : (
                <>
                    <Plus className="mr-2 h-4 w-4" /> Add
                </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
