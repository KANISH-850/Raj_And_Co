import React, { useEffect, useState } from 'react';
import { UserPlus, MoreVertical, HardHat, Phone, Calendar, IndianRupee, Loader2, AlertCircle, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../services/apiClient';
import useApi from '../../hooks/useApi';
import { toast } from 'react-hot-toast';

const WorkerList = ({ projectId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [optimisticWorkers, setOptimisticWorkers] = useState([]);

    const { execute: fetchWorkers, data: apiResponse, loading, error } = useApi(
        (pid) => apiClient.get(`/workers/${pid}/workers`)
    );

    useEffect(() => {
        if (projectId) fetchWorkers(projectId);
    }, [projectId]);

    useEffect(() => {
        if (apiResponse?.data) {
            setOptimisticWorkers(apiResponse.data);
        }
    }, [apiResponse]);

    const handleAddWorker = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.projectId = projectId;
        data.dailyWage = parseFloat(data.dailyWage);

        const tempId = `temp-${Date.now()}`;
        const optimisticEntry = { ...data, id: tempId, isOptimistic: true, joinedDate: new Date() };
        
        setOptimisticWorkers([optimisticEntry, ...optimisticWorkers]);
        setIsModalOpen(false);
        const toastId = toast.loading('Allocating personnel to site...');

        try {
            await apiClient.post(`/workers/${projectId}/workers`, data);
            toast.success('Worker assigned and payroll tracked!', { id: toastId });
            fetchWorkers(projectId);
        } catch (err) {
            toast.error('Assignment failed. Retry.', { id: toastId });
            setOptimisticWorkers(optimisticWorkers);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-2xl font-black text-secondary-900 tracking-tighter">Site Workforce</h2>
                   <p className="text-secondary-500 font-medium">Currently management of <span className="text-primary-600 font-black">{optimisticWorkers.length} resources</span>.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-4 bg-secondary-900 text-white rounded-2xl flex items-center gap-2 hover:bg-secondary-800 transition-all font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-secondary-900/10 active:scale-95 group"
                >
                    <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
                    Allocate Resource
                </button>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg relative shadow-2xl border border-secondary-100">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-secondary-900 tracking-tighter">Resource Allocation</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary-50 rounded-xl transition-all"><X size={20} className="text-secondary-400" /></button>
                            </div>
                            <form onSubmit={handleAddWorker} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Worker Full Name</label>
                                    <input name="name" required className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none" placeholder="e.g. Ramesh Kumar" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Designation</label>
                                        <input name="role" required className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none" placeholder="Supervisor / Labour" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Daily Wage (₹)</label>
                                        <input name="dailyWage" required type="number" className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none" placeholder="700" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-secondary-900 text-white py-5 rounded-xl font-black text-lg hover:bg-secondary-800 transition-all flex items-center justify-center gap-2">
                                    <Check size={24} /> Confirm Allocation
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="table-container bg-white/60 backdrop-blur-sm shadow-xl border border-white overflow-hidden rounded-[2rem]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-secondary-50">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-400">Resource</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-400">Role</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-400">Daily Wage</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-400">Contact</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100">
                        {loading && optimisticWorkers.length === 0 ? (
                            <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" /></td></tr>
                        ) : error ? (
                            <tr><td colSpan="5" className="py-20 text-center text-red-500 font-bold">{error}</td></tr>
                        ) : optimisticWorkers.map((worker) => (
                            <tr key={worker.id} className={`hover:bg-primary-50/30 transition-all group ${worker.isOptimistic ? 'opacity-50 animate-pulse' : ''}`}>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center text-secondary-400 group-hover:bg-secondary-900 group-hover:text-white transition-all">
                                            {worker.isOptimistic ? <Loader2 size={18} className="animate-spin" /> : <HardHat size={18} />}
                                        </div>
                                        <p className="font-black text-secondary-900">{worker.name}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-5"><span className="px-3 py-1 bg-secondary-100 rounded-lg text-xs font-black uppercase tracking-widest text-secondary-500">{worker.role}</span></td>
                                <td className="px-6 py-5 font-black text-secondary-700">₹{worker.dailyWage}</td>
                                <td className="px-6 py-5 font-bold text-secondary-500">{worker.contact || 'No Contact'}</td>
                                <td className="px-8 py-5 text-right"><button className="p-2 hover:bg-white rounded-lg transition-all text-secondary-300 hover:text-secondary-900"><MoreVertical size={18} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default WorkerList;
