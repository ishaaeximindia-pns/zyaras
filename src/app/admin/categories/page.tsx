
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { products } from '@/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Category
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
                                      <DropdownMenuItem>Edit</DropdownMenuItem>
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
