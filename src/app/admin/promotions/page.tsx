
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { promotions } from '@/data/promotions';

export default function AdminPromotionsPage() {
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
                    {promo.discountType === 'Percentage' ? `${promo.discount}%` : `$${promo.discount.toFixed(2)}`}
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
                              <DropdownMenuItem>Delete</DropdownMenuItem>
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
