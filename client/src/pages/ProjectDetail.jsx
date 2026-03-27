import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, CreditCard, FileText, PieChart, HardHat, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import WorkerList from '../components/projects/WorkerList';
import DailyExpenseLog from '../components/projects/DailyExpenseLog';
import BudgetProgress from '../components/projects/BudgetProgress';
import apiClient from '../services/apiClient';
import useApi from '../hooks/useApi';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('workers');

    // API Hook for fetching single project
    const { execute: fetchProject, data: project, loading, error } = useApi(
        (projId) => apiClient.get(`/projects/${projId}`)
    );

    useEffect(() => {
        if (id) fetchProject(id);
    }, [id]);

    const tabs = [
        { id: 'workers', label: 'Worker List', icon: <HardHat size={18} /> },
        { id: 'expenses', label: 'Daily Expenses', icon: <CreditCard size={18} /> },
        { id: 'tenders', label: 'Tenders Related', icon: <FileText size={18} /> },
        { id: 'accounts', label: 'Account Summary', icon: <PieChart size={18} /> },
    ];

    return (
        <AnimatePresence mode="wait">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
                        <p className="text-secondary-400 font-black italic tracking-widest uppercase text-xs">Assembling Project Data...</p>
                    </div>
                ) : error ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-12 glass rounded-[3rem] border border-red-500/10 flex flex-col items-center gap-6 text-center shadow-3xl shadow-red-500/10"
                    >
                         <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 shadow-inner">
                            <AlertCircle size={48} />
                         </div>
                         <div>
                            <h2 className="text-2xl font-black text-secondary-900">Project Not Found</h2>
                            <p className="text-secondary-500 max-w-sm mt-2">{error}</p>
                         </div>
                         <button 
                            onClick={() => navigate('/projects')}
                            className="btn-primary py-3 px-10 rounded-2xl flex items-center gap-2 group"
                         >
                            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            Return to Dashboard
                         </button>
                    </motion.div>
                ) : project && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {/* Header / Breadcrumb */}
                        <div className="flex flex-col gap-4">
                            <Link to="/projects" className="flex items-center gap-2 text-secondary-500 hover:text-primary-600 font-bold transition-all text-sm group">
                                <div className="p-2 bg-white border border-secondary-200 rounded-lg group-hover:scale-95 group-hover:bg-primary-50 group-hover:border-primary-200 transition-all">
                                    <ChevronLeft size={16} />
                                </div>
                                Back to Projects
                            </Link>

                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                         <h1 className="text-4xl font-black text-secondary-900 tracking-tight">{project.name}</h1>
                                         <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                                            {project.status || 'Active'}
                                         </span>
                                    </div>
                                    <p className="text-secondary-500 flex items-center gap-2 font-medium">
                                        <TrendingUp size={16} className="text-primary-600" />
                                        Site located at <span className="text-secondary-900 font-bold">{project.location || 'Site Location'}</span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-4 rounded-3xl border border-secondary-200 shadow-xl shadow-secondary-200/50">
                                    <div className="text-right border-r border-secondary-100 pr-4">
                                        <p className="text-[10px] text-secondary-400 uppercase font-black">Project Type</p>
                                        <p className="text-xl font-black text-secondary-900">{project.type || 'Civil'}</p>
                                    </div>
                                    <div className="pl-4">
                                        <p className="text-[10px] text-secondary-400 uppercase font-black">Start Date</p>
                                        <p className="text-sm font-bold text-secondary-700">{new Date(project.startDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Overall Progress Section */}
                        <BudgetProgress spent={project.spent || 0} total={project.tenderRef || 1000000} progress={project.progress || 0} />

                        {/* Custom Tabs */}
                        <div className="flex flex-col gap-8">
                            <div className="flex gap-2 p-1.5 bg-secondary-100 rounded-[2rem] w-fit shadow-inner border border-secondary-200 relative">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            relative z-10 flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-sm font-bold transition-all duration-300
                                            ${activeTab === tab.id ? 'text-white' : 'text-secondary-600 hover:text-secondary-900'}
                                        `}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="active-tab"
                                                className="absolute inset-0 bg-primary-600 rounded-[1.5rem] -z-10 shadow-lg shadow-primary-600/30"
                                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content Rendering */}
                            <div className="mt-2 min-h-[500px]">
                                {activeTab === 'workers' && <WorkerList projectId={id} />}
                                {activeTab === 'expenses' && <DailyExpenseLog projectId={id} />}
                                {activeTab === 'tenders' && (
                                   <div className="glass rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
                                        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-400">
                                            <FileText size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-secondary-900">Tender Records</h3>
                                            <p className="text-secondary-500 max-w-sm">Detailed records of tenders registered for this specific project will appear here.</p>
                                        </div>
                                   </div>
                                )}
                                {activeTab === 'accounts' && (
                                    <div className="glass rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
                                         <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-400">
                                             <PieChart size={32} />
                                         </div>
                                         <div>
                                             <h3 className="text-xl font-bold text-secondary-900">Account Summary</h3>
                                             <p className="text-secondary-500 max-w-sm">Project-wise profit & loss statement and expense distribution charts.</p>
                                         </div>
                                    </div>
                                 )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
    );
};

export default ProjectDetail;
