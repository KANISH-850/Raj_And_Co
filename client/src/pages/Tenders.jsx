import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, PlusCircle, Search, Filter, Calendar, IndianRupee, MapPin, Loader2, AlertCircle, X, Check, ArrowRight } from 'lucide-react';
import TenderCard from '../components/tenders/TenderCard';
import apiClient from '../services/apiClient';
import useApi from '../hooks/useApi';
import { toast } from 'react-hot-toast';

const Tenders = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');
    const [optimisticTenders, setOptimisticTenders] = useState([]);

    const { execute: fetchTenders, data: apiResponse, loading, error } = useApi(
        () => apiClient.get('/tenders')
    );

    useEffect(() => {
        fetchTenders();
    }, []);

    useEffect(() => {
        if (apiResponse?.data) {
            setOptimisticTenders(apiResponse.data);
        }
    }, [apiResponse]);

    const handleAddTender = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.tenderValue = parseFloat(data.tenderValue);

        const tempId = `temp-${Date.now()}`;
        const optimisticEntry = { ...data, id: tempId, status: 'submitted', isOptimistic: true };
        
        setOptimisticTenders([optimisticEntry, ...optimisticTenders]);
        setIsModalOpen(false);
        const toastId = toast.loading('Submitting bid to govt portals...');

        try {
            await apiClient.post('/tenders', data);
            toast.success('Tender registered and tracked!', { id: toastId });
            fetchTenders();
        } catch (err) {
            const msg = err.response?.data?.error || 'Portal handshake failed.';
            toast.error(msg, { id: toastId });
            setOptimisticTenders(optimisticTenders);
        }
    };

    const filteredTenders = useMemo(() => {
        return optimisticTenders.filter(t => {
            const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 t.tenderNo?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || t.status?.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        });
    }, [optimisticTenders, searchTerm, statusFilter]);

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h1 className="text-4xl font-black text-secondary-900 tracking-tighter">Tender Registry</h1>
                   <p className="text-secondary-500 font-medium">Monitoring government and private bid pipelines.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary-600/20 active:scale-95 transition-all flex items-center gap-2 group"
                >
                    <PlusCircle size={22} className="group-hover:rotate-90 transition-transform" />
                    <span>Register New Bid</span>
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
                                    <h2 className="text-3xl font-black text-secondary-900 tracking-tighter">Bid Entry</h2>
                                    <p className="text-secondary-500 text-sm">Fill in the formal tender details.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-secondary-50 hover:bg-secondary-100 rounded-2xl transition-all">
                                     <X size={20} className="text-secondary-500" />
                                </button>
                            </div>

                            <form onSubmit={handleAddTender} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Tender Title</label>
                                    <input name="title" required className="w-full px-6 py-5 bg-secondary-50 border-none rounded-2xl font-bold transition-all outline-none" placeholder="e.g. Smart City Drainage Phase II" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Bid Value (₹)</label>
                                        <input name="tenderValue" required type="number" className="w-full px-6 py-5 bg-secondary-50 border-none rounded-2xl font-bold outline-none" placeholder="5000000" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Authority</label>
                                        <input name="authority" className="w-full px-6 py-5 bg-secondary-50 border-none rounded-2xl font-bold outline-none" placeholder="PWD / KMC" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-secondary-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-secondary-800 transition-all flex items-center justify-center gap-2">
                                    <Check size={24} /> Register Bid
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
                        placeholder="Filter by title or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white border border-secondary-200 rounded-[2rem] focus:ring-2 focus:ring-primary-500/20 transition-all outline-none shadow-sm font-medium"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none px-2">
                    {['All', 'Submitted', 'Approved', 'Rejected'].map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => setStatusFilter(tab)}
                            className={`px-8 py-5 border transition-all rounded-[1.5rem] font-black text-sm uppercase tracking-widest whitespace-nowrap
                                ${statusFilter === tab 
                                    ? 'bg-secondary-900 border-secondary-900 text-white shadow-xl shadow-secondary-900/20' 
                                    : 'bg-white border-secondary-200 text-secondary-500 hover:bg-secondary-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {loading && optimisticTenders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
                        <p className="text-secondary-400 font-black italic uppercase tracking-widest text-xs">Accessing Bid Repository...</p>
                    </div>
                ) : error ? (
                    <div className="p-16 glass rounded-[3rem] border border-red-500/10 flex flex-col items-center gap-6 text-center">
                        <AlertCircle size={40} className="text-red-500" />
                        <h3 className="text-2xl font-black text-secondary-900">Bid Sync Interrupted</h3>
                        <button onClick={() => fetchTenders()} className="bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg">Retry Fetch</button>
                    </div>
                ) : filteredTenders.length === 0 ? (
                    <div className="py-20 text-center opacity-40">
                         <FileText size={64} className="mx-auto mb-4" />
                         <p className="text-xl font-bold">Zero active bid matches</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {filteredTenders.map((tender, i) => (
                            <TenderCard key={tender.id} tender={tender} delay={i * 0.05} />
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tenders;
