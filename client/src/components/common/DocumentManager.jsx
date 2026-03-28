import React, { useState, useEffect } from 'react';
import { FileText, PlusCircle, Download, Trash2, Loader2, File, Paperclip, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../services/apiClient';
import useApi from '../../hooks/useApi';
import { toast } from 'react-hot-toast';

const DocumentManager = ({ projectId, tenderId, workerId }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    
    // Construct Query
    const query = new URLSearchParams();
    if (projectId) query.append('projectId', projectId);
    if (tenderId) query.append('tenderId', tenderId);
    if (workerId) query.append('workerId', workerId);

    const { execute: fetchDocs, data: apiResponse, loading } = useApi(
        () => apiClient.get(`/documents?${query.toString()}`)
    );

    useEffect(() => {
        fetchDocs();
    }, [projectId, tenderId, workerId]);

    const docs = apiResponse?.data || [];

    const handleMockUpload = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        
        setIsUploading(true);
        const tid = toast.loading('Establishing secure document link...');
        
        try {
            // Simulation: In real use, we'd upload to Supabase/S3 first
            const mockUrl = `https://raj-and-co.com/storage/${Date.now()}_${data.name.replace(/\s+/g, '_')}.pdf`;
            
            const payload = {
                ...data,
                url: mockUrl,
                type: 'application/pdf',
                projectId,
                tenderId,
                workerId,
                category: projectId ? 'project' : (tenderId ? 'tender' : 'worker')
            };

            await apiClient.post('/documents', payload);
            toast.success('Document Tracked Successfully.', { id: tid });
            setShowPicker(false);
            fetchDocs();
        } catch {
            toast.error('Sync Error.', { id: tid });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this document trace?')) return;
        const tid = toast.loading('Purging record...');
        try {
            await apiClient.delete(`/documents/${id}`);
            toast.success('Record Purged.', { id: tid });
            fetchDocs();
        } catch { toast.error('Command Failed.', { id: tid }); }
    };

    return (
        <div className="bg-white/40 backdrop-blur-md rounded-[3rem] p-8 border border-white shadow-xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="text-2xl font-black text-secondary-900 tracking-tighter">Central Control</h3>
                   <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Document Registry & Audits</p>
                </div>
                <button 
                    onClick={() => setShowPicker(true)}
                    className="p-3 bg-secondary-900 text-white rounded-2xl hover:bg-secondary-800 transition-all flex items-center gap-2 group"
                >
                    <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />
                    <span className="hidden md:inline font-bold text-xs uppercase tracking-widest px-1">Upload</span>
                </button>
            </div>

            <AnimatePresence>
                {showPicker && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8 border-b border-secondary-100 pb-8">
                         <form onSubmit={handleMockUpload} className="bg-secondary-50 p-8 rounded-[2.5rem] space-y-4">
                             <div className="flex justify-between items-center mb-4">
                                <p className="text-[10px] font-black uppercase text-secondary-400">File Integration Protocol</p>
                                <button type="button" onClick={() => setShowPicker(false)}><X size={16} className="text-secondary-400" /></button>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <input name="name" required placeholder="Document Name (e.g. NOC_PHASE_1)" className="px-6 py-4 bg-white border border-secondary-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary-500/20" />
                                 <button type="submit" disabled={isUploading} className="bg-secondary-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 disabled:opacity-50">
                                     {isUploading ? <Loader2 className="animate-spin mx-auto" /> : <Check className="mx-auto" />}
                                 </button>
                             </div>
                             <p className="text-[8px] font-bold text-secondary-400 text-center uppercase">Cloud Storage Simulation Active • Verifying Authenticity...</p>
                         </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-3">
                {loading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary-500" /></div>
                ) : docs.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-secondary-100 rounded-[2.5rem] flex flex-col items-center gap-4 group hover:border-primary-100 transition-colors cursor-pointer" onClick={() => setShowPicker(true)}>
                         <Paperclip size={48} className="text-secondary-100 group-hover:text-primary-200 transition-colors" />
                         <p className="font-bold text-secondary-300">Vault Empty. Initiate Transfer.</p>
                    </div>
                ) : (
                    docs.map((doc, i) => (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={doc.id} className="flex items-center justify-between p-5 bg-white rounded-[2rem] hover:shadow-lg transition-all border border-secondary-50 group">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-secondary-900 text-white rounded-xl shadow-xl group-hover:bg-primary-600 transition-colors">
                                    <File size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-secondary-900 text-sm tracking-tight">{doc.name}</p>
                                    <p className="text-[10px] text-secondary-400 font-bold uppercase tracking-tighter">AUDIT_ID: 0x{doc.id.slice(0,6).toUpperCase()} • {new Date(doc.createdAt).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => window.open(doc.url, '_blank')} className="p-2.5 bg-secondary-50 text-secondary-400 hover:text-primary-600 rounded-xl transition-all shadow-sm"><Download size={16} /></button>
                                <button onClick={() => handleDelete(doc.id)} className="p-2.5 bg-secondary-50 text-secondary-400 hover:text-rose-600 rounded-xl transition-all shadow-sm"><Trash2 size={16} /></button>
                             </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DocumentManager;
