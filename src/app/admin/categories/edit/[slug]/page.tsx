
'use client';

import { products } from '@/data';
import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  subcategories: z.array(z.object({ name: z.string().min(1, 'Subcategory name cannot be empty') })),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoryEditPage() {
  const router = useRouter();
  const params = useParams();
  const { slug } = params;
  const isNewCategory = slug === 'new';
  const { toast } = useToast();

  const categoryName = isNewCategory ? '' : decodeURIComponent(slug as string);
  const existingSubcategories = isNewCategory ? [] : Array.from(new Set(products.filter(p => p.category === categoryName).map(p => p.subcategory)));

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: categoryName,
      subcategories: isNewCategory ? [{ name: '' }] : existingSubcategories.map(name => ({ name })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subcategories',
  });

  const onSubmit = (data: CategoryFormValues) => {
    toast({
      title: `Category ${isNewCategory ? 'created' : 'updated'}`,
      description: `${data.name} with subcategories: ${data.subcategories.map(s => s.name).join(', ')}. (This is a mock-up, data is not persisted).`,
    });
    router.push('/admin/categories');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/admin/categories">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{isNewCategory ? 'Add New Category' : 'Edit Category'}</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isNewCategory ? 'Create Category' : `Editing: ${categoryName}`}</CardTitle>
              <CardDescription>Categories help organize your products.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl><Input {...field} readOnly={!isNewCategory} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Subcategories</FormLabel>
                <div className="grid gap-4 mt-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                       <FormField
                          control={form.control}
                          name={`subcategories.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl><Input {...field} placeholder="Subcategory Name" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => append({ name: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Subcategory
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button type="submit" size="lg">Save Category</Button>
        </form>
      </Form>
    </div>
  );
}
