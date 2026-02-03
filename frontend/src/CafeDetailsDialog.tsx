import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Avatar from '@radix-ui/react-avatar';
import { X, MapPin, Clock, Star, Share2, Send, Heart, User } from 'lucide-react';

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

interface Props {
    cafe: Cafe | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddReview: (cafeId: number, review: { rating: number; comment: string; image_url: string; user_email: string; user_name: string; user_picture: string }) => Promise<void>;
}

const CafeDetailsDialog = ({ cafe, open, onOpenChange, onAddReview }: Props) => {
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [user, setUser] = useState<{ name: string, email: string, picture: string } | null>(null);

    // Simple Mock Login Trigger
    const handleLogin = () => {
        // In a real app, this would trigger Google Auth
        const mockUser = {
            name: "Guest User",
            email: "guest@example.com",
            picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"
        };
        setUser(mockUser);
    };

    const handleSubmitReview = async () => {
        if (!cafe || !user) return;
        await onAddReview(cafe.id, {
            rating: newRating,
            comment: newComment,
            image_url: "", // Hook up image upload if needed
            user_email: user.email,
            user_name: user.name,
            user_picture: user.picture
        });
        setNewComment('');
    };

    if (!cafe) return null;

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in" />
                <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] bg-[#FDFCF0] rounded-3xl border-4 border-black shadow-[16px_16px_0px_rgba(0,0,0,1)] z-50 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                    {/* Header Image */}
                    <div className="relative h-64 shrink-0">
                        <img src={cafe.image} alt={cafe.name} className="w-full h-full object-cover" />
                        <Dialog.Close className="absolute top-4 right-4 bg-white/90 p-2 rounded-full border-2 border-black hover:bg-black hover:text-white transition-all">
                            <X size={20} className="font-bold" />
                        </Dialog.Close>
                        <div className="absolute bottom-[-2px] left-0 w-full h-12 bg-gradient-to-t from-[#FDFCF0] to-transparent"></div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8">
                        {/* Title & Actions */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">{cafe.name}</h2>
                                <div className="flex items-center gap-2 text-slate-500 font-bold">
                                    <MapPin size={18} />
                                    <span>{cafe.location}, {cafe.city}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-white border-2 border-black rounded-xl hover:bg-slate-50 transition-all active:translate-y-0.5">
                                    <Share2 size={20} />
                                </button>
                                <button className="p-3 bg-pink-100 border-2 border-black rounded-xl text-pink-600 hover:bg-pink-200 transition-all active:translate-y-0.5">
                                    <Heart size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="p-4 bg-white border-2 border-black rounded-2xl flex flex-col items-center justify-center text-center">
                                <div className="text-4xl font-black mb-1 flex items-center gap-1">
                                    {cafe.rating.toFixed(1)} <Star size={24} className="fill-yellow-400 text-yellow-400" />
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rating</span>
                            </div>
                            <div className="p-4 bg-white border-2 border-black rounded-2xl flex flex-col items-center justify-center text-center">
                                <Clock size={32} className="text-blue-500 mb-2" />
                                <span className="font-bold text-sm">{cafe.timings || "Open Today"}</span>
                            </div>
                            <a
                                href={cafe.direction}
                                target="_blank"
                                rel="noreferrer"
                                className="p-4 bg-yellow-400 border-2 border-black rounded-2xl flex flex-col items-center justify-center text-center hover:bg-yellow-300 transition-all active:translate-y-1"
                            >
                                <MapPin size={32} className="text-black mb-2" />
                                <span className="font-black text-sm uppercase">Get Directions</span>
                            </a>
                        </div>

                        {/* Description & Tags */}
                        <div className="mb-8">
                            <p className="text-lg font-medium text-slate-700 leading-relaxed mb-4">
                                {cafe.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {cafe.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-black text-white text-xs font-bold uppercase rounded-lg">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <hr className="border-t-2 border-black/10 my-8" />

                        {/* Reviews Section */}
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                                Reviews <span className="text-slate-400 text-lg">({cafe.reviews?.length || 0})</span>
                            </h3>

                            {!user ? (
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-center mb-8">
                                    <p className="font-bold text-blue-800 mb-4">Log in to leave a review and share your photos!</p>
                                    <button
                                        onClick={handleLogin}
                                        className="bg-black text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider hover:scale-105 transition-transform"
                                    >
                                        Login with Google
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white border-2 border-black rounded-2xl p-6 mb-8 shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Avatar.Root className="w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-gray-200">
                                            <Avatar.Image src={user.picture} className="w-full h-full object-cover" />
                                            <Avatar.Fallback className="w-full h-full flex items-center justify-center font-bold">U</Avatar.Fallback>
                                        </Avatar.Root>
                                        <div>
                                            <div className="font-bold">{user.name}</div>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button key={star} onClick={() => setNewRating(star)}>
                                                        <Star size={14} className={star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Share your experience..."
                                        className="w-full h-24 p-3 bg-slate-50 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-black transition-colors resize-none mb-3"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleSubmitReview}
                                            disabled={!newComment}
                                            className="bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 hover:bg-gray-800 transition-colors"
                                        >
                                            Post Review <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {cafe.reviews?.map(review => (
                                    <div key={review.id} className="bg-white p-6 rounded-2xl border-2 border-black/5 flex gap-4">
                                        <Avatar.Root className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden shrink-0 bg-gray-100">
                                            <Avatar.Image src={review.user_picture} className="w-full h-full object-cover" />
                                            <Avatar.Fallback className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">U</Avatar.Fallback>
                                        </Avatar.Root>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm">{review.user_name}</span>
                                                <div className="flex">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-slate-700 text-sm leading-relaxed">{review.comment}</p>
                                        </div>
                                    </div>
                                )) || <p className="text-slate-400 italic">No reviews yet. Be the first!</p>}
                            </div>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default CafeDetailsDialog;
