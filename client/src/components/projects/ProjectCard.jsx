import React from 'react';
import { motion } from 'framer-motion';
import { Folder, MapPin, Calendar, CheckSquare, MoreVertical, TrendingUp, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project, delay, onEdit, onDelete }) => {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'ongoing':
            case 'active': return 'bg-emerald-500';
            case 'completed': return 'bg-blue-500';
            case 'paused': return 'bg-amber-500';
            default: return 'bg-secondary-500';
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: project.isOptimistic ? 0.7 : 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={project.isOptimistic ? {} : { y: -8 }}
            className={`group glass rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl hover:bg-white/90 transition-all cursor-pointer relative ${project.isOptimistic ? 'animate-pulse' : ''}`}
            onClick={() => !project.isOptimistic && navigate(`/projects/${project.id}`)}
        >
            {project.isOptimistic && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-[2.5rem] z-20 flex items-center justify-center">
                    <div className="bg-secondary-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Loader2 size={12} className="animate-spin" />
                        Syncing...
                    </div>
                </div>
            )}
            <div className="absolute top-6 right-8 z-30 group/menu">
                <button 
                    onClick={(e) => { e.stopPropagation(); }}
                    className="p-2 text-secondary-400 hover:text-secondary-900 hover:bg-white rounded-xl transition-all"
                >
                    <MoreVertical size={20} />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-secondary-100 py-3 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-40 transform origin-top-right">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                        className="w-full text-left px-5 py-2.5 text-sm font-bold text-secondary-700 hover:bg-secondary-50 hover:text-primary-600 flex items-center gap-3 transition-colors"
                    >
                        <Edit2 size={16} />
                        Edit Properties
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                        className="w-full text-left px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                        <Trash2 size={16} />
                        Decommission Site
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${getStatusColor(project.status)} bg-opacity-10 rounded-[1.25rem] flex items-center justify-center text-primary-600 shadow-inner group-hover:scale-110 transition-transform`}>
                        <Folder size={28} className={project.status === 'ongoing' || project.status === 'active' ? 'text-emerald-600' : 'text-primary-600'} />
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors leading-tight">
                        {project.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-secondary-500 text-sm">
                        <MapPin size={14} />
                        <span>{project.location || 'Location not set'}</span>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-secondary-100">
                    <div className="flex items-center justify-between text-sm font-semibold">
                        <span className="text-secondary-400 capitalize flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
                           {project.status || 'Active'}
                        </span>
                        <span className="text-secondary-900">{project.progress || 0}% completed</span>
                    </div>

                    <div className="w-full h-2 bg-secondary-100 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress || 0}%` }}
                            transition={{ delay: delay + 0.3, duration: 1 }}
                            className={`h-full ${getStatusColor(project.status)} rounded-full shadow-sm`}
                        ></motion.div>
                    </div>

                    <div className="flex justify-between items-end pt-2">
                        <div className="space-y-1">
                           <span className="text-[10px] text-secondary-400 uppercase font-black">Type</span>
                           <p className="text-lg font-bold text-secondary-900">{project.type || 'Civil'}</p>
                        </div>
                        <div className="flex items-center gap-1 text-primary-600 font-bold group-hover:translate-x-1 transition-transform">
                           <span className="text-xs">Open Folder</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
