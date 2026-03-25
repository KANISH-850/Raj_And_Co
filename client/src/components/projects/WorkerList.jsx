import React from 'react';
import { UserPlus, MoreVertical, HardHat, Phone, Calendar, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

const WorkerList = ({ projectId }) => {
    // Mock worker data
    const workers = [
        { id: 1, name: 'Suresh Kumar', role: 'Mason', wage: 800, joined: '2025-01-12', contact: '8877665544' },
        { id: 2, name: 'Ramesh Singh', role: 'Electrician', wage: 950, joined: '2025-01-20', contact: '9988776655' },
        { id: 3, name: 'Sunil Verma', role: 'Supervisor', wage: 1200, joined: '2024-12-05', contact: '7766554433' },
        { id: 4, name: 'Ajay Dev', role: 'Plumber', wage: 850, joined: '2025-02-10', contact: '9584736251' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-8"
        >
            <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-2xl font-bold text-secondary-900 tracking-tight">Project Workforce</h2>
                   <p className="text-secondary-500">Currently <span className="text-primary-600 font-bold">{workers.length} workers</span> allocated to this project.</p>
                </div>
                <button className="px-6 py-3 bg-secondary-900 text-white rounded-2xl flex items-center gap-2 hover:bg-secondary-800 transition-all font-bold shadow-xl shadow-secondary-900/10 active:scale-95 group">
                    <UserPlus size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    Allocate Worker
                </button>
            </div>

            <div className="table-container bg-white/60 backdrop-blur-sm shadow-2xl shadow-secondary-200/50">
                <table className="w-full">
                    <thead>
                        <tr className="bg-secondary-50">
                            <th className="table-header">Worker Details</th>
                            <th className="table-header">Designation</th>
                            <th className="table-header">Daily Wage</th>
                            <th className="table-header">Date Joined</th>
                            <th className="table-header">Contact</th>
                            <th className="table-header text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100">
                        {workers.map((worker) => (
                            <tr key={worker.id} className="hover:bg-primary-50/30 transition-colors group">
                                <td className="table-cell">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center text-secondary-500 group-hover:bg-primary-500 group-hover:text-white transition-all">
                                            <HardHat size={18} />
                                        </div>
                                        <div>
                                           <p className="font-black text-secondary-900">{worker.name}</p>
                                           <p className="text-[10px] uppercase text-secondary-400 font-black tracking-widest">ID: {worker.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="table-cell">
                                    <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-bold ring-1 ring-secondary-200 group-hover:ring-primary-300 group-hover:bg-primary-50 group-hover:text-primary-700 transition-all">
                                       {worker.role}
                                    </span>
                                </td>
                                <td className="table-cell">
                                    <div className="flex items-center gap-1 font-black text-secondary-900">
                                       <IndianRupee size={12} className="text-secondary-400" />
                                       {worker.wage}
                                    </div>
                                </td>
                                <td className="table-cell">
                                    <div className="flex items-center gap-2 text-secondary-600 font-medium">
                                       <Calendar size={14} className="text-secondary-400" />
                                       {worker.joined}
                                    </div>
                                </td>
                                <td className="table-cell">
                                    <div className="flex items-center gap-2 text-secondary-600 font-medium">
                                       <Phone size={14} className="text-secondary-400" />
                                       {worker.contact}
                                    </div>
                                </td>
                                <td className="table-cell text-center">
                                    <button className="p-2 hover:bg-white rounded-lg transition-colors text-secondary-400 hover:text-secondary-900 border border-transparent hover:border-secondary-200">
                                        <MoreVertical size={18} />
                                    </button>
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
