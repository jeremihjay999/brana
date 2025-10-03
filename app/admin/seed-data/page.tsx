'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function SeedDataPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSeedData = async () => {
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await fetch('/api/admin/seed-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to seed data');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-pink-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold brana-text-gradient mb-4">
            Seed BRANA KIDS Data
          </h1>
          <p className="text-lg text-gray-600">
            Populate the database with sample products, categories, and content
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brana-green">
              <Database className="h-6 w-6" />
              Database Seeding
            </CardTitle>
            <CardDescription>
              This will add sample data to your BRANA KIDS store including:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-brana-green/10 p-4 rounded-lg">
                <h3 className="font-semibold text-brana-green mb-2">Categories</h3>
                <p className="text-sm text-gray-600">12 product categories with child-friendly themes</p>
              </div>
              <div className="bg-brana-pink/10 p-4 rounded-lg">
                <h3 className="font-semibold text-brana-pink mb-2">Products</h3>
                <p className="text-sm text-gray-600">24 sample products with realistic data</p>
              </div>
              <div className="bg-brana-blue/10 p-4 rounded-lg">
                <h3 className="font-semibold text-brana-blue mb-2">Banners</h3>
                <p className="text-sm text-gray-600">3 promotional banners for the homepage</p>
              </div>
            </div>

            {result && (
              <Alert className="mb-6">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Success!</strong> Database has been seeded with sample data.
                  <div className="mt-2 text-sm">
                    <div>Categories: {result.data?.categories}</div>
                    <div>Products: {result.data?.products}</div>
                    <div>Banners: {result.data?.banners}</div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSeedData}
              disabled={loading}
              className="w-full bg-brana-green hover:bg-brana-green/90 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Seeding Database...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Seed Database
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-brana-purple">What Gets Added</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Action Figures & Superheroes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Arts & Crafts Supplies
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Board Games & Puzzles
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Building Blocks & LEGO
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Dolls & Accessories
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Educational Toys
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Electronic Toys
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Outdoor Toys
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Musical Instruments
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Baby Toys
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Children's Clothing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Special Deals
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-brana-blue">Features Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Realistic pricing in KSh
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Age-appropriate tags
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Sale prices and deals
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Stock levels
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Product descriptions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Category icons and colors
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Featured products
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Promotional banners
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Child-friendly themes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Educational content
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            After seeding, you can view the products at{' '}
            <a href="/products" className="text-brana-green hover:underline">
              /products
            </a>{' '}
            or test the filters at{' '}
            <a href="/test-filters" className="text-brana-green hover:underline">
              /test-filters
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

