import { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const SearchBar = ({ onSearch, isLoading = false, placeholder = "Search for cafes, vibes, or cuisines..." }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-6 glass border-border/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground text-base rounded-2xl transition-all duration-300 focus:shadow-glow-sm"
          />
          <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="px-8 py-6 bg-gradient-primary text-primary-foreground font-semibold rounded-2xl hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-glow-sm disabled:opacity-50 disabled:hover:scale-100"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Find
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
