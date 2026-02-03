import { useState, useMemo } from 'react';
import { Filter, X, SlidersHorizontal, Coffee } from 'lucide-react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import CitySelector from '@/components/CitySelector';
import CafeCard from '@/components/CafeCard';
import FloatingParticles from '@/components/FloatingParticles';
import { Button } from '@/components/ui/button';
import { categories, cities, sampleCafes, Cafe } from '@/lib/cafeData';
import { cn } from '@/lib/utils';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('madurai');
  const [selectedArea, setSelectedArea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter cafes based on search and filters
  const filteredCafes = useMemo(() => {
    let result = [...sampleCafes];

    // Filter by city
    result = result.filter((cafe) => cafe.city.toLowerCase() === cities.find(c => c.id === selectedCity)?.name.toLowerCase());

    // Filter by area
    if (selectedArea) {
      result = result.filter((cafe) => cafe.area === selectedArea);
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter((cafe) =>
        selectedCategories.some((cat) => cafe.category.includes(cat))
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (cafe) =>
          cafe.name.toLowerCase().includes(query) ||
          cafe.description.toLowerCase().includes(query) ||
          cafe.features.some((f) => f.toLowerCase().includes(query)) ||
          cafe.category.some((c) => c.toLowerCase().includes(query))
      );
    }

    return result;
  }, [searchQuery, selectedCategories, selectedCity, selectedArea]);

  const handleSearch = (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    // Simulate search delay
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedArea('');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedArea || searchQuery;

  return (
    <div className="min-h-screen relative">
      {/* Floating Particles Background */}
      <FloatingParticles />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <Header />

        {/* Search Section */}
        <div className="container max-w-4xl mx-auto px-4 mb-8">
          <div className="glass rounded-3xl p-6 shadow-glass">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />

            {/* Quick Filter Toggle for Mobile */}
            <div className="flex items-center justify-between mt-4 lg:hidden">
              <Button
                variant="ghost"
                onClick={() => setShowFilters(!showFilters)}
                className="text-muted-foreground hover:text-foreground"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 w-5 h-5 bg-accent text-accent-foreground rounded-full text-xs flex items-center justify-center">
                    {selectedCategories.length + (selectedArea ? 1 : 0)}
                  </span>
                )}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <aside
              className={cn(
                "lg:col-span-1 space-y-6 transition-all duration-300",
                showFilters ? "block" : "hidden lg:block"
              )}
            >
              {/* City & Area Selector */}
              <div className="glass rounded-3xl p-6 shadow-glass">
                <CitySelector
                  cities={cities}
                  selectedCity={selectedCity}
                  selectedArea={selectedArea}
                  onCityChange={setSelectedCity}
                  onAreaChange={setSelectedArea}
                />
              </div>

              {/* Category Filters */}
              <div className="glass rounded-3xl p-6 shadow-glass">
                <CategoryFilter
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryToggle={handleCategoryToggle}
                />
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full border-accent/50 text-accent hover:bg-accent/10 rounded-2xl"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </aside>

            {/* Cafe Results */}
            <main className="lg:col-span-3">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl glass">
                    <Coffee className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {filteredCafes.length} Cafes Found
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      in {cities.find(c => c.id === selectedCity)?.name}
                      {selectedArea && `, ${selectedArea}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cafe Grid */}
              {filteredCafes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCafes.map((cafe, index) => (
                    <CafeCard key={cafe.id} cafe={cafe} index={index} />
                  ))}
                </div>
              ) : (
                <div className="glass rounded-3xl p-12 text-center">
                  <Coffee className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Cafes Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search for something else
                  </p>
                  <Button
                    onClick={clearFilters}
                    className="bg-gradient-primary text-primary-foreground rounded-2xl"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
