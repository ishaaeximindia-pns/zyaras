
'use client';

// Force dynamic rendering (uses Firebase)
export const dynamic = 'force-dynamic';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, Users, ShoppingBag, Database, ArrowUp, Activity, BarChart3, Users2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { seedDatabase } from '@/lib/seed-db';
import { useToast } from '@/hooks/use-toast';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { orders } from '@/data/account';
import { customers } from '@/data/customers';
import { products } from '@/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, subMonths, isWithinInterval } from 'date-fns';

const getTotalRevenue = () => {
    return orders.reduce((total, order) => total + order.total, 0);
};

const getNewCustomersThisMonth = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return customers.filter(c => {
        const joinDate = new Date(c.joinDate);
        return isWithinInterval(joinDate, { start: firstDayOfMonth, end: today });
    }).length;
};

const getRevenueData = () => {
    const data = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const month = subMonths(today, i);
        const monthName = format(month, 'MMM');
        const monthRevenue = orders
            .filter(order => format(new Date(order.date), 'yyyy-MM') === format(month, 'yyyy-MM'))
            .reduce((sum, order) => sum + order.total, 0);
        data.push({ name: monthName, total: monthRevenue });
    }
    return data;
};


export default function AdminDashboardPage() {
  const { toast } = useToast();

  const handleSeedDatabase = async () => {
    const result = await seedDatabase();
    if (result.success) {
      toast({
        title: 'Database Seeded',
        description: result.message,
      });
    } else {
      toast({
        title: 'Seeding Failed',
        description: result.message,
        variant: 'destructive',
      });
    }
  };
  
  const totalRevenue = getTotalRevenue();
  const revenueData = getRevenueData();
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const newCustomersThisMonth = getNewCustomersThisMonth();
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalOrders}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
             <p className="text-xs text-muted-foreground">+{newCustomersThisMonth} new this month</p>
          </CardContent>
        </Card>
      </div>

       <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <ResponsiveContainer width="100%" height={350}>
              <BarChart data={revenueData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Users2 className="h-5 w-5" />
                Recent Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {orders.slice(0, 5).map(order => {
                 const customer = customers.find(c => c.totalOrders > 0) ?? customers[0]; // Simplified for demo
                 return (
                    <div key={order.id} className="flex items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={customer.avatar} alt="Avatar" />
                            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                        <div className="ml-auto font-medium">+${order.total.toFixed(2)}</div>
                    </div>
                 )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" /> Database Management
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">
                Use this to populate your Firestore database with the initial set of products from your local data files. This is a one-time operation.
                </p>
                <Button onClick={handleSeedDatabase}>
                Seed Product Database
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

