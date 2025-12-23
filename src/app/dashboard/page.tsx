import { products } from '@/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  const subscribedProducts = products.slice(0, 2);
  const recommendedProducts = products.slice(2, 4);
  const billingHistory = [
    { invoice: 'INV-001', date: '2023-10-01', amount: '$25.00', status: 'Paid' },
    { invoice: 'INV-002', date: '2023-09-01', amount: '$25.00', status: 'Paid' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your account.</p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">My Subscriptions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subscribedProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.tagline}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Next renewal: October 31, 2024</p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={`/products/${product.slug}`}>Manage Product</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recommended Upgrades & Add-ons</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {recommendedProducts.map((product) => (
            <Card key={product.id} className="flex flex-col sm:flex-row items-start gap-4 p-4">
              <div className="relative w-full sm:w-32 h-24 sm:h-full flex-shrink-0">
                <Image
                  src={PlaceHolderImages.find((img) => img.id === product.heroImage)?.imageUrl || ''}
                  alt={product.name}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{product.keyBenefit}</p>
                <Button size="sm" className="mt-4" variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add to Suite
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Billing History</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((item) => (
                <TableRow key={item.invoice}>
                  <TableCell className="font-medium">{item.invoice}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Paid' ? 'secondary' : 'destructive'}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Download</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>
    </div>
  );
}
