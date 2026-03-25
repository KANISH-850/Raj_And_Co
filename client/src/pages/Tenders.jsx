import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, PlusCircle, Search, Filter, Calendar, IndianRupee, MapPin } from 'lucide-react';
import TenderCard from '../components/tenders/TenderCard';

const Tenders = () => {
    const [search, setSearch] = useState('');

    const tenders = [
        { id: 1, tender_number: 'RC/2025/112', title: 'Construction of Elevated Corridor', issued_by: 'NHAI', date: '2025-04-10', amount: '₹145Cr', status: 'won', location: 'Bengaluru' },
        { id: 2, tender_number: 'PWD/KA/4452', title: 'Government Hospital Expansion', issued_by: 'PWD Karnataka', date: '2025-03-28', amount: '₹12Cr', status: 'submitted', location: 'Mysuru' },
        { id: 3, tender_number: 'METRO/D3/88', title: 'Phase 2 Metro Underground cabling', issued_by: 'BMRCL', date: '2025-04-15', amount: '₹4.5Cr', status: 'pending', location: 'Bengaluru' },
        { id: 4, tender_number: 'SMART/DVG/09', title: 'Smart City Road Development', issued_by: 'Davangere Smart City', date: '2024-12-05', amount: '₹22Cr', status: 'lost', location: 'Davangere' },
    ];

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                   <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Tender Registry</h1>
                   <p className="text-secondary-500">Track and manage all your government and private bids.</p>
                </div>
                <button className="btn-primary flex items-center gap-2 group">
                    <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />
                    Register Tender
                </button>
            </header>

            <div className="flex gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by tender no or title..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-secondary-200 rounded-2xl text-secondary-600 font-bold shadow-sm hover:bg-secondary-50 transition-all group">
                    <Filter size={18} className="text-secondary-400 group-hover:text-primary-600 transition-colors" />
                    Filter Status
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {tenders.map((tender, i) => (
                    <TenderCard key={tender.id} tender={tender} delay={i * 0.1} />
                ))}
            </div>
        </div>
    );
};

export default Tenders;
