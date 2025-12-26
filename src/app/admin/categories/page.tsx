
'use client';

// Force dynamic rendering (uses Firebase)
export const dynamic = 'force-dynamic';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { products } from '@/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const getCategories = () => {
    const categoryMap: Record<string, Set<string>> = {};
    products.forEach(product => {
        if (!categoryMap[product.category]) {
            categoryMap[product.category] = new Set();
        }
        categoryMap[product.category].add(product.subcategory);
    });

    return Object.keys(categoryMap).map(category => ({
        name: category,
        subcategories: Array.from(categoryMap[category]),
    }));
};


export default function AdminCategoriesPage() {
  const categories = getCategories();
  const { toast } = useToast();

  const handleDelete = (categoryName: string) => {
    // This is a mock delete. In a real app, you would delete from your database.
    toast({
        title: 'Category Deleted',
        description: `${categoryName} has been removed.`,
        variant: 'destructive'
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <Button asChild>
            <Link href="/admin/categories/edit/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Category
            </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Categories & Subcategories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
              <TableHeader>
                  <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Subcategories</TableHead>
                      <TableHead>
                          <span className="sr-only">Actions</span>
                      </TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {categories.map((category) => (
                      <TableRow key={category.name}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{category.subcategories.join(', ')}</TableCell>
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
                                        <Link href={`/admin/categories/edit/${encodeURIComponent(category.name)}`}>Edit</Link>
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
                                                        This action cannot be undone. This will permanently delete the
                                                        category. Products in this category will not be deleted.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(category.name)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
