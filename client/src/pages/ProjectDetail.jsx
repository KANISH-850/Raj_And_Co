import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, Users, CreditCard, FileText, 
    PieChart as PieChartIcon, HardHat, TrendingUp, 
    Loader2, AlertCircle, Edit2, Trash2, MapPin, 
    Tag, Check, X, Paperclip, Calendar
} from 'lucide-react';
import { 
    PieChart, Pie, Cell, Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import apiClient from '../services/apiClient';
import useApi from '../hooks/useApi';
import { toast } from 'react-hot-toast';

// 1. Lazy load heavy child components
const WorkerList = lazy(() => import('../components/projects/WorkerList'));
const DailyExpenseLog = lazy(() => import('../components/projects/DailyExpenseLog'));
const BudgetProgress = lazy(() => import('../components/projects/BudgetProgress'));
const DocumentManager = lazy(() => import('../components/common/DocumentManager'));
import apiClient from '../services/apiClient';
import useApi from '../hooks/useApi';
import { toast } from 'react-hot-toast';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('workers');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // 2. Add API Cache Key for Stale-While-Revalidate
    const { execute: fetchProject, data: projectRes, loading, error, clearCache } = useApi(
        useCallback((projId) => apiClient.get(`/projects/${projId}`), []),
        { cacheKey: `project-detail-${id}`, staleTime: 60000 }
    );

    const project = projectRes?.data;

    useEffect(() => {
        if (id) fetchProject(id);
    }, [id, fetchProject]);

    // 3. Prevent re-creation of handlers with useCallback
    const handleStatusChange = useCallback(async (newStatus) => {
        const tid = toast.loading('Syncing status...');
        try {
            await apiClient.put(`/projects/${id}`, { status: newStatus });
            toast.success('Site status updated!', { id: tid });
            clearCache(); // Invalidate cache since we mutated data
            fetchProject(id);
        } catch { toast.error('Status sync failed.', { id: tid }); }
    }, [id, fetchProject, clearCache]);

    const handleDelete = useCallback(async () => {
        if (!window.confirm('IRREVERSIBLE: Decommission this site?')) return;
        const tid = toast.loading('Decommissioning...');
        try {
            await apiClient.delete(`/projects/${id}`);
            toast.success('Site decommissioned.', { id: tid });
            navigate('/projects');
        } catch { toast.error('Command failed.'); }
    }, [id, navigate]);

    const handleEditSave = useCallback(async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        const tid = toast.loading('Saving changes...');
        try {
            await apiClient.put(`/projects/${id}`, data);
            toast.success('Parameters recalibrated!', { id: tid });
            setIsEditModalOpen(false);
            clearCache(); // Invalidate cache
            fetchProject(id);
        } catch { toast.error('Update failed.'); }
    }, [id, fetchProject, clearCache]);

    // 4. Memoize tabs configuration
    const tabs = useMemo(() => [
        { id: 'workers', label: 'Worker List', icon: <HardHat size={18} /> },
        { id: 'expenses', label: 'Daily Expenses', icon: <CreditCard size={18} /> },
        { id: 'tenders', label: 'Tenders Related', icon: <FileText size={18} /> },
        { id: 'accounts', label: 'Account Summary', icon: <PieChartIcon size={18} /> },
        { id: 'documents', label: 'Vault', icon: <Paperclip size={18} /> },
    ], []);

    return (
        <>
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
                            <div className="flex items-center justify-between">
                                <Link to="/projects" className="flex items-center gap-2 text-secondary-500 hover:text-primary-600 font-bold transition-all text-sm group">
                                    <div className="p-2 bg-white border border-secondary-200 rounded-lg group-hover:scale-95 group-hover:bg-primary-50 group-hover:border-primary-200 transition-all">
                                        <ChevronLeft size={16} />
                                    </div>
                                    Back to Projects
                                </Link>
                                <div className="flex gap-2">
                                    <button onClick={() => setIsEditModalOpen(true)} className="p-3 bg-white border border-secondary-200 text-secondary-600 rounded-2xl hover:bg-secondary-50 transition-all shadow-sm">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={handleDelete} className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all shadow-sm border border-red-100">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-4">
                                         <h1 className="text-4xl font-black text-secondary-900 tracking-tight">{project.name}</h1>
                                         <div className="relative">
                                             <select 
                                                 value={project.status || 'active'}
                                                 onChange={(e) => handleStatusChange(e.target.value)}
                                                 className="appearance-none pl-4 pr-10 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/20 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                                             >
                                                 <option value="active">Active</option>
                                                 <option value="paused">Paused</option>
                                                 <option value="completed">Completed</option>
                                                 <option value="cancelled">Cancelled</option>
                                             </select>
                                             <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                 <ChevronLeft size={12} className="-rotate-90 text-emerald-600" />
                                             </div>
                                         </div>
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
                        <Suspense fallback={<div className="h-[20px] bg-secondary-100 animate-pulse rounded-full my-4" />}>
                            <BudgetProgress spent={project.spent || 0} total={project.tenderRef || 1000000} progress={project.progress || 0} />
                        </Suspense>

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
                                {/* 5. Suspense boundary for tab content */}
                                <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>}>
                                    {activeTab === 'workers' && <WorkerList projectId={id} />}
                                    {activeTab === 'expenses' && <DailyExpenseLog projectId={id} />}
                                    {activeTab === 'tenders' && (
                                       <div className="glass rounded-3xl p-10 flex flex-col gap-8 min-h-[400px]">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-xl font-bold text-secondary-900 flex items-center gap-2"><FileText /> Linked Tenders</h3>
                                                <button onClick={() => navigate('/tenders')} className="text-[10px] font-black uppercase text-primary-600 hover:underline">Link New +</button>
                                            </div>
                                            {project.tenders?.length > 0 ? (
                                                <div className="grid gap-4">
                                                    {project.tenders.map(t => (
                                                        <div key={t.id} className="p-4 bg-secondary-50 border border-secondary-100 rounded-2xl flex justify-between items-center">
                                                            <div>
                                                                <p className="font-bold">{t.title}</p>
                                                                <p className="text-xs text-secondary-400">VALUE: ₹{t.tenderValue.toLocaleString()}</p>
                                                            </div>
                                                            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-[10px] font-black uppercase">{t.status}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                                                    <FileText size={48} className="mb-4" />
                                                    <p className="font-bold">No tenders linked to this site yet.</p>
                                                </div>
                                            )}
                                       </div>
                                    )}
                                    {activeTab === 'accounts' && (
                                        <div className="glass rounded-3xl p-10 flex flex-col gap-8 min-h-[400px]">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-xl font-bold text-secondary-900 flex items-center gap-2"><PieChartIcon /> Account Performance</h3>
                                                <button onClick={() => navigate('/accounts')} className="text-[10px] font-black uppercase text-primary-600 hover:underline">Full Ledger</button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                                    <div className="h-[250px] relative">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <PieChart>
                                                                <Pie data={[
                                                                    { name: 'Spent', value: project.spent || 0, color: '#f43f5e' },
                                                                    { name: 'Remaining', value: Math.max(0, (project.tenderRef || 1000000) - (project.spent || 0)), color: '#10b981' }
                                                                ]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                                    <Cell fill="#f43f5e" />
                                                                    <Cell fill="#10b981" />
                                                                </Pie>
                                                                <Tooltip />
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                            <p className="text-[10px] font-black uppercase text-secondary-400">Utilization</p>
                                                            <p className="text-xl font-black">{Math.round(((project.spent || 0) / (project.tenderRef || 1000000)) * 100)}%</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="p-6 bg-secondary-900 text-white rounded-[2rem]">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-1">Financial Runway</p>
                                                            <p className="text-3xl font-black">₹{((project.tenderRef || 1000000) - (project.spent || 0)).toLocaleString()}</p>
                                                        </div>
                                                        <div className="p-6 bg-white border border-secondary-100 rounded-[2rem]">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400 mb-1">Total Burn</p>
                                                            <p className="text-3xl font-black text-secondary-900">₹{(project.spent || 0).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                            </div>
                                        </div>
                                     )}
                                    {activeTab === 'documents' && <DocumentManager projectId={id} />}
                                </Suspense>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-secondary-900/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="bg-white rounded-[3rem] p-10 w-full max-w-xl relative shadow-2xl border border-secondary-100">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-secondary-900 tracking-tighter">Recalibrate Parameters</h2>
                                    <p className="text-secondary-500 text-sm">Editing {project?.name}</p>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-3 bg-secondary-50 hover:bg-secondary-100 rounded-2xl transition-all">
                                    <X size={20} className="text-secondary-500" />
                                </button>
                            </div>
                            <form onSubmit={handleEditSave} className="space-y-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Project Schedule (Start Date)</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                                            <input 
                                                name="startDate" 
                                                type="date" 
                                                required 
                                                defaultValue={project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} 
                                                className="w-full pl-14 pr-6 py-5 bg-secondary-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold transition-all outline-none" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Project Designation</label>
                                        <input name="name" required defaultValue={project?.name} className="w-full px-6 py-5 bg-secondary-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold transition-all outline-none" placeholder="e.g. Skyline Residency" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Coordinate Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                                            <input name="location" required defaultValue={project?.location} className="w-full pl-14 pr-6 py-5 bg-secondary-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold transition-all outline-none" placeholder="Bangalore, Karnataka" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Category</label>
                                            <select name="type" defaultValue={project?.type || 'Commercial'} className="w-full px-6 py-5 bg-secondary-50 border-none rounded-2xl font-bold appearance-none outline-none">
                                                <option>Commercial</option>
                                                <option>Residential</option>
                                                <option>Industrial</option>
                                                <option>Infrastructure</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col justify-end">
                                            <button type="submit" className="bg-secondary-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-secondary-800 transition-all flex items-center justify-center gap-2">
                                                <Check size={24} /> Sync Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProjectDetail;
