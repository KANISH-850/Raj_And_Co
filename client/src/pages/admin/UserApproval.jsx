import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, UserCheck, UserX, UserPlus, Loader2, ArrowLeft, MoreVertical, Mail, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import useApi from '../../hooks/useApi';
import { toast } from 'react-hot-toast';

const UserApproval = () => {
    const navigate = useNavigate();
    const { execute: fetchUsers, data: usersRes, loading } = useApi(() => apiClient.get('/admin/users'));
    const [users, setUsers] = useState([]);

    useEffect(() => { fetchUsers(); }, []);
    useEffect(() => { if (usersRes?.data) setUsers(usersRes.data); }, [usersRes]);

    const handleAction = async (id, payload) => {
        const tid = toast.loading('Applying security overrides...');
        try {
            await apiClient.patch(`/admin/users/${id}`, payload);
            setUsers(p => p.map(u => u.id === id ? { ...u, ...payload } : u));
            toast.success('Security Status Synchronized.', { id: tid });
        } catch { toast.error('Override Protocol Failed.', { id: tid }); }
    };

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-secondary-900 tracking-tighter flex items-center gap-3">
                        <ShieldCheck className="text-primary-600" size={36} /> Identity Firewall
                    </h1>
                    <p className="text-secondary-500 font-medium max-w-lg">Manage user clearance levels and verify incoming registration requests for Raj & Co.</p>
                </div>
                <div className="flex items-center gap-4">
                     <div className="px-6 py-4 bg-secondary-50 border border-secondary-200 rounded-2xl flex items-center gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        <span className="text-secondary-900 font-black text-xs uppercase tracking-widest">{users.filter(u => !u.isApproved).length} Pending Approval</span>
                     </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                       <div className="col-span-full py-20 flex justify-center"><Loader2 className="animate-spin text-primary-500" size={48} /></div>
                    ) : users.map((user, i) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            key={user.id} 
                            className={`
                                group bg-white rounded-[3rem] p-8 border hover:shadow-2xl transition-all duration-500 relative overflow-hidden
                                ${user.isApproved ? 'border-secondary-100 hover:border-primary-100' : 'border-amber-200 bg-amber-50/10'}
                            `}
                        >
                            {!user.isApproved && <div className="absolute top-0 right-0 px-8 py-2 bg-amber-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-bl-[2rem] shadow-lg">Pending Review</div>}
                            
                            <div className="flex gap-6 items-start mb-8">
                                <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center font-black text-2xl shadow-xl transition-all group-hover:rotate-6 ${user.role === 'admin' ? 'bg-secondary-900 text-white' : 'bg-primary-50 text-primary-600'}`}>
                                    {user.name[0]}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-secondary-900 tracking-tight flex items-center gap-2">
                                        {user.name} 
                                        {user.role === 'admin' && <ShieldCheck size={16} className="text-primary-500" />}
                                    </h3>
                                    <div className="flex flex-col gap-1 mt-1">
                                        <div className="flex items-center gap-2 text-secondary-400 text-sm"><Mail size={14} /> {user.email}</div>
                                        <div className="flex items-center gap-2 text-secondary-400 text-[10px] font-black uppercase tracking-tighter"><Calendar size={14} /> Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                               <button 
                                 onClick={() => handleAction(user.id, { isApproved: !user.isApproved })}
                                 className={`
                                    py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95
                                    ${user.isApproved ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'}
                                 `}
                               >
                                 {user.isApproved ? <><UserX size={16} /> Suspend Clearance</> : <><UserCheck size={16} /> Grant Clearance</>}
                               </button>

                               <button 
                                 onClick={() => handleAction(user.id, { role: user.role === 'admin' ? 'user' : 'admin' })}
                                 className={`
                                    py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 border-2
                                    ${user.role === 'admin' ? 'bg-secondary-900 text-white border-secondary-900' : 'bg-white border-secondary-200 text-secondary-600 hover:border-secondary-400'}
                                 `}
                               >
                                 {user.role === 'admin' ? <><UserX size={16} /> Revoke Admin</> : <><UserPlus size={16} /> Promote Admin</>}
                               </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UserApproval;
