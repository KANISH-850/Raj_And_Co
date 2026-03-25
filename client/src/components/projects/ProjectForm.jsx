import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, FolderPlus, MapPin, Calendar, IndianRupee } from 'lucide-react';

const ProjectForm = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        startDate: '',
        endDate: '',
        budget: '',
        status: 'ongoing'
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-secondary-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="w-full max-w-2xl bg-white p-10 rounded-[3rem] shadow-2xl relative"
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                             <FolderPlus size={24} />
                         </div>
                         <div>
                            <h2 className="text-2xl font-black text-secondary-900 tracking-tight">New Project Registration</h2>
                            <p className="text-sm text-secondary-500 font-medium">Initialize a new construction site in the system.</p>
                         </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-secondary-50 rounded-2xl hover:bg-secondary-100 transition-all text-secondary-400 group"
                    >
                        <X size={20} className="group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-secondary-400 tracking-widest pl-1">Project Name</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="e.g. NH-44 Highway Overpass"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-secondary-50 border border-secondary-200 text-secondary-900 px-4 py-4 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-secondary-400 tracking-widest pl-1">Location / Site Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Enter city or district"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    className="w-full pl-12 pr-4 bg-secondary-50 border border-secondary-200 text-secondary-900 py-4 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-secondary-400 tracking-widest pl-1">Initial Budget</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Total estimation in ₹"
                                    required
                                    value={formData.budget}
                                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                                    className="w-full pl-12 pr-4 bg-secondary-50 border border-secondary-200 text-secondary-900 py-4 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-secondary-400 tracking-widest pl-1">Target Start Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                                <input 
                                    type="date" 
                                    required
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    className="w-full pl-12 pr-4 bg-secondary-50 border border-secondary-200 text-secondary-900 py-4 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-secondary-400 tracking-widest pl-1">Planned End Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                                <input 
                                    type="date" 
                                    required
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    className="w-full pl-12 pr-4 bg-secondary-50 border border-secondary-200 text-secondary-900 py-4 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-secondary-50 hover:bg-secondary-100 text-secondary-600 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border border-secondary-100"
                        >
                            Cancel Request
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary-600/20 flex items-center justify-center gap-2 group"
                        >
                            <Save size={18} className="group-hover:translate-x-1 transition-transform" />
                            Synchronize Project
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ProjectForm;
