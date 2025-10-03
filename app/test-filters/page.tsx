'use client';

import { useState, useEffect } from 'react';
import { SimpleProductFilters } from '@/components/simple-product-filters';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  isDeal?: boolean;
  dealPrice?: number;
  tags?: string[];
}

export default function TestFiltersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock products for testing
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        _id: '1',
        name: 'LEGO Classic Creative Bricks',
        category: 'Building Blocks',
        price: 2500,
        isDeal: true,
        dealPrice: 2000,
        previousPrice: 2500,
        tags: ['Educational', 'Creative', '3-5 years']
      },
      {
        _id: '2',
        name: 'Barbie Dreamhouse',
        category: 'Dolls & Accessories',
        price: 5000,
        tags: ['Interactive', '3-5 years']
      },
      {
        _id: '3',
        name: 'Educational Puzzle Set',
        category: 'Educational',
        price: 1500,
        isDeal: true,
        dealPrice: 1200,
        previousPrice: 1500,
        tags: ['Educational', 'Safe Materials', '6-8 years']
      },
      {
        _id: '4',
        name: 'Action Figure Set',
        category: 'Action Figures',
        price: 800,
        tags: ['Interactive', '9-12 years']
      },
      {
        _id: '5',
        name: 'Art Supplies Kit',
        category: 'Arts & Crafts',
        price: 3000,
        tags: ['Creative', 'Washable', '6-8 years']
      },
      {
        _id: '6',
        name: 'Board Game Collection',
        category: 'Board Games',
        price: 4000,
        isDeal: true,
        dealPrice: 3200,
        previousPrice: 4000,
        tags: ['Educational', 'Family', '9-12 years']
      }
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-brana-green mb-2">Loading...</div>
          <div className="text-gray-600">Setting up filter system</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-pink-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold brana-text-gradient mb-4">
            Filter System Test
          </h1>
          <p className="text-lg text-gray-600">
            Test the left sidebar filter system with mock products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <SimpleProductFilters
              products={products}
              onFiltersChange={setFilteredProducts}
            />
          </div>

          {/* Products Display */}
          <div className="flex-1">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-brana-green mb-2">
                Products ({filteredProducts.length})
              </h2>
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="mb-4">
                    <div className="text-sm text-brana-purple font-medium mb-2">
                      {product.category}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.floor(Math.random() * 3) + 3 ? 'text-brana-yellow' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {product.isDeal ? (
                        <div>
                          <span className="text-2xl font-bold text-brana-green">
                            KSh {product.dealPrice?.toLocaleString()}
                          </span>
                          <div className="text-sm text-gray-500 line-through">
                            was KSh {product.previousPrice?.toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-brana-green">
                          KSh {product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {product.isDeal && (
                      <span className="bg-brana-yellow text-white px-2 py-1 rounded-full text-xs font-bold">
                        SALE
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    Tags: {product.tags?.join(', ')}
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters to see more products
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

