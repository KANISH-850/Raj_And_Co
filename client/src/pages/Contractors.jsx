import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardHat, PlusCircle, Search, Filter, Star, Briefcase, Phone, MapPin, Share2, Loader2, AlertCircle, X, Check, Globe } from 'lucide-react';
import apiClient from '../services/apiClient';
import useApi from '../hooks/useApi';
import { toast } from 'react-hot-toast';

const Contractors = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [optimisticContractors, setOptimisticContractors] = useState([]);

    const { execute: fetchContractors, data: apiResponse, loading, error } = useApi(
        () => apiClient.get('/contractors')
    );

    useEffect(() => {
        fetchContractors();
    }, []);

    useEffect(() => {
        if (apiResponse?.data) {
            setOptimisticContractors(apiResponse.data);
        }
    }, [apiResponse]);

    const handleAddContractor = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.rating = 0;
        data.available = true;

        const tempId = `temp-${Date.now()}`;
        const optimisticEntry = { ...data, id: tempId, isOptimistic: true };
        
        setOptimisticContractors([optimisticEntry, ...optimisticContractors]);
        setIsModalOpen(false);
        const toastId = toast.loading('Onboarding expert contractor...');

        try {
            await apiClient.post('/contractors', data);
            toast.success('Contractor added to elite database!', { id: toastId });
            fetchContractors();
        } catch (err) {
            const msg = err.response?.data?.error || 'Onboarding failed. Check parameters.';
            toast.error(msg, { id: toastId });
            setOptimisticContractors(optimisticContractors);
        }
    };

    const filteredContractors = useMemo(() => {
        return optimisticContractors.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            c.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [optimisticContractors, searchTerm]);

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h1 className="text-4xl font-black text-secondary-900 tracking-tighter">Contractor Network</h1>
                   <p className="text-secondary-500 font-medium mt-1">Accessing elite 3rd party providers across India.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary-600/20 active:scale-95 transition-all flex items-center gap-2 group"
                >
                    <PlusCircle size={22} className="group-hover:rotate-90 transition-transform" />
                    <span>Onboard Contractor</span>
                </button>
            </header>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-secondary-900/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="bg-white rounded-[3rem] p-10 w-full max-w-xl relative shadow-2xl border border-secondary-100"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-secondary-900 tracking-tighter">Registration</h2>
                                    <p className="text-secondary-500 text-sm">Onboarding new service provider.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-secondary-50 hover:bg-secondary-100 rounded-2xl transition-all">
                                     <X size={20} className="text-secondary-500" />
                                </button>
                            </div>

                            <form onSubmit={handleAddContractor} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Company / Provider Name</label>
                                    <input name="name" required className="w-full px-6 py-5 bg-secondary-50 border-none rounded-2xl font-bold outline-none" placeholder="e.g. Skyline Civil Experts" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Specialization</label>
                                        <select name="specialty" className="w-full px-6 py-5 bg-secondary-50 border-none rounded-2xl font-bold outline-none">
                                            <option value="civil">Civil Engineering</option>
                                            <option value="electrical">Electrical Systems</option>
                                            <option value="plumbing">Plumbing & HVAC</option>
                                            <option value="automation">Smart Automation</option>
                                            <option value="misc">Miscellaneous</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Primary Contact</label>
                                        <input name="contact" required className="w-full px-6 py-5 bg-secondary-50 border-none rounded-2xl font-bold outline-none" placeholder="+91 98XXX-XXXXX" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-secondary-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-secondary-800 transition-all flex items-center justify-center gap-2">
                                    <Check size={24} /> Confirm Onboarding
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search contractors by specialty or name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white border border-secondary-200 rounded-[2rem] focus:ring-2 focus:ring-primary-500/20 transition-all outline-none shadow-sm font-bold"
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {loading && optimisticContractors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="relative">
                            <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
                            <div className="absolute inset-0 w-16 h-16 border-4 border-primary-500/10 rounded-full"></div>
                        </div>
                        <p className="text-secondary-400 font-black italic uppercase tracking-widest text-xs">Querying Global Network...</p>
                    </div>
                ) : error ? (
                    <div className="p-16 glass rounded-[3rem] border border-red-500/10 flex flex-col items-center gap-6 text-center">
                        <AlertCircle size={40} className="text-red-500" />
                        <h3 className="text-2xl font-black text-secondary-900">Network Disruption</h3>
                        <button onClick={() => fetchContractors()} className="bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg">Retry Handshake</button>
                    </div>
                ) : filteredContractors.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center gap-6 opacity-30 grayscale">
                        <HardHat size={80} className="text-secondary-300" />
                        <p className="text-2xl font-black tracking-tighter uppercase">Resource Not Found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredContractors.map((cont, i) => (
                            <motion.div
                                key={cont.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: cont.isOptimistic ? 0.6 : 1, scale: 1 }}
                                transition={{ delay: i * 0.05, duration: 0.5 }}
                                whileHover={cont.isOptimistic ? {} : { y: -8 }}
                                className={`glass p-8 rounded-[3rem] shadow-xl hover:shadow-2xl hover:bg-white/90 transition-all cursor-pointer relative group flex flex-col gap-6 ${cont.isOptimistic ? 'animate-pulse' : ''}`}
                            >
                                {cont.isOptimistic && (
                                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-[3rem] z-20 flex items-center justify-center">
                                        <div className="bg-secondary-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <Loader2 size={12} className="animate-spin" />
                                            Onboarding...
                                        </div>
                                    </div>
                                )}
                                <div className="absolute top-6 right-8 text-secondary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Share2 size={20} />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-secondary-900 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-500 group-hover:bg-primary-600">
                                             <HardHat size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-black text-secondary-900 leading-tight">{cont.name}</h3>
                                            <div className="flex items-center gap-1 mt-1">
                                                {[...Array(5)].map((_, idx) => (
                                                    <Star key={idx} size={12} className={idx < (cont.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-secondary-200'} />
                                                ))}
                                                <span className="text-[10px] text-secondary-500 font-black tracking-widest ml-1">{cont.rating || 0}/5</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 py-4 border-y border-secondary-100">
                                        <div className="flex items-center gap-3 text-sm text-secondary-600 font-black">
                                            <Globe size={14} className="text-secondary-400" />
                                            <span className="uppercase tracking-widest text-[10px]">{cont.specialty || 'Generalist'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-secondary-600 font-bold">
                                            <Phone size={14} className="text-secondary-400" />
                                            {cont.contact || '+91-ADMIN-001'}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2">
                                             <div className={`w-3 h-3 rounded-full ${cont.available !== false ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                             <span className="text-[10px] uppercase font-black text-secondary-400 tracking-widest">{cont.available !== false ? 'Active' : 'Busy'}</span>
                                        </div>
                                        <button className="bg-primary-600 text-white py-2 px-6 rounded-xl text-[10px] uppercase font-black tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-95">
                                            Request Partnership
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Contractors;
