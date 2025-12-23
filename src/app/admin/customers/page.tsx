
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminCustomersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Customers</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Customer management will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
