

'use client';

// Force dynamic rendering (uses Firebase)
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { notFound, useParams, useSearchParams } from 'next/navigation';
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
import type { ProductDocument, ReviewDocument } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, User } from 'lucide-react';
import { ReviewForm } from '@/components/products/ReviewForm';
import Loading from '@/components/shared/Loading';

function StarRating({ rating, totalReviews }: { rating: number; totalReviews?: number }) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={`full-${i}`} className="h-5 w-5 fill-primary text-primary" />
          ))}
          {halfStar && <Star key="half" className="h-5 w-5 fill-primary text-primary" style={{ clipPath: 'inset(0 50% 0 0)' }} />}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className="h-5 w-5 text-muted-foreground" />
          ))}
        </div>
        {totalReviews !== undefined && (
           <span className="text-sm text-muted-foreground">({totalReviews} reviews)</span>
        )}
      </div>
    );
}

function ProductPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { slug } = params;
  const { toast } = useToast();
  const { addToCart } = useCart();
  const firestore = useFirestore();
  const { user } = useUser();

  const showReviewForm = searchParams.get('review') === 'true';

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);
  
  const { data: productsData, isLoading: areProductsLoading } = useCollection<ProductDocument>(productsQuery);

  const product = useMemo(() => {
    if (!productsData) return null;
    return productsData.find(p => p.slug === slug);
  }, [productsData, slug]);

  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore || !product) return null;
    return query(collection(firestore, 'products', product.id, 'reviews'), orderBy('createdAt', 'desc'));
  }, [firestore, product]);

  const { data: reviews, isLoading: areReviewsLoading } = useCollection<ReviewDocument>(reviewsQuery);
  
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  useMemo(() => {
    const initialVariants: Record<string, string> = {};
    if (product?.variants) {
      product.variants.forEach(variant => {
        if (variant.options.length > 0) {
          initialVariants[variant.name] = variant.options[0].value;
        }
      });
    }
    setSelectedVariants(initialVariants);
  }, [product]);

  const handleVariantChange = (variantName: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantName]: value }));
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, selectedVariants);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const heroImage = useMemo(() => {
    if (!product) return null;
    return PlaceHolderImages.find((p) => p.id === product.heroImage);
  }, [product]);
  
  const currencySymbol = storeSettings.currency === 'INR' ? '₹' : '$';

  const recommendedProducts = useMemo(() => {
    if (!product || !productsData) return [];
    if (product.recommendedProductIds) {
      return productsData.filter(p => product.recommendedProductIds!.includes(p.id));
    }
    // Fallback to category-based recommendations if none are specified
    return productsData.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
  }, [product, productsData]);
  
  const { averageRating, totalReviews } = useMemo(() => {
    if (!reviews || reviews.length === 0) {
        return { averageRating: 0, totalReviews: 0 };
    }
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return {
        averageRating: total / reviews.length,
        totalReviews: reviews.length,
    };
  }, [reviews]);
  
  if (areProductsLoading) {
    return (
        <div className="bg-background">
        <section className="relative overflow-hidden bg-card pt-24 md:pt-32 pb-12">
            <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-12 w-36" />
                </div>
                <Skeleton className="relative aspect-video rounded-xl shadow-2xl overflow-hidden" />
            </div>
            </div>
        </section>
        </div>
    )
  }

  if (!product) {
    notFound();
  }

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
                 <StarRating rating={averageRating} totalReviews={totalReviews} />
              </div>

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

        {/* Reviews Section */}
        <section id="reviews" className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Overall Rating</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-5xl font-bold">{averageRating.toFixed(1)}</p>
                                <StarRating rating={averageRating} />
                                <p className="text-muted-foreground mt-2">Based on {totalReviews} reviews</p>
                            </CardContent>
                        </Card>
                        {showReviewForm && user && (
                            <div className="mt-8">
                                <ReviewForm productId={product.id} userId={user.uid} userName={user.displayName || user.email || 'Anonymous'} />
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                       {areReviewsLoading ? (
                           <p>Loading reviews...</p>
                       ) : reviews && reviews.length > 0 ? (
                           reviews.map(review => (
                                <Card key={review.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-muted rounded-full h-10 w-10 flex items-center justify-center">
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-semibold">{review.userName}</p>
                                                    <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <StarRating rating={review.rating} />
                                                <p className="text-muted-foreground mt-2">{review.comment}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                           ))
                       ) : (
                           <p className="text-muted-foreground">No reviews yet. Be the first to write one!</p>
                       )}
                    </div>
                </div>
            </div>
        </section>

      {/* Recommended Products Section */}
      {recommendedProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-card">
            <div className="container mx-auto px-4 md:px-6">
                <ProductCarousel title="Recommended Products" products={recommendedProducts} />
            </div>
        </section>
      )}
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductPageContent />
    </Suspense>
  );
}
