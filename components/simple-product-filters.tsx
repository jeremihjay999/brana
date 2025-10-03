'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  X, 
  Star, 
  Heart, 
  Sparkles,
  Baby,
  Shirt,
  Gamepad2,
  BookOpen,
  Palette,
  Puzzle,
  Car,
  Music,
  Zap
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  isDeal?: boolean;
  dealPrice?: number;
  tags?: string[];
}

interface FilterState {
  categories: string[];
  onSale: boolean;
}

interface SimpleProductFiltersProps {
  products: Product[];
  onFiltersChange: (filteredProducts: Product[]) => void;
  className?: string;
}

const CATEGORIES = [
  { name: 'Action Figures', icon: Zap, color: 'text-brana-blue' },
  { name: 'Arts & Crafts', icon: Palette, color: 'text-brana-pink' },
  { name: 'Board Games', icon: Puzzle, color: 'text-brana-purple' },
  { name: 'Building Blocks', icon: Gamepad2, color: 'text-brana-green' },
  { name: 'Dolls & Accessories', icon: Heart, color: 'text-brana-pink' },
  { name: 'Educational', icon: BookOpen, color: 'text-brana-blue' },
  { name: 'Electronic Toys', icon: Zap, color: 'text-brana-yellow' },
  { name: 'Outdoor Toys', icon: Car, color: 'text-brana-green' },
  { name: 'Musical Toys', icon: Music, color: 'text-brana-purple' },
  { name: 'Baby Toys', icon: Baby, color: 'text-brana-pink' },
  { name: 'Clothing', icon: Shirt, color: 'text-brana-blue' },
  { name: 'Special Deals', icon: Sparkles, color: 'text-brana-yellow' },
];

export function SimpleProductFilters({ products, onFiltersChange, className }: SimpleProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    onSale: false,
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Get unique categories from products
  const availableCategories = Array.from(
    new Set(products.map(p => p.category))
  ).sort();

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    // On sale filter
    if (filters.onSale) {
      filtered = filtered.filter(product => product.isDeal);
    }

    onFiltersChange(filtered);
  }, [filters, products, onFiltersChange]);

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      onSale: false,
    });
  };

  const getActiveFiltersCount = () => {
    return filters.categories.length + (filters.onSale ? 1 : 0);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-brana-pink hover:text-brana-pink hover:bg-brana-pink/10"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-brana-green flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Category
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isAvailable = availableCategories.includes(category.name);
            const isSelected = filters.categories.includes(category.name);
            
            return (
              <div
                key={category.name}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                  isSelected ? 'bg-brana-green/10 border border-brana-green/20' : 'hover:bg-gray-50'
                } ${!isAvailable ? 'opacity-50' : 'cursor-pointer'}`}
                onClick={() => isAvailable && toggleCategory(category.name)}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => isAvailable && toggleCategory(category.name)}
                  disabled={!isAvailable}
                  className="data-[state=checked]:bg-brana-green data-[state=checked]:border-brana-green"
                />
                <Icon className={`h-4 w-4 ${category.color}`} />
                <span className={`text-sm ${isSelected ? 'font-medium text-brana-green' : 'text-gray-700'}`}>
                  {category.name}
                </span>
                {!isAvailable && (
                  <span className="text-xs text-gray-400 ml-auto">No items</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-brana-green flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Price Range (KSh)
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brana-green focus:ring-1 focus:ring-brana-green"
            />
            <input
              type="number"
              placeholder="Max"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brana-green focus:ring-1 focus:ring-brana-green"
            />
          </div>
        </div>
      </div>

      {/* On Sale */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-brana-green flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Special Offers
        </h3>
        <div
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => setFilters(prev => ({ ...prev, onSale: !prev.onSale }))}
        >
          <Checkbox
            checked={filters.onSale}
            onChange={() => setFilters(prev => ({ ...prev, onSale: !prev.onSale }))}
            className="data-[state=checked]:bg-brana-yellow data-[state=checked]:border-brana-yellow"
          />
          <Sparkles className="h-4 w-4 text-brana-yellow" />
          <span className="text-sm text-gray-700">On Sale</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setIsMobileOpen(true)}
          className="w-full bg-brana-green hover:bg-brana-green/90 text-white"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters ({getActiveFiltersCount()})
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:block ${className}`}>
        <Card className="sticky top-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-brana-green flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FilterContent />
          </CardContent>
        </Card>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-brana-green">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

