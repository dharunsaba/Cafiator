import React, { useState, useEffect } from 'react';
import { X, Check, Coffee, Lock } from 'lucide-react';

interface Cafe {
    id: number;
    name: string;
    city: string;
    description: string;
    tags: string[];
    is_verified: number;
}

const AdminDashboard = ({ onClose }: { onClose: () => void }) => {
    const [pendingCafes, setPendingCafes] = useState<Cafe[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    const fetchPending = async () => {
        try {
            const res = await fetch('http://localhost:8001/admin/pending');
            const data = await res.json();
            setPendingCafes(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchPending();
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple mock password
        if (password === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert("Invalid Access Code");
        }
    };

    const approveCafe = async (id: number) => {
        await fetch(`http://localhost:8001/admin/approve/${id}`, { method: 'POST' });
        fetchPending(); // Refresh
    };

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 z-[2000] bg-black flex items-center justify-center p-4">
                <div className="w-full max-w-sm text-center">
                    <div className="mb-6 inline-flex p-4 bg-white/5 rounded-full border border-white/10">
                        <Lock size={32} className="text-yellow-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-6">Restricted Access</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-center text-white font-bold tracking-[0.5em] focus:outline-none focus:border-yellow-400 mb-4 placeholder:tracking-normal placeholder:text-white/30"
                            placeholder="ENTER CODE"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <button type="button" onClick={onClose} className="flex-1 py-3 text-white/50 font-bold uppercase text-xs hover:text-white">Cancel</button>
                            <button type="submit" className="flex-1 bg-yellow-400 text-black rounded-xl font-black uppercase tracking-widest py-3">Unlock</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[2000] bg-[#0A0A0A] overflow-y-auto">
            <header className="border-b border-white/10 p-6 flex justify-between items-center sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="bg-yellow-400 p-2 rounded-lg">
                        <Coffee size={20} className="text-black" />
                    </div>
                    <h1 className="text-xl font-black text-white uppercase tracking-widest">Command Center</h1>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            try {
                                const res = await fetch('http://localhost:8001/admin/sync', { method: 'POST' });
                                const data = await res.json();
                                alert(`Sync Complete! Updated ${data.updated} cafes.`);
                            } catch (e) {
                                alert("Sync Failed");
                            }
                        }}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 text-xs font-black uppercase px-4 border border-blue-500/50"
                    >
                        Sync Live Data
                    </button>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white">
                        <X />
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-8">
                <h2 className="text-white/50 font-bold uppercase tracking-widest mb-8 text-sm">
                    Pending Approvals ({pendingCafes.length})
                </h2>

                <div className="space-y-4">
                    {pendingCafes.length === 0 ? (
                        <div className="text-center py-20 text-white/30 italic">All systems clear. No pending submissions.</div>
                    ) : (
                        pendingCafes.map(cafe => (
                            <div key={cafe.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{cafe.name}</h3>
                                    <div className="flex gap-2 mb-3">
                                        <span className="bg-white/10 text-white/70 px-2 py-1 rounded text-[10px] font-bold uppercase">{cafe.city}</span>
                                        {cafe.tags.map(t => <span key={t} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-[10px] font-bold uppercase">#{t}</span>)}
                                    </div>
                                    <p className="text-white/60 text-sm leading-relaxed">{cafe.description}</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => approveCafe(cafe.id)}
                                        className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2"
                                    >
                                        <Check size={16} /> Approve
                                    </button>
                                    <button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-3 rounded-xl font-black uppercase tracking-widest text-xs">
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
