
'use client';

import { products } from '@/data';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ChevronLeft, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.enum(['Women', 'Men', 'Kids', 'Services']),
  subcategory: z.string().min(1, 'Subcategory is required'),
  model: z.enum(['B2C', 'B2B']),
  tagline: z.string().min(1, 'Tagline is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  discountPrice: z.coerce.number().optional(),
  offer: z.enum(['BOGO', 'B2G1']).optional(),
  status: z.enum(['New', 'Popular', 'Sale']).optional(),
  isFeatured: z.boolean().default(false),
  features: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    icon: z.string().min(1),
  })).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const { slug } = params;
  const isNewProduct = slug === 'new';
  const product = isNewProduct ? null : products.find((p) => p.slug === slug);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      ...product,
      features: product.features || [],
    } : {
      name: '',
      slug: '',
      category: 'Women',
      subcategory: '',
      model: 'B2C',
      tagline: '',
      description: '',
      price: 0,
      discountPrice: undefined,
      offer: undefined,
      status: 'New',
      isFeatured: false,
      features: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  if (!isNewProduct && !product) {
    notFound();
  }

  const onSubmit = (data: ProductFormValues) => {
    // Data would be saved to a database in a real application
    router.push('/admin/products');
  };
  

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
         <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/admin/products">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
        <h1 className="text-3xl font-bold">{isNewProduct ? 'Add New Product' : 'Edit Product'}</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Fill in the main details of the product.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea {...field} rows={5} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>Define the key features of the product.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md relative">
                     <FormField
                        control={form.control}
                        name={`features.${index}.title`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Feature Title</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name={`features.${index}.description`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Feature Description</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name={`features.${index}.icon`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Icon Name (lucide-react)</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )}
                        />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => append({ title: '', description: '', icon: '' })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1 grid gap-6 content-start">
             <Card>
              <CardHeader>
                <CardTitle>Organize</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Women">Women</SelectItem>
                          <SelectItem value="Men">Men</SelectItem>
                          <SelectItem value="Kids">Kids</SelectItem>
                          <SelectItem value="Services">Services</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="B2C">B2C</SelectItem>
                          <SelectItem value="B2B">B2B</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-4">
                      <div className="space-y-0.5">
                        <FormLabel>Featured Product</FormLabel>
                        <FormDescription>
                          Featured products appear on the main dashboard.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Offers</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                 <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Price</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} placeholder="e.g. 49.99" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="offer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Type</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select an offer" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BOGO">Buy One, Get One Free</SelectItem>
                          <SelectItem value="B2G1">Buy 2, Get 1 Free</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Popular">Popular</SelectItem>
                          <SelectItem value="Sale">Sale</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
             <Button type="submit" size="lg">Save Product</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
