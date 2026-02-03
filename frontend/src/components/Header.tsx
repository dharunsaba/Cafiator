import { Coffee, MapPin, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative z-10 text-center py-8 px-4">
      {/* Logo Section */}
      <div className="inline-flex items-center gap-3 glass rounded-2xl px-6 py-4 mb-6 hover-lift">
        <Coffee className="w-8 h-8 text-warm" />
        <h1 className="text-4xl md:text-5xl font-black text-gradient-hero tracking-tight">
          Cafiator
        </h1>
        <MapPin className="w-8 h-8 text-primary" />
      </div>

      {/* Tagline */}
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
        Discover the{' '}
        <span className="text-accent font-semibold">perfect cafes</span> for your
        dates, photoshoots, and chill sessions.{' '}
        <Sparkles className="inline w-4 h-4 text-warm" /> Find couple-friendly,
        Instagram-worthy spots near you!
      </p>
    </header>
  );
};

export default Header;
