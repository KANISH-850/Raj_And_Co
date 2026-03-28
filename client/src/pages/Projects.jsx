import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Search, Filter, Loader2, AlertCircle, X, Check, ArrowRight, MapPin, Tag, Folder } from 'lucide-react';
import ProjectCard from '../components/projects/ProjectCard';
import apiClient from '../services/apiClient';
import useApi from '../hooks/useApi';
import { toast } from 'react-hot-toast';

const Projects = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [optimisticProjects, setOptimisticProjects] = useState([]);

    const [editingProject, setEditingProject] = useState(null);

    const { execute: fetchProjects, data: apiResponse, loading, error } = useApi(
        () => apiClient.get('/projects')
    );

    useEffect(() => {
        fetchProjects();
    }, []);

    // Sync optimistic state with backend data when it arrives
    useEffect(() => {
        if (apiResponse?.data) {
            setOptimisticProjects(apiResponse.data);
        }
    }, [apiResponse]);

    const handleAddProject = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const projectData = Object.fromEntries(formData.entries());

        if (editingProject) {
            const toastId = toast.loading('Updating site protocols...');
            try {
                await apiClient.put(`/projects/${editingProject.id}`, projectData);
                toast.success('Project parameters updated!', { id: toastId });
                setEditingProject(null);
                setIsModalOpen(false);
                fetchProjects();
            } catch (err) {
                toast.error('Update failed.', { id: toastId });
            }
            return;
        }

        // Optimistic Entry
        const tempId = `optimistic-${Date.now()}`;
        const optimisticEntry = { 
            ...projectData, 
            id: tempId, 
            status: 'active', 
            progress: 0, 
            isOptimistic: true,
            createdAt: new Date().toISOString()
        };
        
        setOptimisticProjects([optimisticEntry, ...optimisticProjects]);
        setIsModalOpen(false);
        setIsSaving(true);

        const toastId = toast.loading('Initializing site protocols...');

        try {
            await apiClient.post('/projects', projectData);
            toast.success('Project live on dashboard!', { id: toastId });
            fetchProjects(); // Refresh to get real ID and finalized state
        } catch (err) {
            toast.error('Site initialization failed.', { id: toastId });
            setOptimisticProjects(optimisticProjects); // Rollback on error
        } finally {
            setIsSaving(true);
            setTimeout(() => setIsSaving(false), 500); // Smooth transition
        }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm('Are you sure you want to decommission this site? This action is irreversible.')) return;
        
        const toastId = toast.loading('Decommissioning site...');
        try {
            await apiClient.delete(`/projects/${id}`);
            toast.success('Site removed from active grid.', { id: toastId });
            setOptimisticProjects(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            toast.error('Decommissioning failed.', { id: toastId });
        }
    };

    const filteredProjects = useMemo(() => {
        return optimisticProjects.filter(p => {
            const name = p.name || '';
            const location = p.location || '';
            const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = statusFilter === 'All' || p.status?.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesFilter;
        });
    }, [optimisticProjects, searchTerm, statusFilter]);

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h1 className="text-4xl font-black text-secondary-900 tracking-tighter">Active Projects</h1>
                   <p className="text-secondary-500 font-medium mt-1">Real-time oversight of all construction sites.</p>
                </div>
                <button 
                    onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary-600/20 active:scale-95 transition-all flex items-center gap-2 group"
                >
                    <PlusCircle size={22} className="group-hover:rotate-90 transition-transform" />
                    <span>Deploy Project</span>
                </button>
            </header>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-secondary-900/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="bg-white rounded-[3rem] p-10 w-full max-w-xl relative shadow-2xl border border-secondary-100"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-secondary-900 tracking-tighter">
                                        {editingProject ? 'Modify Site' : 'Project Setup'}
                                    </h2>
                                    <p className="text-secondary-500 text-sm">
                                        {editingProject ? `Editing ${editingProject.name}` : 'Define your project parameters below.'}
                                    </p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-secondary-50 hover:bg-secondary-100 rounded-2xl transition-all">
                                     <X size={20} className="text-secondary-500" />
                                </button>
                            </div>

                            <form onSubmit={handleAddProject} className="space-y-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Project Designation</label>
                                        <input 
                                            name="name"
                                            required
                                            defaultValue={editingProject?.name}
                                            className="w-full px-6 py-5 bg-secondary-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold transition-all outline-none placeholder-secondary-300"
                                            placeholder="e.g. Skyline Residency Phase 1"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Coordinate Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                                            <input 
                                                name="location"
                                                required
                                                defaultValue={editingProject?.location}
                                                className="w-full pl-14 pr-6 py-5 bg-secondary-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold transition-all outline-none placeholder-secondary-300"
                                                placeholder="Bangalore, Karnataka"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Category</label>
                                            <div className="relative">
                                                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                                                <select 
                                                    name="type"
                                                    defaultValue={editingProject?.type || 'Commercial'}
                                                    className="w-full pl-14 pr-6 py-5 bg-secondary-50 border-none rounded-2xl font-bold appearance-none outline-none"
                                                >
                                                    <option>Commercial</option>
                                                    <option>Residential</option>
                                                    <option>Industrial</option>
                                                    <option>Infrastructure</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-end">
                                            <button 
                                                type="submit"
                                                className="bg-secondary-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-secondary-800 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Check size={24} />
                                                {editingProject ? 'Save Changes' : 'Confirm Launch'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
                        placeholder="Search by project name or coordinates..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white border border-secondary-200 rounded-[2rem] focus:ring-2 focus:ring-primary-500/20 transition-all outline-none shadow-sm font-medium"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none px-2">
                    {['All', 'Active', 'Completed', 'Paused'].map((tab) => (
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
                {loading && optimisticProjects.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-40 gap-6"
                    >
                        <div className="relative">
                            <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
                            <div className="absolute inset-0 w-16 h-16 border-4 border-primary-500/10 rounded-full"></div>
                        </div>
                        <p className="text-secondary-400 font-black italic uppercase tracking-widest text-xs">Accessing Command Center...</p>
                    </motion.div>
                ) : error ? (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="p-16 glass rounded-[3rem] border border-red-500/10 flex flex-col items-center gap-6 text-center shadow-3xl shadow-red-500/10"
                    >
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                             <AlertCircle size={40} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-secondary-900">Communication Error</h3>
                            <p className="text-secondary-500 mt-2 max-w-sm">{error}</p>
                        </div>
                        <button 
                            onClick={() => fetchProjects()}
                            className="bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-primary-600/30"
                        >
                            Establish Reconnection
                        </button>
                    </motion.div>
                ) : filteredProjects.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="py-40 flex flex-col items-center gap-6 text-center"
                    >
                        <div className="w-32 h-32 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-300">
                             <Search size={64} />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-secondary-900 tracking-tighter">No Active Protocols Found</p>
                            <p className="text-secondary-500 font-medium italic">Your query returned zero results. Try adjusting the scope.</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
                    >
                        <AnimatePresence>
                            {filteredProjects.map((proj, i) => (
                                <ProjectCard 
                                    key={proj.id} 
                                    project={proj} 
                                    delay={i * 0.05} 
                                    onEdit={() => { setEditingProject(proj); setIsModalOpen(true); }}
                                    onDelete={handleDeleteProject}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Projects;
