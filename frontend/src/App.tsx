import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Star,
  Heart,
  Camera,
  Gem,
  Award,
  ArrowRight,
  Filter,
  X,
  Navigation,
  MessageSquare,
  Plus,
  LocateFixed,
  Loader2,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import CafeDetailsDialog from './CafeDetailsDialog';
import SubmitCafeDialog from './SubmitCafeDialog';
import AdminDashboard from './AdminDashboard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001"; // Matching your updated backend port

// Custom Coffee Cup Icon Component (Starbucks-style silhouette)
const CoffeeCupIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Lid */}
    <path d="M6 4h12c.5 0 1 .5 1 1v1H5V5c0-.5.5-1 1-1Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M9 2h6" />
    {/* Body */}
    <path d="M18.5 6L17 21c-.1 1-.9 1.5-1.5 1.5h-7c-.6 0-1.4-.5-1.5-1.5L5.5 6" />
    {/* Sleeve */}
    <path d="M6.3 11h11.4" strokeWidth="3" />
    <path d="M6.8 15h10.4" strokeWidth="3" />
  </svg>
);

const App = () => {
  // Interfaces matching Backend Pydantic Models
  interface Review {
    id: number;
    user_name: string;
    user_picture: string;
    rating: number;
    comment: string;
    image_url: string;
    created_at: string;
  }

  interface Cafe {
    id: number;
    name: string;
    city: string;
    location: string;
    rating: number;
    tags: string[];
    timings: string;
    image: string;
    direction: string;
    description: string;
    reviews: Review[];
  }

  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [tagFilter, setTagFilter] = useState('All Vibez');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Modal States
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Expanded city list for Tamil Nadu
  const cities = [
    'All Cities', 'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli',
    'Salem', 'Erode', 'Tiruppur', 'Tirunelveli', 'Vellore',
    'Thoothukudi', 'Nagercoil', 'Thanjavur', 'Dindigul', 'Pondicherry',
    'Hosur', 'Kanchipuram', 'Kumbakonam', 'Karaikudi', 'Neyveli'
  ];

  const vibez = [
    { label: 'All Vibez', icon: <Filter size={18} /> },
    { label: 'Couple Friendly', icon: <Heart size={18} /> },
    { label: 'Photospots', icon: <Camera size={18} /> },
    { label: 'Hidden Gems', icon: <Gem size={18} /> },
    { label: 'Best Rated', icon: <Award size={18} /> },
    { label: 'Aesthetic', icon: <Star size={18} /> }
  ];

  // Fetch Cafes
  const fetchCafes = useCallback(async (locationData: { lat: number, lng: number } | null = null) => {
    setLoading(true);
    setErrorMsg('');
    try {
      let url;
      if (locationData) {
        url = `${API_BASE_URL}/cafes/nearby?lat=${locationData.lat}&lon=${locationData.lng}&radius=5`;
      } else {
        const params = new URLSearchParams();
        if (cityFilter !== 'All Cities') params.append('city', cityFilter);
        if (tagFilter !== 'All Vibez') params.append('tag', tagFilter);
        if (searchQuery) params.append('search', searchQuery);
        url = `${API_BASE_URL}/cafes?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Backend connection failed");

      const data = await response.json();
      setCafes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch cafes:", err);
      setErrorMsg("Failed to connect to the Multiverse. Ensure backend is running on 8001.");
    } finally {
      setLoading(false);
    }
  }, [cityFilter, tagFilter, searchQuery]);

  useEffect(() => {
    fetchCafes();
  }, [fetchCafes]);

  const handleNearbySearch = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCityFilter('All Cities');
        setTagFilter('All Vibez');
        setSearchQuery('');
        fetchCafes(coords);
      },
      (error) => {
        setLoading(false);
        setErrorMsg("Location access denied. Please enable it for nearby search.");
      },
      options
    );
  };

  const submitReview = async (cafeId: number, rating: number, comment: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cafes/${cafeId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment,
          user_email: "genz_user@cafiator.com",
          user_name: "Urban Explorer",
          user_picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
          image_url: ""
        })
      });

      if (response.ok) {
        const newReview = await response.json();

        // Update selected cafe state immediately to show the new review
        setSelectedCafe(prev => prev ? ({
          ...prev,
          reviews: [newReview, ...prev.reviews]
        }) : null);

        // Update the main list in background
        setCafes(prev => prev.map(c =>
          c.id === cafeId ? { ...c, reviews: [newReview, ...c.reviews] } : c
        ));
      }
    } catch (err) {
      console.error("Review failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-white overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-600/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-[100] bg-black/60 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCityFilter('All Cities'); setTagFilter('All Vibez'); setSearchQuery(''); }}>
          <div className="bg-yellow-400 p-2.5 rounded-xl rotate-3 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
            <CoffeeCupIcon size={26} className="text-black" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase">
            CAFI<span className="text-yellow-400">ATOR</span>
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleNearbySearch}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 font-black rounded-xl transition-all active:scale-95 shadow-[0_4px_15px_rgba(255,255,255,0.05)] ${loading ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-white text-black hover:bg-yellow-400'
              }`}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <LocateFixed size={18} />}
            <span className="hidden sm:inline uppercase text-xs tracking-widest">NEARBY ME</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 pt-20 pb-10 max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-block bg-white/5 border border-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-yellow-400">
          Tamil Nadu's Elite Cafe Curator
        </div>

        <h2 className="text-6xl md:text-9xl font-black leading-[0.85] mb-8 uppercase tracking-tighter italic">
          Chase the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-white to-purple-500">Aesthetic</span>
        </h2>

        {errorMsg && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-400 font-bold text-sm animate-in fade-in slide-in-from-top-4">
            <AlertCircle size={20} />
            {errorMsg}
            <button onClick={() => setErrorMsg('')} className="ml-auto p-1 hover:bg-white/10 rounded-full">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-12">
          <div className="relative flex-1 group">
            <input
              type="text"
              placeholder="Search by spot name or area..."
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border-2 border-white/10 text-lg font-bold focus:outline-none focus:border-yellow-400 transition-all placeholder:text-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchCafes()}
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={24} />
          </div>

          <div className="relative min-w-[220px]">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full appearance-none bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-5 font-black uppercase text-[11px] tracking-widest focus:outline-none focus:border-yellow-400 transition-all cursor-pointer text-white"
            >
              {cities.map(city => (
                <option key={city} value={city} className="bg-[#0A0A0A] text-white">
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/30" size={18} />
          </div>
        </div>
      </header>

      {/* Vibe Chips */}
      <section className="px-6 pb-12 max-w-7xl mx-auto relative z-10">
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar justify-start md:justify-center">
          {vibez.map(v => (
            <button
              key={v.label}
              onClick={() => setTagFilter(v.label)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 font-black whitespace-nowrap transition-all active:scale-95 ${tagFilter === v.label
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                : 'bg-transparent border-white/10 hover:bg-white/5'
                }`}
            >
              {v.icon}
              <span className="uppercase text-xs tracking-tighter">{v.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Results Grid */}
      <main className="px-6 max-w-7xl mx-auto relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <Loader2 size={64} className="animate-spin text-yellow-400" />
              <CoffeeCupIcon size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse" />
            </div>
            <p className="font-black uppercase tracking-[0.4em] text-white/30 animate-pulse text-xs">Accessing the grid...</p>
          </div>
        ) : cafes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cafes.map(cafe => (
              <div
                key={cafe.id}
                className="group relative bg-[#151515]/50 backdrop-blur-sm border border-white/10 rounded-[2rem] overflow-hidden hover:border-yellow-400/50 transition-all duration-500 shadow-2xl flex flex-col"
              >
                <div className="h-64 overflow-hidden relative shrink-0">
                  <img
                    src={cafe.image || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800'}
                    alt={cafe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-2 font-black text-sm">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    {cafe.rating || 'New'}
                  </div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {cafe.tags?.slice(0, 3).map(t => (
                      <span key={t} className="bg-yellow-400 text-black text-[9px] font-black px-2 py-1 rounded border border-black uppercase tracking-tighter">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-1 truncate group-hover:text-yellow-400 transition-colors">{cafe.name}</h3>
                  <p className="text-white/40 text-[10px] font-black uppercase mb-4 flex items-center gap-1 tracking-widest">
                    <MapPin size={12} className="text-yellow-400" /> {cafe.location}
                  </p>

                  <p className="text-white/60 text-sm font-medium mb-8 line-clamp-2 leading-relaxed flex-1">
                    {cafe.description || "A curated aesthetic experience designed for the modern explorer."}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-black text-white/30 bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 uppercase tracking-tight">
                        <Clock size={14} /> {cafe.timings || "Open Now"}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                        VIBE CHECKED
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedCafe(cafe)}
                        className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-4 rounded-xl border border-white/10 font-black text-[10px] tracking-widest uppercase transition-all"
                      >
                        <MessageSquare size={16} /> REVIEWS
                      </button>
                      <a
                        href={cafe.direction}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(250,204,21,0.1)]"
                      >
                        <Navigation size={16} /> GO
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10 max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6 inline-flex p-6 bg-white/5 rounded-full border border-white/10">
              <CoffeeCupIcon size={48} className="text-white/20" />
            </div>
            <h3 className="text-3xl font-black uppercase mb-3 italic tracking-tighter">Multiverse Empty</h3>
            <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">No spots match this frequency.</p>
            <button
              onClick={() => { setCityFilter('All Cities'); setTagFilter('All Vibez'); setSearchQuery(''); }}
              className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-yellow-400 transition-colors"
            >
              RESET FILTERS
            </button>
          </div>
        )}
      </main>

      {/* Review Modal */}
      {selectedCafe && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in" onClick={() => setSelectedCafe(null)}></div>
          <div className="relative bg-[#0F0F0F] border border-white/20 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h4 className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.4em] mb-2">Vibe Verification</h4>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">{selectedCafe.name}</h3>
                </div>
                <button onClick={() => setSelectedCafe(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all border border-white/10">
                  <X size={24} />
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-8">
                <p className="text-[10px] font-black uppercase mb-4 text-white/40 tracking-widest">Rate the aesthetic</p>
                <div className="flex gap-3 mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="text-yellow-400 transition-all active:scale-125 hover:scale-110"
                    >
                      <Star size={28} className={star <= newRating ? "fill-yellow-400" : "opacity-20"} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-yellow-400/50 mb-4 h-28 placeholder:text-white/10"
                  placeholder="Drop a vibe check (lighting, crowd, menu...)"
                ></textarea>
                <button
                  onClick={() => {
                    submitReview(selectedCafe.id, newRating, newComment);
                    setNewComment('');
                    setNewRating(5);
                    // Don't close modal immediately so user can see their review? 
                    // Or keep it as is. User wanted it to "post review".
                  }}
                  disabled={!newComment.trim()}
                  className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-yellow-400 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Feedback
                </button>
              </div>

              <div className="space-y-4 max-h-48 overflow-y-auto no-scrollbar">
                {selectedCafe.reviews?.length > 0 ? (
                  selectedCafe.reviews.map((review) => (
                    <div key={review.id} className="flex gap-4 items-start border-b border-white/5 pb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-yellow-500 shrink-0 border border-white/20 p-[2px]">
                        <div className="w-full h-full rounded-full bg-black overflow-hidden">
                          <img src={review.user_picture} alt={review.user_name} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black uppercase text-[10px] tracking-wider">{review.user_name}</span>
                          <div className="flex text-yellow-400">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} size={10} className="fill-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-white/60 font-medium leading-relaxed italic">"{review.comment}"</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white/30 italic text-xs text-center py-4">No vibe checks yet. Be the first!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-32 border-t border-white/10 bg-black pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-6">
                <CoffeeCupIcon size={32} className="text-yellow-400" />
                <h2 className="text-6xl font-black italic uppercase tracking-tighter">CAFI<span className="text-yellow-400">ATOR</span></h2>
              </div>
              <p className="text-white/30 font-bold uppercase tracking-[0.2em] text-[10px] leading-loose">
                Tamil Nadu's definitive directory for high-vibe spaces. We map the aesthetics so you can find your frequent.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-20">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em]">Connect</span>
                <ul className="space-y-3 font-black uppercase text-xs tracking-widest text-white/60">
                  <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                  <li><button onClick={() => setIsSubmitOpen(true)} className="hover:text-yellow-400 transition-colors text-left">Submit a Spot</button></li>
                  <li><button onClick={() => setIsAdminOpen(true)} className="hover:text-red-400 transition-colors text-left">Admin Access</button></li>
                </ul>
              </div>
              <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em]">Resources</span>
                <span className="font-black text-xs italic uppercase text-white/60 leading-relaxed">
                  © OpenStreetMap contributors
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">© 2026 CAFIATOR LABS • TN EDITION</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">GRID_STATUS_STABLE</span>
            </div>
          </div>
        </div>
      </footer>
      {/* Footer */}
      {/* ... */}

      <SubmitCafeDialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen} />
      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
};

export default App;