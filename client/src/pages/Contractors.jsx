import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardHat, PlusCircle, Search, Filter, Star, Briefcase, Phone, MapPin, Share2, Loader2, AlertCircle, X, Check, Globe, Edit2, Trash2 } from 'lucide-react';
import apiClient from '../services/apiClient';
import useApi from '../hooks/useApi';
import { toast } from 'react-hot-toast';

const Contractors = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContractor, setEditingContractor] = useState(null);

    const { execute: fetchContractors, data: apiResponse, loading, error } = useApi(
        () => apiClient.get('/contractors')
    );

    useEffect(() => {
        fetchContractors();
    }, []);

    const contractors = apiResponse?.data || [];

    const handleSaveContractor = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        data.rating = parseInt(data.rating || 0);

        const tid = toast.loading('Syncing contractor profile...');
        try {
            if (editingContractor) {
                await apiClient.put(`/contractors/${editingContractor.id}`, data);
                toast.success('Profile Adjusted.', { id: tid });
            } else {
                await apiClient.post('/contractors', data);
                toast.success('Elite Provider Onboarded.', { id: tid });
            }
            setIsModalOpen(false);
            setEditingContractor(null);
            fetchContractors();
        } catch { toast.error('Handshake Error.', { id: tid }); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Purge this provider from network?')) return;
        const tid = toast.loading('Purging resource...');
        try {
            await apiClient.delete(`/contractors/${id}`);
            toast.success('Provider Purged.', { id: tid });
            fetchContractors();
        } catch { toast.error('Purge Failed.'); }
    };

    const filteredContractors = useMemo(() => {
        return contractors.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            c.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [contractors, searchTerm]);

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h1 className="text-4xl font-black text-secondary-900 tracking-tighter">Contractor Network</h1>
                   <p className="text-secondary-500 font-medium">Accessing elite 3rd party providers across India.</p>
                </div>
                <button 
                    onClick={() => { setEditingContractor(null); setIsModalOpen(true); }}
                    className="px-8 py-4 bg-secondary-900 text-white rounded-2xl flex items-center gap-2 hover:bg-secondary-800 transition-all font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 group"
                >
                    <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" />
                    Onboard Provider
                </button>
            </header>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg relative shadow-2xl">
                             <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black">{editingContractor ? 'Adjust Profile' : 'New Provider Protocol'}</h3>
                                <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-secondary-400" /></button>
                            </div>
                            <form onSubmit={handleSaveContractor} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Company / Representative</label>
                                    <input name="name" required defaultValue={editingContractor?.name} className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none" placeholder="e.g. Skyline Civil Experts" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Specialization</label>
                                        <select name="specialty" defaultValue={editingContractor?.specialty} className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none">
                                            <option value="Civil">Civil Works</option>
                                            <option value="Electrical">Electrical</option>
                                            <option value="Plumbing">Plumbing</option>
                                            <option value="Interior">Interior / Fit-out</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Rating (1-5)</label>
                                        <input name="rating" type="number" min="1" max="5" defaultValue={editingContractor?.rating || 5} className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Contact Protocol</label>
                                    <input name="contact" required defaultValue={editingContractor?.contact} className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none" placeholder="+91 9xxxx xxxxx" />
                                </div>
                                <button type="submit" className="w-full bg-secondary-900 text-white py-5 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl">
                                    <Check size={18} className="inline mr-2" /> Confirm Protocol
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder="Search contractors by specialty or name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white border border-secondary-200 rounded-[2rem] focus:ring-2 focus:ring-primary-500/20 transition-all outline-none shadow-sm font-black text-xs uppercase tracking-widest"
                />
            </div>

            {loading ? (
                <div className="flex flex-col items-center py-40 gap-4">
                    <Loader2 className="animate-spin text-primary-500 w-12 h-12" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400">Querying Network...</p>
                </div>
            ) : filteredContractors.length === 0 ? (
                <div className="py-20 text-center grayscale opacity-30 flex flex-col items-center gap-6">
                    <HardHat size={80} />
                    <p className="text-2xl font-black tracking-tighter">RESOURCE NULL</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredContractors.map((cont) => (
                        <motion.div
                            key={cont.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/60 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-white relative group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-16 h-16 bg-secondary-900 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:bg-primary-600 transition-colors">
                                    <HardHat size={32} />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingContractor(cont); setIsModalOpen(true); }} className="p-2.5 bg-white border border-secondary-100 text-secondary-400 hover:text-primary-600 rounded-xl shadow-sm"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(cont.id)} className="p-2.5 bg-white border border-secondary-100 text-secondary-400 hover:text-red-600 rounded-xl shadow-sm"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-black text-secondary-900 tracking-tight">{cont.name}</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        {[...Array(5)].map((_, idx) => (
                                            <Star key={idx} size={12} className={idx < (cont.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-secondary-100'} />
                                        ))}
                                        <span className="text-[10px] text-secondary-400 font-black ml-1">{cont.rating || 0}.0</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 py-4 border-y border-secondary-50">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-secondary-400 tracking-widest">
                                        <Globe size={14} /> {cont.specialty}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-secondary-600">
                                        <Phone size={14} /> {cont.contact}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                         <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20"></div>
                                         <span className="text-[10px] uppercase font-black text-secondary-400 tracking-widest">Available</span>
                                    </div>
                                    <button onClick={() => toast.success('Partnership request transmitted.')} className="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-600/10 hover:bg-primary-700 transition-all active:scale-95">Request Terms</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Contractors;
