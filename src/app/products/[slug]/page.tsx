'use client';

import { products } from '@/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PricingTable from '@/components/products/PricingTable';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import * as icons from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }
  
  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const heroImage = PlaceHolderImages.find((p) => p.id === product.heroImage);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-card pt-24 md:pt-32 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-foreground">
                {product.name}
              </h1>
              <p className="text-xl text-muted-foreground">{product.tagline}</p>
              <p className="text-base text-muted-foreground">{product.description}</p>
              <Button onClick={handleAddToCart} size="lg">
                Add to Cart
              </Button>
            </div>
            <div className="relative aspect-video rounded-xl shadow-2xl overflow-hidden">
              {heroImage && (
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

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Features that Empower You</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Discover the powerful tools inside {product.name}.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {product.features.map((feature) => {
              const Icon = icons[feature.icon as keyof typeof icons] as icons.LucideIcon;
              return (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {Icon && <Icon className="h-8 w-8" />}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {product.pricing && product.pricing.length > 0 && (
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Pricing Plans</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Choose the plan that's right for you.
              </p>
            </div>
            <PricingTable tiers={product.pricing} />
          </div>
        </section>
      )}

      {/* Use Cases Section */}
      <section className="py-16 md:py-24">
         <div className="container mx-auto px-4 md:px-6">
           <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Real-World Applications</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              See how {product.name} can be applied to solve your challenges.
            </p>
           </div>
           {product.useCases.map((useCase, index) => {
             const useCaseImage = PlaceHolderImages.find((p) => p.id === useCase.image);
             return (
               <div key={index} className={`grid md:grid-cols-2 gap-12 items-center ${index > 0 ? 'mt-16' : ''}`}>
                 <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                   <h3 className="text-2xl font-semibold mb-4">{useCase.title}</h3>
                   <p className="text-muted-foreground">{useCase.description}</p>
                 </div>
                 <div className={`relative aspect-video rounded-xl shadow-lg overflow-hidden ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                   {useCaseImage && <Image src={useCaseImage.imageUrl} alt={useCase.title} fill className="object-cover" data-ai-hint={useCaseImage.imageHint} />}
                 </div>
               </div>
             )
           })}
         </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {product.faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
