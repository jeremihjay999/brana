'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

export default function CreateSuperAdminPage() {
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleCreateSuperAdmin = async () => {
    if (!secretKey) {
      setError('Please enter the secret key');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/admin/create-super-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretKey }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to create super admin');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-brana-green">Create Super Admin</CardTitle>
          <CardDescription>
            Create the initial super administrator account for BRANA KIDS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="space-y-2">
                  <p className="font-semibold">{result.message}</p>
                  {result.credentials && (
                    <div className="mt-2 p-3 bg-white rounded border">
                      <p className="text-sm font-medium">Login Credentials:</p>
                      <p className="text-sm">Email: {result.credentials.email}</p>
                      <p className="text-sm">Password: {result.credentials.password}</p>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="secretKey" className="text-sm font-medium">
              Secret Key
            </label>
            <Input
              id="secretKey"
              type="password"
              placeholder="Enter secret key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Contact system administrator for the secret key
            </p>
          </div>

          <Button
            onClick={handleCreateSuperAdmin}
            disabled={loading || !secretKey}
            className="w-full bg-brana-green hover:bg-green-600"
          >
            {loading ? 'Creating...' : 'Create Super Admin'}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              This action can only be performed once
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

