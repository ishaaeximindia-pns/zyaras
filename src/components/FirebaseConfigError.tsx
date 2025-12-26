'use client';

import { useContext } from 'react';
import { FirebaseContext } from '@/firebase/provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function FirebaseConfigError() {
  const context = useContext(FirebaseContext);

  // Only show error if Firebase is not available and we're on the client
  if (typeof window === 'undefined' || !context || context.areServicesAvailable) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background p-4 z-50">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Firebase Configuration Required</CardTitle>
          </div>
          <CardDescription>
            Firebase environment variables are not configured. Please set up your Firebase credentials.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-semibold mb-2">Required Environment Variables:</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
              <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
              <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
              <li>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</li>
              <li>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</li>
              <li>NEXT_PUBLIC_FIREBASE_APP_ID</li>
            </ul>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold mb-1">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to your Vercel project settings</li>
              <li>Navigate to Environment Variables</li>
              <li>Add all the Firebase environment variables</li>
              <li>Redeploy your application</li>
            </ol>
          </div>
          {context.userError && (
            <div className="text-sm text-destructive">
              Error: {context.userError.message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

