import { products } from '@/data';
import ProductShowcase from '@/components/products/ProductShowcase';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-main');

  return (
    <div className="flex flex-col">
      <section className="relative w-full py-20 md:py-32 lg:py-40 bg-card overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold tracking-tight text-foreground">
                The Unified Ecosystem for Digital Excellence
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
                Synergy Digital Suite brings together a curated collection of premium digital products to streamline your workflow and amplify your success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="#products">Explore Products</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover rounded-lg shadow-2xl"
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              )}
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent -z-10"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0% 100%)' }}
        />
      </section>

      <ProductShowcase allProducts={products} />
    </div>
  );
}
