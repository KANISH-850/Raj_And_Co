import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, Search, PlusCircle, MapPin, Calendar, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/projects/ProjectCard';

const Projects = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const projects = [
        { id: 1, name: 'NH-44 Highway Construction', location: 'Bengaluru, KA', status: 'ongoing', progress: 65, startDate: '2025-01-10', budget: '₹12Cr' },
        { id: 2, name: 'Royal Enclave Apartments', location: 'Mysuru, KA', status: 'ongoing', progress: 40, startDate: '2025-02-15', budget: '₹8Cr' },
        { id: 3, name: 'City Hospital Renovation', location: 'HubballI, KA', status: 'completed', progress: 100, startDate: '2024-11-20', budget: '₹2Cr' },
        { id: 4, name: 'Green Park Metro Station', location: 'Noida, UP', status: 'paused', progress: 15, startDate: '2025-03-01', budget: '₹15Cr' },
    ];

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                   <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Active Projects</h1>
                   <p className="text-secondary-500">Manage all your construction sites in one place.</p>
                </div>
                <button className="btn-primary flex items-center gap-2 group">
                    <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />
                    Add Project
                </button>
            </header>

            <div className="flex gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Filter by name..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    {['All', 'Ongoing', 'Completed'].map((tab) => (
                        <button key={tab} className="px-4 py-3 bg-white border border-secondary-200 rounded-2xl hover:bg-secondary-50 text-secondary-600 font-semibold transition-all shadow-sm">
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {projects.map((proj, i) => (
                    <ProjectCard key={proj.id} project={proj} delay={i * 0.1} />
                ))}
            </div>
        </div>
    );
};

export default Projects;
