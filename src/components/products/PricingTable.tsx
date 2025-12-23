import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { PricingTier } from '@/lib/types';
import Link from 'next/link';

type PricingTableProps = {
  tiers: PricingTier[];
};

export default function PricingTable({ tiers }: PricingTableProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {tiers.map((tier) => (
        <Card
          key={tier.name}
          className={cn(
            'flex flex-col',
            tier.isFeatured && 'border-primary ring-2 ring-primary shadow-lg'
          )}
        >
          {tier.isFeatured && (
            <div className="bg-accent px-4 py-1 text-center text-sm font-semibold text-accent-foreground">
              Most Popular
            </div>
          )}
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">{tier.name}</CardTitle>
            <CardDescription>
              {tier.price === 'Contact Us' ? (
                <span className="text-4xl font-bold">Contact Us</span>
              ) : (
                <>
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-muted-foreground">{tier.priceSuffix}</span>
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <CheckCircle2 className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant={tier.isFeatured ? 'default' : 'outline'}>
              <Link href="/signup">{tier.cta}</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
