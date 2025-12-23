
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Admin settings will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
