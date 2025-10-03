'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';

export default function TestComponentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Component Test Page</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>Testing if Card components work</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is a test card to verify components are working.</p>
          </CardContent>
        </Card>

        <Alert>
          <AlertDescription>
            This is a test alert to verify Alert components work.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Input placeholder="Test input field" />
          <Button>Test Button</Button>
        </div>

        <div className="text-center">
          <p className="text-green-600 font-semibold">
            If you can see this page without errors, all components are working!
          </p>
        </div>
      </div>
    </div>
  );
}

