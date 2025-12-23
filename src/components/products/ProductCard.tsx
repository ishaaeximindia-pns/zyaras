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
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const productImage = PlaceHolderImages.find((p) => p.id === product.heroImage);
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();

  const cartItem = cart.find((item) => item.product.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(product.id, cartItem.quantity - 1);
      } else {
        removeFromCart(product.id);
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
            {product.status && (
              <Badge className="absolute right-2 top-2" variant={product.status === 'New' ? 'default' : 'secondary'}>
                {product.status}
              </Badge>
            )}
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
        <p className="text-lg font-semibold">
          ${product.price}
          <span className="text-sm font-normal text-muted-foreground">/mo</span>
        </p>
        {cartItem ? (
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
          <Button onClick={handleAddToCart} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
