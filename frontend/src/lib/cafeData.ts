export interface Cafe {
  id: string;
  name: string;
  description: string;
  category: string[];
  rating: number;
  priceRange: '$' | '$$' | '$$$';
  area: string;
  city: string;
  phone: string;
  timings: {
    open: string;
    close: string;
    days: string;
  };
  features: string[];
  imageUrl: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  gradient: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  areas: string[];
}

export const categories: Category[] = [
  {
    id: 'couple-friendly',
    name: 'Couple Friendly',
    icon: 'Heart',
    description: 'Cozy spots perfect for dates',
    gradient: 'category-couple',
  },
  {
    id: 'photoshoot',
    name: 'Photoshoot Ready',
    icon: 'Camera',
    description: 'Instagram-worthy aesthetics',
    gradient: 'category-photoshoot',
  },
  {
    id: 'coffee-chill',
    name: 'Coffee & Chill',
    icon: 'Coffee',
    description: 'Best brews in town',
    gradient: 'category-coffee',
  },
  {
    id: 'chill-spots',
    name: 'Chill Vibes',
    icon: 'Sparkles',
    description: 'Relax and unwind spots',
    gradient: 'category-chill',
  },
  {
    id: 'trendy',
    name: 'Trendy & Hip',
    icon: 'Zap',
    description: 'Latest hotspots in town',
    gradient: 'category-trendy',
  },
  {
    id: 'hidden-gems',
    name: 'Hidden Gems',
    icon: 'Gem',
    description: 'Offbeat discoveries',
    gradient: 'category-hidden',
  },
];

export const cities: City[] = [
  {
    id: 'madurai',
    name: 'Madurai',
    state: 'Tamil Nadu',
    areas: ['Anna Nagar', 'KK Nagar', 'Tallakulam', 'Simakkal', 'Goripalayam', 'Bypass Road', 'Arapalayam', 'Periyar'],
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    areas: ['T Nagar', 'Anna Nagar', 'Velachery', 'Adyar', 'Besant Nagar', 'ECR', 'Nungambakkam', 'Alwarpet'],
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    state: 'Tamil Nadu',
    areas: ['RS Puram', 'Race Course', 'Gandhipuram', 'Peelamedu', 'Saibaba Colony', 'Brookefields'],
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    state: 'Karnataka',
    areas: ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'JP Nagar', 'Jayanagar', 'MG Road'],
  },
];

