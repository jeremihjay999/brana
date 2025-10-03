'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';

export default function DebugAPIPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('superadmin@gmail.com');
  const [password, setPassword] = useState('superadmin123');

  const testAPI = async (endpoint: string, method: string = 'GET', body?: any) => {
    setLoading(true);
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const contentType = response.headers.get('content-type');
      const isJSON = contentType?.includes('application/json');

      let data;
      if (isJSON) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { 
          error: 'Not JSON response', 
          contentType, 
          text: text.substring(0, 200) + '...' 
        };
      }

      setTestResults({
        endpoint,
        method,
        status: response.status,
        statusText: response.statusText,
        contentType,
        isJSON,
        data
      });
    } catch (error) {
      setTestResults({
        endpoint,
        method,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    await testAPI('/api/admin/auth/login', 'POST', { email, password });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>API Debug Tool</CardTitle>
            <CardDescription>
              Test API endpoints to debug the super admin login issue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="superadmin123"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => testAPI('/api/test')} disabled={loading}>
                Test Basic API
              </Button>
              <Button onClick={() => testAPI('/api/admin/setup-super-admin', 'POST', { secretKey: 'BRANA_KIDS_SUPER_ADMIN_2024' })} disabled={loading}>
                Test Setup API
              </Button>
              <Button onClick={testLogin} disabled={loading}>
                Test Login API
              </Button>
              <Button onClick={() => testAPI('/api/admin/users')} disabled={loading}>
                Test Users API
              </Button>
            </div>

            {testResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Endpoint:</strong> {testResults.endpoint}
                      </div>
                      <div>
                        <strong>Method:</strong> {testResults.method}
                      </div>
                      <div>
                        <strong>Status:</strong> {testResults.status} {testResults.statusText}
                      </div>
                      <div>
                        <strong>Content-Type:</strong> {testResults.contentType}
                      </div>
                      <div>
                        <strong>Is JSON:</strong> {testResults.isJSON ? 'Yes' : 'No'}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <strong>Response Data:</strong>
                      <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-96">
                        {JSON.stringify(testResults.data, null, 2)}
                      </pre>
                    </div>

                    {testResults.error && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          <strong>Error:</strong> {testResults.error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
