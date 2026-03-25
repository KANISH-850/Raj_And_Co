import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HardHat, PlusCircle, Search, Filter, Star, Briefcase, Phone, MapPin, Share2 } from 'lucide-react';

const Contractors = () => {
    const [search, setSearch] = useState('');

    const contractors = [
        { id: 1, name: 'Siva Electricals & Projects', specialization: 'Electrical', rating: 4.8, projects: 45, contact: '9845012345', location: 'Bengaluru, KA', available: true },
        { id: 2, name: 'Vibrant Civil Works', specialization: 'Civil', rating: 4.2, projects: 22, contact: '8877665544', location: 'Mysuru, KA', available: true },
        { id: 3, name: 'Eco-Friendly Plumbing', specialization: 'Plumbing', rating: 4.5, projects: 18, contact: '7766554433', location: 'Hubballi, KA', available: false },
        { id: 4, name: 'Smart Security & Automation', specialization: 'Automation', rating: 4.9, projects: 30, contact: '9988776655', location: 'Bengaluru, KA', available: true },
    ];

    return (
        <div className="space-y-8 pb-20">
            <header className="flex items-center justify-between">
                <div>
                   <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Contractor Database</h1>
                   <p className="text-secondary-500">Find and manage third-party contractors and service providers.</p>
                </div>
                <button className="btn-primary flex items-center gap-2 group">
                    <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />
                    New Contractor
                </button>
            </header>

            <div className="flex gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by specialization or name..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-secondary-200 rounded-2xl text-secondary-600 font-bold shadow-sm hover:bg-secondary-50 transition-all group">
                    <Filter size={18} className="text-secondary-400 group-hover:text-primary-600 transition-colors" />
                    Specialization
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {contractors.map((cont, i) => (
                    <motion.div
                        key={cont.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        whileHover={{ y: -8 }}
                        className="glass p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:bg-white/90 transition-all cursor-pointer relative group flex flex-col gap-6"
                    >
                         <div className="absolute top-6 right-8 text-secondary-400 opacity-60 group-hover:opacity-100 transition-opacity flex gap-2">
                             <button className="p-2 bg-secondary-50 rounded-lg hover:text-primary-600 hover:bg-primary-50 transition-all border border-transparent hover:border-primary-100">
                                 <Share2 size={16} />
                             </button>
                         </div>

                         <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-secondary-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-secondary-900/10 group-hover:bg-primary-600 group-hover:scale-110 transition-all duration-500">
                                     <HardHat size={32} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-secondary-900 leading-tight pr-6">{cont.name}</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        {[...Array(5)].map((_, idx) => (
                                            <Star key={idx} size={12} className={idx < Math.floor(cont.rating) ? 'fill-amber-400 text-amber-400' : 'text-secondary-200'} />
                                        ))}
                                        <span className="text-[10px] text-secondary-500 font-black tracking-widest ml-1">{cont.rating} / 5</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm font-medium text-secondary-500">
                                Specialized in <span className="text-secondary-900 font-bold">{cont.specialization}</span> works with <span className="text-primary-600 font-bold">{cont.projects}+ completed projects</span> across Karnataka.
                            </p>

                            <div className="flex flex-col gap-3 py-4 border-y border-secondary-100">
                                <div className="flex items-center gap-3 text-sm text-secondary-600 font-bold">
                                    <Phone size={14} className="text-secondary-400" />
                                    {cont.contact}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-secondary-600 font-bold">
                                    <MapPin size={14} className="text-secondary-400" />
                                    {cont.location}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2">
                                     <div className={`w-3 h-3 rounded-full ${cont.available ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                     <span className="text-[10px] uppercase font-black text-secondary-400 tracking-widest">{cont.available ? 'Available' : 'Occupied'}</span>
                                </div>
                                <button className="btn-primary py-2 px-6 text-xs uppercase font-black tracking-tighter">
                                    Request Quote
                                </button>
                            </div>
                         </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Contractors;
