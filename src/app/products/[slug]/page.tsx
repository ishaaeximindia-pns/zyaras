
'use client';

import { products } from '@/data';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { storeSettings } from '@/data/settings';
import ProductCarousel from '@/components/products/ProductCarousel';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useState, useMemo } from 'react';
import type { ProductVariant } from '@/lib/types';

export default function ProductPage() {
  const params = useParams();
  const { slug } = params;

  const { addToCart } = useCart();
  const { toast } = useToast();

  const product = products.find((p) => p.slug === slug);
  
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initialVariants: Record<string, string> = {};
    if (product?.variants) {
      product.variants.forEach(variant => {
        if (variant.options.length > 0) {
          initialVariants[variant.name] = variant.options[0].value;
        }
      });
    }
    return initialVariants;
  });

  if (!product) {
    notFound();
  }

  const handleVariantChange = (variantName: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantName]: value }));
  };
  
  const handleAddToCart = () => {
    addToCart(product, selectedVariants);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const heroImage = PlaceHolderImages.find((p) => p.id === product.heroImage);
  const currencySymbol = storeSettings.currency === 'INR' ? '₹' : '$';

  const recommendedProducts = useMemo(() => {
    if (product?.recommendedProductIds) {
      return products.filter(p => product.recommendedProductIds!.includes(p.id));
    }
    // Fallback to category-based recommendations if none are specified
    return products.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
  }, [product]);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-card pt-24 md:pt-32 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {product.offer && (
                <Badge variant="destructive" className="text-sm mb-2">
                  {product.offer === 'BOGO' ? 'Buy One Get One' : 'Buy 2 Get 1 Free'}
                </Badge>
              )}
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-foreground">
                {product.name}
              </h1>
              <p className="text-xl text-muted-foreground">{product.tagline}</p>
              <div className="flex items-center gap-4">
                {product.discountPrice ? (
                  <>
                    <span className="text-4xl font-bold">{currencySymbol}{product.discountPrice.toFixed(2)}</span>
                    <span className="text-2xl font-medium text-muted-foreground line-through">{currencySymbol}{product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-4xl font-bold">{currencySymbol}{product.price.toFixed(2)}</span>
                )}
              </div>
              <p className="text-base text-muted-foreground">{product.description}</p>
              
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-6 pt-4">
                  {product.variants.map((variant) => (
                    <div key={variant.name}>
                      <Label className="text-lg font-semibold">{variant.name}</Label>
                      <RadioGroup 
                        value={selectedVariants[variant.name]}
                        onValueChange={(value) => handleVariantChange(variant.name, value)}
                        className="flex flex-wrap items-center gap-4 mt-2"
                      >
                        {variant.options.map((option) => (
                          <div key={option.value}>
                            <RadioGroupItem value={option.value} id={`${variant.name}-${option.value}`} className="sr-only peer" />
                            <Label
                              htmlFor={`${variant.name}-${option.value}`}
                              className="cursor-pointer rounded-md border-2 border-muted bg-popover px-4 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary"
                            >
                              {option.value}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              )}

              <Button onClick={handleAddToCart} size="lg">
                Add to Cart
              </Button>
            </div>
            <div className="relative aspect-video rounded-xl shadow-2xl overflow-hidden">
               {product.videoUrl ? (
                <iframe
                  src={product.videoUrl}
                  title={product.name}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  data-ai-hint={heroImage.imageHint}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Products Section */}
      {recommendedProducts.length > 0 && (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <ProductCarousel title="Recommended Products" products={recommendedProducts} />
            </div>
        </section>
      )}
    </div>
  );
}