// Sample cafe data for demonstration
export const sampleCafes: Cafe[] = [
  {
    id: '1',
    name: 'The Cozy Corner Café',
    description: 'A warm and intimate space perfect for couples. Beautiful indoor plants, fairy lights, and the best filter coffee in town. Their signature cheesecake is a must-try!',
    category: ['couple-friendly', 'coffee-chill', 'photoshoot'],
    rating: 4.8,
    priceRange: '$$',
    area: 'Anna Nagar',
    city: 'Madurai',
    phone: '9876543210',
    timings: {
      open: '08:00 AM',
      close: '10:00 PM',
      days: 'All Days',
    },
    features: ['WiFi', 'AC', 'Couple Seating', 'Live Music'],
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
  },
  {
    id: '2',
    name: 'Aesthetic Brew House',
    description: 'Minimalist design meets premium coffee. Every corner is photo-ready with neon signs, exposed brick walls, and stunning ceiling decor. Perfect for content creators!',
    category: ['photoshoot', 'trendy', 'coffee-chill'],
    rating: 4.7,
    priceRange: '$$$',
    area: 'KK Nagar',
    city: 'Madurai',
    phone: '9876543211',
    timings: {
      open: '09:00 AM',
      close: '11:00 PM',
      days: 'Mon - Sun',
    },
    features: ['Photo Spots', 'Premium Coffee', 'Desserts', 'Rooftop'],
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
  },
  {
    id: '3',
    name: 'Garden View Lounge',
    description: 'Outdoor seating with lush greenery all around. A hidden paradise in the city. Great for peaceful dates and catching the sunset. Try their organic cold brew!',
    category: ['couple-friendly', 'chill-spots', 'hidden-gems'],
    rating: 4.6,
    priceRange: '$$',
    area: 'Tallakulam',
    city: 'Madurai',
    phone: '9876543212',
    timings: {
      open: '07:00 AM',
      close: '09:00 PM',
      days: 'Tue - Sun',
    },
    features: ['Garden Seating', 'Organic Menu', 'Pet Friendly', 'Sunset View'],
    imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400',
  },
  {
    id: '4',
    name: 'Retro Vibes Café',
    description: 'Step back in time with vintage décor, vinyl records on the wall, and classic Bollywood music. Their milkshakes and burgers are legendary among locals!',
    category: ['trendy', 'photoshoot', 'chill-spots'],
    rating: 4.5,
    priceRange: '$',
    area: 'Goripalayam',
    city: 'Madurai',
    phone: '9876543213',
    timings: {
      open: '10:00 AM',
      close: '10:00 PM',
      days: 'All Days',
    },
    features: ['Vintage Décor', 'Budget Friendly', 'Milkshakes', 'Board Games'],
    imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400',
  },
  {
    id: '5',
    name: 'Skyline Rooftop Café',
    description: 'The city\'s best rooftop experience! Panoramic views, twinkling city lights, and a romantic atmosphere. Perfect for special occasions and sunset dates.',
    category: ['couple-friendly', 'photoshoot', 'trendy'],
    rating: 4.9,
    priceRange: '$$$',
    area: 'Bypass Road',
    city: 'Madurai',
    phone: '9876543214',
    timings: {
      open: '04:00 PM',
      close: '12:00 AM',
      days: 'Wed - Mon',
    },
    features: ['Rooftop', 'City View', 'Live Music', 'Premium Dining'],
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
  },
  {
    id: '6',
    name: 'The Book Nook',
    description: 'A quiet sanctuary for book lovers and coffee enthusiasts. Cozy reading corners, wooden interiors, and the smell of old books mixed with fresh espresso.',
    category: ['chill-spots', 'hidden-gems', 'coffee-chill'],
    rating: 4.4,
    priceRange: '$',
    area: 'Simakkal',
    city: 'Madurai',
    phone: '9876543215',
    timings: {
      open: '08:00 AM',
      close: '08:00 PM',
      days: 'Mon - Sat',
    },
    features: ['Library', 'Quiet Zone', 'Artisan Coffee', 'Book Exchange'],
    imageUrl: 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=400',
  },
  {
    id: '7',
    name: 'Tropical Paradise Café',
    description: 'Bali-inspired interiors with bamboo furniture, tropical plants, and a stunning waterfall wall. Their smoothie bowls and mocktails are Instagram gold!',
    category: ['photoshoot', 'trendy', 'chill-spots'],
    rating: 4.7,
    priceRange: '$$',
    area: 'Arapalayam',
    city: 'Madurai',
    phone: '9876543216',
    timings: {
      open: '09:00 AM',
      close: '10:00 PM',
      days: 'All Days',
    },
    features: ['Tropical Theme', 'Smoothie Bowls', 'AC', 'Photo Walls'],
    imageUrl: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400',
  },
  {
    id: '8',
    name: 'Midnight Espresso',
    description: 'The city\'s favorite late-night hangout. Open till midnight with amazing coffee, quick bites, and a vibrant atmosphere. Perfect for night owls!',
    category: ['coffee-chill', 'trendy', 'hidden-gems'],
    rating: 4.3,
    priceRange: '$',
    area: 'Periyar',
    city: 'Madurai',
    phone: '9876543217',
    timings: {
      open: '06:00 PM',
      close: '12:00 AM',
      days: 'All Days',
    },
    features: ['Late Night', 'Live Music Fri-Sat', 'Quick Bites', 'WiFi'],
    imageUrl: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400',
  },
];
