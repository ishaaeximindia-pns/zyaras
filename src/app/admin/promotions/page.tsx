
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

export default function AdminPromotionsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Promotions</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Coupon
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Active Coupon Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Coupon code CRUD (Create, Read, Update, Delete) functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
