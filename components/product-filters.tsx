'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  priceRange: [number, number];
  ageGroups: string[];
  features: string[];
  ratings: number[];
  onSale: boolean;
}

interface ProductFiltersProps {
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

const AGE_GROUPS = [
  '0-2 years',
  '3-5 years', 
  '6-8 years',
  '9-12 years',
  '13+ years'
];

const FEATURES = [
  'Educational',
  'Interactive',
  'Creative',
  'Safe Materials',
  'Eco-Friendly',
  'Battery Operated',
  'Washable',
  'Light & Sound'
];

export function ProductFilters({ products, onFiltersChange, className }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 10000],
    ageGroups: [],
    features: [],
    ratings: [],
    onSale: false,
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Get unique categories from products
  const availableCategories = Array.from(
    new Set(products.map(p => p.category))
  ).sort();

  // Get price range from products
  const prices = products.map(p => p.isDeal ? (p.dealPrice || p.price) : p.price);
  const minPrice = Math.min(...prices, 0);
  const maxPrice = Math.max(...prices, 10000);

  // Update price range when products change
  useEffect(() => {
    if (prices.length > 0) {
      setFilters(prev => ({
        ...prev,
        priceRange: [minPrice, maxPrice]
      }));
    }
  }, [minPrice, maxPrice]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = product.isDeal ? (product.dealPrice || product.price) : product.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Age group filter (based on tags)
    if (filters.ageGroups.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.tags) return false;
        return filters.ageGroups.some(ageGroup => 
          product.tags!.some(tag => tag.toLowerCase().includes(ageGroup.toLowerCase()))
        );
      });
    }

    // Features filter (based on tags)
    if (filters.features.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.tags) return false;
        return filters.features.some(feature => 
          product.tags!.some(tag => tag.toLowerCase().includes(feature.toLowerCase()))
        );
      });
    }

    // Rating filter
    if (filters.ratings.length > 0) {
      // For now, we'll simulate ratings based on product name length
      // In a real app, you'd have actual rating data
      filtered = filtered.filter(product => {
        const simulatedRating = Math.floor(Math.random() * 5) + 1;
        return filters.ratings.includes(simulatedRating);
      });
    }

    // On sale filter
    if (filters.onSale) {
      filtered = filtered.filter(product => product.isDeal);
    }

    onFiltersChange(filtered);
  }, [filters, products, onFiltersChange]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleAgeGroup = (ageGroup: string) => {
    setFilters(prev => ({
      ...prev,
      ageGroups: prev.ageGroups.includes(ageGroup)
        ? prev.ageGroups.filter(a => a !== ageGroup)
        : [...prev.ageGroups, ageGroup]
    }));
  };

  const toggleFeature = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const toggleRating = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      ratings: prev.ratings.includes(rating)
        ? prev.ratings.filter(r => r !== rating)
        : [...prev.ratings, rating]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      priceRange: [minPrice, maxPrice],
      ageGroups: [],
      features: [],
      ratings: [],
      onSale: false,
    });
  };

  const getActiveFiltersCount = () => {
    return filters.categories.length + 
           filters.ageGroups.length + 
           filters.features.length + 
           filters.ratings.length + 
           (filters.onSale ? 1 : 0);
  };

  const FilterSection = ({ title, children, className: sectionClassName }: { 
    title: string; 
    children: React.ReactNode; 
    className?: string;
  }) => (
    <div className={`space-y-3 ${sectionClassName}`}>
      <h3 className="text-lg font-bold text-brana-green flex items-center gap-2">
        <Filter className="h-5 w-5" />
        {title}
      </h3>
      {children}
    </div>
  );

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
      <FilterSection title="Category">
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
                  <Badge variant="secondary" className="text-xs">
                    No items
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range (KSh)">
        <div className="space-y-4">
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value)}
              min={minPrice}
              max={maxPrice}
              step={100}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>KSh {filters.priceRange[0].toLocaleString()}</span>
            <span>KSh {filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </FilterSection>

      {/* Age Groups */}
      <FilterSection title="Age Group">
        <div className="space-y-2">
          {AGE_GROUPS.map((ageGroup) => (
            <div
              key={ageGroup}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleAgeGroup(ageGroup)}
            >
              <Checkbox
                checked={filters.ageGroups.includes(ageGroup)}
                onChange={() => toggleAgeGroup(ageGroup)}
                className="data-[state=checked]:bg-brana-pink data-[state=checked]:border-brana-pink"
              />
              <span className="text-sm text-gray-700">{ageGroup}</span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Features */}
      <FilterSection title="Features">
        <div className="space-y-2">
          {FEATURES.map((feature) => (
            <div
              key={feature}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleFeature(feature)}
            >
              <Checkbox
                checked={filters.features.includes(feature)}
                onChange={() => toggleFeature(feature)}
                className="data-[state=checked]:bg-brana-purple data-[state=checked]:border-brana-purple"
              />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Ratings */}
      <FilterSection title="Customer Rating">
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div
              key={rating}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleRating(rating)}
            >
              <Checkbox
                checked={filters.ratings.includes(rating)}
                onChange={() => toggleRating(rating)}
                className="data-[state=checked]:bg-brana-yellow data-[state=checked]:border-brana-yellow"
              />
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating ? 'text-brana-yellow fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-700 ml-2">& up</span>
              </div>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* On Sale */}
      <FilterSection title="Special Offers">
        <div
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => updateFilter('onSale', !filters.onSale)}
        >
          <Checkbox
            checked={filters.onSale}
            onChange={() => updateFilter('onSale', !filters.onSale)}
            className="data-[state=checked]:bg-brana-yellow data-[state=checked]:border-brana-yellow"
          />
          <Sparkles className="h-4 w-4 text-brana-yellow" />
          <span className="text-sm text-gray-700">On Sale</span>
        </div>
      </FilterSection>
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

