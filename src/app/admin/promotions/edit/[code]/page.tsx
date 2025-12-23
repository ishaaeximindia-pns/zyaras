
'use client';

import { promotions } from '@/data/promotions';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const promotionSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  discount: z.coerce.number().min(1, 'Discount must be at least 1%').max(100, 'Discount cannot exceed 100%'),
  expiryDate: z.date({
    required_error: "An expiration date is required.",
  }),
  status: z.enum(['Active', 'Expired']),
  usageLimit: z.coerce.number().min(0, 'Usage limit must be a positive number'),
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

export default function PromotionEditPage() {
  const router = useRouter();
  const params = useParams();
  const { code } = params;
  const isNew = code === 'new';
  const { toast } = useToast();

  const promotion = isNew ? null : promotions.find((p) => p.code === code);

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: promotion ? {
        ...promotion,
        expiryDate: new Date(promotion.expiryDate),
    } : {
      code: '',
      discount: 10,
      expiryDate: new Date(),
      status: 'Active',
      usageLimit: 100,
    },
  });

  const onSubmit = (data: PromotionFormValues) => {
    toast({
      title: `Coupon ${isNew ? 'created' : 'updated'}`,
      description: `Coupon code ${data.code} has been saved. (This is a mock-up, data is not persisted).`,
    });
    router.push('/admin/promotions');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/admin/promotions">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{isNew ? 'Add New Coupon' : 'Edit Coupon'}</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isNew ? 'Create Coupon' : `Editing: ${promotion?.code}`}</CardTitle>
              <CardDescription>Create and manage your promotional coupon codes.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Code</FormLabel>
                    <FormControl><Input {...field} readOnly={!isNew} placeholder="e.g. FASHION25" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Percentage</FormLabel>
                    <FormControl><Input type="number" {...field} placeholder="e.g. 20" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiration Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0,0,0,0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Limit</FormLabel>
                    <FormControl><Input type="number" {...field} placeholder="e.g. 1000" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Button type="submit" size="lg">Save Coupon</Button>
        </form>
      </Form>
    </div>
  );
}
