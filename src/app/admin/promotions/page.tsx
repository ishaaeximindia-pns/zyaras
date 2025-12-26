
'use client';

// Force dynamic rendering (uses Firebase)
export const dynamic = 'force-dynamic';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { promotions } from '@/data/promotions';
import { customers } from '@/data/customers';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function AdminPromotionsPage() {
    const { toast } = useToast();

  const getDiscountDisplay = (promo: typeof promotions[0]) => {
    switch (promo.discountType) {
      case 'Percentage':
        return `${promo.discount}%`;
      case 'Fixed Amount':
        return `$${promo.discount.toFixed(2)}`;
      case 'Tiered Discount':
        return `Above $${promo.minimumSpend}: ${promo.discount}% or $${promo.tieredDiscount}, whichever is higher`;
      default:
        return 'N/A';
    }
  };

  const getCustomerDisplay = (promo: typeof promotions[0]) => {
    if (!promo.customerIds || promo.customerIds.length === 0) {
      return 'All Customers';
    }
    if (promo.customerIds.length > 2) {
      return `${promo.customerIds.length} customers`;
    }
    return promo.customerIds.map(id => customers.find(c => c.id === id)?.name || 'Unknown').join(', ');
  };

  const handleDelete = (promoCode: string) => {
    // This is a mock delete. In a real app, you would delete from your database.
    toast({
        title: 'Promotion Deleted',
        description: `The coupon code ${promoCode} has been removed.`,
        variant: 'destructive'
    });
  }


  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Promotions</h1>
        <Button asChild>
          <Link href="/admin/promotions/edit/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Coupon
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Active Coupon Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo) => (
                <TableRow key={promo.code}>
                  <TableCell className="font-medium">{promo.code}</TableCell>
                  <TableCell>
                    {getDiscountDisplay(promo)}
                  </TableCell>
                   <TableCell>
                    <Badge variant="outline">{getCustomerDisplay(promo)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={promo.status === 'Active' ? 'default' : 'secondary'}>
                      {promo.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{promo.expiryDate}</TableCell>
                  <TableCell>{promo.usageCount} / {promo.usageLimit}</TableCell>
                   <TableCell>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                <Link href={`/admin/promotions/edit/${promo.code}`}>Edit</Link>
                                </DropdownMenuItem>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                            Delete
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete this coupon code.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(promo.code)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                          </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
