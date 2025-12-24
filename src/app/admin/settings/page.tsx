
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { storeSettings } from '@/data/settings';

const settingsSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  storeEmail: z.string().email('Invalid email address'),
  storePhone: z.string().optional(),
  storeAddress: z.string().optional(),
  
  shippingFlatRate: z.coerce.number().min(0).optional(),
  enableTaxes: z.boolean().default(false),
  taxRate: z.string().optional(),

  currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'INR']),
  language: z.enum(['en', 'es', 'fr']),

  additionalFeeName: z.string().optional(),
  additionalFeeAmount: z.coerce.number().min(0).optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ...storeSettings,
      taxRate: storeSettings.taxRate.toString(),
    },
  });
  
  const watchEnableTaxes = form.watch('enableTaxes');

  const onSubmit = (data: SettingsFormValues) => {
    toast({
      title: 'Settings Saved',
      description: 'Your general settings have been updated.',
    });
    console.log(data);
  };

  const gstRates = ["0", "5", "12", "18", "28", "40"];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">General Settings</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
          
          {/* Left Column */}
          <div className="lg:col-span-2 grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Details</CardTitle>
                <CardDescription>Update your store's basic information.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="storeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="storeEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl><Input type="email" {...field} /></FormControl>
                       <FormDescription>This email will be used for customer communication.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="storePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Phone</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="storeAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Address</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping, Taxes & Fees</CardTitle>
                <CardDescription>Configure how you handle shipping and other charges.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="shippingFlatRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flat Shipping Rate</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} placeholder="5.00" /></FormControl>
                       <FormDescription>Set a flat rate for all shipping. Leave blank or 0 to disable.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="enableTaxes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Enable Taxes</FormLabel>
                        <FormDescription>
                          Enable this to calculate and collect sales tax at checkout.
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
                {watchEnableTaxes && (
                   <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default GST Rate</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {gstRates.map(rate => (
                              <SelectItem key={rate} value={rate}>{rate}%</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                    <FormField
                      control={form.control}
                      name="additionalFeeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Fee Name</FormLabel>
                          <FormControl><Input {...field} placeholder="e.g. Handling Fee" /></FormControl>
                           <FormDescription>Label for the extra charge.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="additionalFeeAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Fee Amount</FormLabel>
                          <FormControl><Input type="number" step="0.01" {...field} placeholder="2.50" /></FormControl>
                          <FormDescription>The amount for the fee.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 grid gap-6 content-start">
             <Card>
                <CardHeader>
                  <CardTitle>Localization</CardTitle>
                   <CardDescription>Set your store's currency and language.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                            <SelectItem value="USD">USD - United States Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
               <Button type="submit" size="lg">Save Settings</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
