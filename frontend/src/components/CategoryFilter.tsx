import { Heart, Camera, Coffee, Sparkles, Zap, Gem, LucideIcon } from 'lucide-react';
import { Category } from '@/lib/cafeData';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Camera,
  Coffee,
  Sparkles,
  Zap,
  Gem,
};

const CategoryFilter = ({ categories, selectedCategories, onCategoryToggle }: CategoryFilterProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-foreground font-semibold flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        Categories
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3">
        {categories.map((category, index) => {
          const Icon = iconMap[category.icon] || Sparkles;
          const isSelected = selectedCategories.includes(category.id);

          return (
            <button
              key={category.id}
              onClick={() => onCategoryToggle(category.id)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={cn(
                "group relative p-4 rounded-2xl text-left transition-all duration-300 hover-lift animate-fade-in opacity-0",
                isSelected
                  ? `${category.gradient} text-white shadow-lg`
                  : "glass hover:bg-white/10"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    isSelected
                      ? "bg-white/20"
                      : "bg-white/5 group-hover:bg-white/10"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-colors",
                    isSelected ? "text-white" : "text-primary"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium text-sm truncate transition-colors",
                    isSelected ? "text-white" : "text-foreground"
                  )}>
                    {category.name}
                  </p>
                  <p className={cn(
                    "text-xs truncate transition-colors",
                    isSelected ? "text-white/80" : "text-muted-foreground"
                  )}>
                    {category.description}
                  </p>
                </div>
              </div>
              {isSelected && (
                <div className="absolute inset-0 rounded-2xl ring-2 ring-white/30 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
