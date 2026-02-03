import { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Heart,
  Navigation,
  Camera,
  Wifi,
  Music,
  ChevronRight,
} from 'lucide-react';
import { Cafe } from '@/lib/cafeData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CafeCardProps {
  cafe: Cafe;
  index?: number;
}

const featureIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-3 h-3" />,
  'Live Music': <Music className="w-3 h-3" />,
  'Photo Spots': <Camera className="w-3 h-3" />,
};

const CafeCard = ({ cafe, index = 0 }: CafeCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleGetDirections = () => {
    const query = encodeURIComponent(`${cafe.name}, ${cafe.area}, ${cafe.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${cafe.phone}`, '_self');
  };

  return (
    <div
      style={{ animationDelay: `${index * 100}ms` }}
      className="group glass rounded-3xl overflow-hidden hover-lift animate-fade-in opacity-0 transition-all duration-500"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 bg-muted animate-pulse",
            imageLoaded && "hidden"
          )}
        />
        <img
          src={cafe.imageUrl}
          alt={cafe.name}
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-all duration-700 group-hover:scale-110",
            !imageLoaded && "opacity-0"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full transition-all duration-300",
            isLiked
              ? "bg-accent text-white shadow-glow-accent"
              : "glass text-white hover:bg-white/20"
          )}
        >
          <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
        </button>

        {/* Rating Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1 glass px-3 py-1.5 rounded-full">
          <Star className="w-4 h-4 text-warm fill-warm" />
          <span className="text-white font-semibold text-sm">{cafe.rating}</span>
        </div>

        {/* Price Range */}
        <div className="absolute bottom-4 right-4 glass px-3 py-1 rounded-full">
          <span className="text-white font-bold text-sm">{cafe.priceRange}</span>
        </div>

        {/* Category Tags */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5 max-w-[70%]">
          {cafe.category.slice(0, 2).map((cat) => (
            <Badge
              key={cat}
              className="bg-gradient-primary text-primary-foreground text-xs px-2 py-0.5 border-none"
            >
              {cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </Badge>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {cafe.name}
          </h3>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
            <MapPin className="w-4 h-4 text-accent shrink-0" />
            <span className="truncate">{cafe.area}, {cafe.city}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {cafe.description}
        </p>

        {/* Timings */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-success shrink-0" />
          <span className="text-foreground font-medium">{cafe.timings.open} - {cafe.timings.close}</span>
          <span className="text-muted-foreground">({cafe.timings.days})</span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {cafe.features.slice(0, 4).map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg glass text-xs text-muted-foreground"
            >
              {featureIcons[feature] || null}
              {feature}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleGetDirections}
            className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Directions
          </Button>
          <Button
            onClick={handleCall}
            variant="outline"
            className="flex-1 border-success/50 text-success hover:bg-success/10 hover:border-success rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CafeCard;
