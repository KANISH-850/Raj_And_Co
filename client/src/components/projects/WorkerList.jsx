import React, { useEffect, useState } from 'react';
import { UserPlus, MoreVertical, HardHat, Phone, Calendar, IndianRupee, Loader2, AlertCircle, X, Check, Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../services/apiClient';
import useApi from '../../hooks/useApi';
import { toast } from 'react-hot-toast';

const WorkerList = ({ projectId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorker, setEditingWorker] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);

    const { execute: fetchWorkers, data: apiResponse, loading, error } = useApi(
        (pid) => apiClient.get(`/workers/${pid}/workers`)
    );

    useEffect(() => {
        if (projectId) fetchWorkers(projectId);
    }, [projectId]);

    const workers = apiResponse?.data || [];

    const handleSaveWorker = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.projectId = projectId;
        data.dailyWage = parseFloat(data.dailyWage);

        const tid = toast.loading(editingWorker ? 'Updating profile...' : 'Allocating resource...');
        try {
            if (editingWorker) {
                await apiClient.put(`/workers/${editingWorker.id}`, data);
                toast.success('Profile updated.', { id: tid });
            } else {
                await apiClient.post(`/workers/${projectId}/workers`, data);
                toast.success('Worker allocated.', { id: tid });
            }
            setIsModalOpen(false);
            setEditingWorker(null);
            fetchWorkers(projectId);
        } catch {
            toast.error('Mission failed.', { id: tid });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove worker from site?')) return;
        const tid = toast.loading('Removing...');
        try {
            await apiClient.delete(`/workers/${id}`);
            toast.success('Personnel removed.', { id: tid });
            fetchWorkers(projectId);
        } catch { toast.error('Removal failed.'); }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-2xl font-black text-secondary-900 tracking-tighter uppercase italic">Site Workforce</h2>
                   <p className="text-secondary-500 font-medium">Managing core field resources.</p>
                </div>
                <button 
                    onClick={() => { setEditingWorker(null); setIsModalOpen(true); }}
                    className="px-8 py-4 bg-secondary-900 text-white rounded-2xl flex items-center gap-2 hover:bg-secondary-800 transition-all font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 group"
                >
                    <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
                    Allocate Resource
                </button>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg relative shadow-2xl">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black">{editingWorker ? 'Update Personnel' : 'New Resource Allocation'}</h3>
                                <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-secondary-400" /></button>
                            </div>
                            <form onSubmit={handleSaveWorker} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Full Name</label>
                                    <input name="name" required defaultValue={editingWorker?.name} className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Designation</label>
                                        <input name="role" required defaultValue={editingWorker?.role} className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Daily Wage (₹)</label>
                                        <input name="dailyWage" type="number" required defaultValue={editingWorker?.dailyWage} className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Contact Details</label>
                                    <input name="contact" defaultValue={editingWorker?.contact} className="w-full px-6 py-4 bg-secondary-50 border-none rounded-xl font-bold outline-none" placeholder="+91 XXXX" />
                                </div>
                                <button type="submit" className="w-full bg-secondary-900 text-white py-5 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl">
                                    <Check size={18} className="inline mr-2" /> {editingWorker ? 'Commit Changes' : 'Confirm Allocation'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="table-container bg-white/60 backdrop-blur-md shadow-3xl overflow-hidden rounded-[2.5rem] border border-white">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-secondary-900">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-400">Personnel</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-400">Assignment</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-400">Day Rate</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-400">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100">
                        {loading ? (
                            <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary-500" /></td></tr>
                        ) : workers.map((worker) => (
                            <tr key={worker.id} className="hover:bg-primary-50/20 transition-all group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center text-secondary-900 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm"><HardHat size={18} /></div>
                                        <p className="font-black text-secondary-900">{worker.name}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-5"><span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{worker.role || 'Personnel'}</span></td>
                                <td className="px-6 py-5 font-black text-secondary-900">₹{worker.dailyWage}</td>
                                <td className="px-6 py-5"><span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Active</span></td>
                                <td className="px-8 py-5 text-right relative">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingWorker(worker); setIsModalOpen(true); }} className="p-3 bg-white border border-secondary-100 text-secondary-400 hover:text-primary-600 rounded-2xl shadow-sm"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(worker.id)} className="p-3 bg-white border border-secondary-100 text-secondary-400 hover:text-red-600 rounded-2xl shadow-sm"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default WorkerList;
