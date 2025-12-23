
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Order management and status tracking (Processing, On Shipment, Delivered) will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
