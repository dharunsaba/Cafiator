import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Coffee, Send } from 'lucide-react';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const SubmitCafeDialog = ({ open, onOpenChange }: Props) => {
    const [formData, setFormData] = useState({
        name: '',
        city: 'Chennai',
        location: '',
        description: '',
        tags: '',
        phone: '',
        email: '',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800' // Default
    });
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('idle');
        try {
            const res = await fetch('http://localhost:8001/cafes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setStatus('success');
                setTimeout(() => {
                    onOpenChange(false);
                    setStatus('idle');
                    setFormData({ ...formData, name: '', description: '' });
                }, 2000);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 animate-in fade-in" />
                <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#111] border border-white/20 rounded-3xl p-8 z-50 text-white shadow-2xl animate-in zoom-in-95">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Coffee className="text-yellow-400" />
                            <h2 className="text-xl font-black uppercase tracking-widest">Submit a Spot</h2>
                        </div>
                        <Dialog.Close className="text-white/50 hover:text-white">
                            <X />
                        </Dialog.Close>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center py-10">
                            <div className="text-4xl mb-4">🎉</div>
                            <h3 className="text-2xl font-black text-green-400 mb-2">Submission Received!</h3>
                            <p className="text-white/60">Our curators will verify the vibe shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-white/50">Cafe Name</label>
                                <input
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold focus:outline-none focus:border-yellow-400"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-white/50">City</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold focus:outline-none focus:border-yellow-400"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    >
                                        {['Chennai', 'Coimbatore', 'Madurai', 'Pondicherry', 'Salem'].map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-white/50">Location (Area)</label>
                                    <input
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold focus:outline-none focus:border-yellow-400"
                                        placeholder="e.g. Anna Nagar"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-white/50">Vibe Description</label>
                                <textarea
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold focus:outline-none focus:border-yellow-400 h-24"
                                    placeholder="What's the aesthetic like?"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-white/50">Tags (comma separated)</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold focus:outline-none focus:border-yellow-400"
                                    placeholder="WiFi, Rooftop, Vegan..."
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="w-full bg-yellow-400 text-black py-4 rounded-xl font-black uppercase tracking-widest mt-4 hover:opacity-90 transition-opacity">
                                Submit for Review <Send className="inline ml-2 w-4 h-4" />
                            </button>
                        </form>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default SubmitCafeDialog;
