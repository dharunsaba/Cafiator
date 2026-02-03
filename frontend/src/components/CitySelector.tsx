import { MapPin, Navigation } from 'lucide-react';
import { City } from '@/lib/cafeData';
import { cn } from '@/lib/utils';

interface CitySelectorProps {
  cities: City[];
  selectedCity: string;
  selectedArea: string;
  onCityChange: (cityId: string) => void;
  onAreaChange: (area: string) => void;
}

const CitySelector = ({
  cities,
  selectedCity,
  selectedArea,
  onCityChange,
  onAreaChange,
}: CitySelectorProps) => {
  const currentCity = cities.find((c) => c.id === selectedCity);

  return (
    <div className="space-y-4">
      {/* City Selection */}
      <div className="space-y-3">
        <h3 className="text-foreground font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent" />
          Select City
        </h3>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => onCityChange(city.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105",
                selectedCity === city.id
                  ? "bg-gradient-secondary text-white shadow-lg shadow-accent/20"
                  : "glass text-foreground hover:bg-white/10"
              )}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Area Selection */}
      {currentCity && (
        <div className="space-y-3 animate-fade-in">
          <h3 className="text-foreground font-semibold flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary" />
            Choose Area
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onAreaChange('')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300",
                selectedArea === ''
                  ? "bg-gradient-primary text-primary-foreground shadow-glow-sm"
                  : "glass text-muted-foreground hover:text-foreground hover:bg-white/10"
              )}
            >
              All Areas
            </button>
            {currentCity.areas.map((area) => (
              <button
                key={area}
                onClick={() => onAreaChange(area)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300",
                  selectedArea === area
                    ? "bg-gradient-primary text-primary-foreground shadow-glow-sm"
                    : "glass text-muted-foreground hover:text-foreground hover:bg-white/10"
                )}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelector;
