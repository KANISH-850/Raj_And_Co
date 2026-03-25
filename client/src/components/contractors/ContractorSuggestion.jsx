import React from 'react';
import { Sparkles, Star, MapPin, IndianRupee, HardHat, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const ContractorSuggestion = ({ projectSpecialization, projectLocation }) => {
    // Mock AI-like suggestions
    const suggestions = [
        { id: 1, name: 'Siva Electricals & Projects', specialization: 'Electrical', rating: 4.8, distance: '2.5 km', priceRange: 'Premium', match: 98 },
        { id: 2, name: 'Smart Security & Automation', specialization: 'Automation', rating: 4.9, distance: '4.2 km', priceRange: 'Mid-range', match: 92 },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-primary-500 animate-pulse" />
                <h3 className="text-sm font-black text-secondary-500 uppercase tracking-widest">Smart Match for this Project</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestions.map((cont, i) => (
                    <motion.div
                        key={cont.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + (i * 0.1) }}
                        className="glass-dark p-6 rounded-3xl relative overflow-hidden group border border-primary-500/20 shadow-2xl shadow-primary-500/10"
                    >
                        <div className="absolute top-0 right-0 p-4">
                            <div className="bg-primary-600/20 text-primary-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest border border-primary-500/30">
                                {cont.match}% MATCH
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white">
                                    <HardHat size={20} />
                                </div>
                                <h4 className="font-black text-white pr-10">{cont.name}</h4>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-xs text-secondary-400 font-bold uppercase tracking-widest">
                                    <Star size={14} className="text-amber-400 fill-amber-400" />
                                    {cont.rating} / 5
                                </div>
                                <div className="flex items-center gap-2 text-xs text-secondary-400 font-bold uppercase tracking-widest">
                                    <MapPin size={14} className="text-primary-400" />
                                    {cont.distance} away
                                </div>
                            </div>

                            <button className="mt-2 w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group">
                                Assign for Quote
                                <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ContractorSuggestion;
