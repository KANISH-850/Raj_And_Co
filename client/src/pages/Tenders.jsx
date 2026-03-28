import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, PlusCircle, Search, Loader2, AlertCircle, X, Check,
  BookMarked, Trophy, XCircle, Clock, ChevronDown, Trash2, ArrowUpRight
} from 'lucide-react';
import apiClient from '../services/apiClient';
import useApi from '../hooks/useApi';
import { toast } from 'react-hot-toast';

// ─── Status Config ────────────────────────────────────────────
const STATUS_CONFIG = {
  SELECTED:         { label: 'Selected',         color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  DOCUMENT_PENDING: { label: 'Docs Pending',     color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  SUBMITTED:        { label: 'Submitted',        color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  WON:              { label: 'Won',              color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  LOST:             { label: 'Lost',             color: 'bg-red-500/10 text-red-600 border-red-500/20' },
  submitted:        { label: 'Submitted',        color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  approved:         { label: 'Approved',         color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  rejected:         { label: 'Rejected',         color: 'bg-red-500/10 text-red-600 border-red-500/20' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-secondary-100 text-secondary-500' };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

// ─── Tender Register Row ──────────────────────────────────────
const RegisterRow = ({ item, onStatusChange, onDelete }) => {
  const [changing, setChanging] = useState(false);
  const statuses = ['SELECTED', 'DOCUMENT_PENDING', 'SUBMITTED', 'WON', 'LOST'];

  const handleChange = async (newStatus) => {
    setChanging(true);
    await onStatusChange(item.id, newStatus);
    setChanging(false);
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-secondary-100 hover:bg-secondary-50/50 transition-colors group"
    >
      <td className="py-4 px-6">
        <p className="font-bold text-secondary-900 text-sm">{item.title}</p>
        <p className="text-xs text-secondary-400 font-mono mt-0.5">{item.tenderNumber}</p>
      </td>
      <td className="py-4 px-4 text-sm text-secondary-600">{item.department || '—'}</td>
      <td className="py-4 px-4 text-sm font-bold text-secondary-900">
        {item.estimatedValue ? `₹${Number(item.estimatedValue).toLocaleString('en-IN')}` : '—'}
      </td>
      <td className="py-4 px-4 text-xs text-secondary-500">
        {new Date(item.selectedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>
      <td className="py-4 px-4">
        <div className="relative inline-block">
          <select
            value={item.status}
            onChange={(e) => handleChange(e.target.value)}
            disabled={changing}
            className="appearance-none pl-3 pr-8 py-1.5 rounded-xl text-xs font-black border border-secondary-200 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
        </div>
      </td>
      <td className="py-4 px-4">
        <button
          onClick={() => onDelete(item.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </motion.tr>
  );
};

// ─── Main Component ───────────────────────────────────────────
const Tenders = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  // Selected Tenders (Tender Register)
  const [myTenders, setMyTenders] = useState([]);
  const { execute: fetchMyTenders, data: myTendersRes, loading: myLoading } = useApi(() => apiClient.get('/tenders/selected'));

  // Available Tenders (Bid Registry)
  const [optimisticTenders, setOptimisticTenders] = useState([]);
  const { execute: fetchTenders, data: apiResponse, loading, error } = useApi(() => apiClient.get('/tenders'));

  useEffect(() => { fetchMyTenders(); fetchTenders(); }, []);
  useEffect(() => { if (myTendersRes?.data) setMyTenders(myTendersRes.data); }, [myTendersRes]);
  useEffect(() => { if (apiResponse?.data) setOptimisticTenders(apiResponse.data); }, [apiResponse]);

  // ─── Register Tender (Tender Register) ───────────────────
  const handleRegisterTender = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    if (data.estimatedValue) data.estimatedValue = parseFloat(data.estimatedValue);

    const toastId = toast.loading('Adding to your Tender Register...');
    setIsRegisterModalOpen(false);
    try {
      const res = await apiClient.post('/tenders/selected', data);
      setMyTenders(prev => [res.data.data, ...prev]);
      toast.success('✅ Tender added to your register!', { id: toastId });
      e.target.reset();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to register tender.';
      toast.error(msg, { id: toastId });
    }
  };

  // ─── Select from Bid List ─────────────────────────────────
  const handleSelectFromBid = async (tender) => {
    const toastId = toast.loading('Saving to Tender Register...');
    try {
      const res = await apiClient.post('/tenders/selected', {
        title: tender.title,
        tenderNumber: tender.id.slice(0, 8).toUpperCase(),
        estimatedValue: tender.tenderValue,
        source: 'Bid Registry',
      });
      setMyTenders(prev => [res.data.data, ...prev]);
      toast.success('✅ Added to My Register!', { id: toastId });
    } catch (err) {
      toast.error('Failed to select tender.', { id: toastId });
    }
  };

  // ─── Status Change ────────────────────────────────────────
  const handleStatusChange = async (id, status) => {
    try {
      await apiClient.put(`/tenders/selected/${id}/status`, { status });
      setMyTenders(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      toast.success('Status updated!');
    } catch {
      toast.error('Failed to update status.');
    }
  };

  // ─── Delete from Register ─────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/tenders/selected/${id}`);
      setMyTenders(prev => prev.filter(t => t.id !== id));
      toast.success('Removed from register.');
    } catch {
      toast.error('Failed to remove.');
    }
  };

  // ─── Add Bid ──────────────────────────────────────────────
  const handleAddBid = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.tenderValue = parseFloat(data.tenderValue);

    const tempId = `temp-${Date.now()}`;
    setOptimisticTenders(prev => [{ ...data, id: tempId, status: 'submitted', isOptimistic: true }, ...prev]);
    setIsBidModalOpen(false);
    const toastId = toast.loading('Submitting bid...');
    try {
      await apiClient.post('/tenders', data);
      toast.success('Tender registered!', { id: toastId });
      fetchTenders();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed.', { id: toastId });
      setOptimisticTenders(prev => prev.filter(t => t.id !== tempId));
    }
  };

  // ─── Filtered My Tenders ──────────────────────────────────
  const filteredMyTenders = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return myTenders.filter(t =>
      (t.title.toLowerCase().includes(term) || t.tenderNumber?.toLowerCase().includes(term)) &&
      (statusFilter === 'All' || t.status === statusFilter)
    );
  }, [myTenders, searchTerm, statusFilter]);

  const filteredBids = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return optimisticTenders.filter(t =>
      t.title.toLowerCase().includes(term) &&
      (statusFilter === 'All' || t.status?.toLowerCase() === statusFilter.toLowerCase())
    );
  }, [optimisticTenders, searchTerm, statusFilter]);

  // ─── Stats for Register tab ───────────────────────────────
  const stats = useMemo(() => ({
    total: myTenders.length,
    submitted: myTenders.filter(t => t.status === 'SUBMITTED').length,
    won: myTenders.filter(t => t.status === 'WON').length,
    pending: myTenders.filter(t => t.status === 'DOCUMENT_PENDING').length,
  }), [myTenders]);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-secondary-900 tracking-tighter">Tender Management</h1>
          <p className="text-secondary-500 font-medium">Select, track and win government & private tenders.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="bg-secondary-900 hover:bg-secondary-800 text-white px-6 py-3.5 rounded-2xl font-black shadow-xl active:scale-95 transition-all flex items-center gap-2"
          >
            <BookMarked size={18} />
            <span>Select Tender</span>
          </button>
          <button
            onClick={() => setIsBidModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3.5 rounded-2xl font-black shadow-xl shadow-primary-600/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <PlusCircle size={18} />
            <span>Register New Bid</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary-100 p-1.5 rounded-2xl w-fit">
        {[
          { id: 'register', label: `My Register (${myTenders.length})`, icon: BookMarked },
          { id: 'bids', label: 'Bid Registry', icon: FileText },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setSearchTerm(''); setStatusFilter('All'); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all
              ${activeTab === id ? 'bg-white shadow-md text-secondary-900' : 'text-secondary-500 hover:text-secondary-700'}`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* ─── MY REGISTER TAB ─────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === 'register' && (
          <motion.div key="register" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Selected', value: stats.total, color: 'text-blue-600 bg-blue-50' },
                { label: 'Doc Pending',    value: stats.pending, color: 'text-amber-600 bg-amber-50' },
                { label: 'Submitted',      value: stats.submitted, color: 'text-purple-600 bg-purple-50' },
                { label: 'Won',            value: stats.won, color: 'text-emerald-600 bg-emerald-50' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-2xl p-5 border border-secondary-100 shadow-sm">
                  <p className="text-xs font-black text-secondary-400 uppercase tracking-widest mb-1">{label}</p>
                  <p className={`text-3xl font-black ${color.split(' ')[0]}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                <input
                  type="text" placeholder="Search by title or tender number..."
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-secondary-200 rounded-2xl outline-none font-medium text-sm focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['All', 'SELECTED', 'DOCUMENT_PENDING', 'SUBMITTED', 'WON', 'LOST'].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border whitespace-nowrap
                      ${statusFilter === s ? 'bg-secondary-900 text-white border-secondary-900' : 'bg-white border-secondary-200 text-secondary-500 hover:bg-secondary-50'}`}
                  >
                    {STATUS_CONFIG[s]?.label || s}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            {myLoading ? (
              <div className="flex items-center justify-center py-32 gap-4">
                <Loader2 className="animate-spin text-primary-500" size={32} />
                <p className="text-secondary-400 font-black uppercase text-xs tracking-widest">Loading Register...</p>
              </div>
            ) : filteredMyTenders.length === 0 ? (
              <div className="py-24 text-center">
                <BookMarked size={64} className="mx-auto mb-4 text-secondary-200" />
                <p className="text-xl font-black text-secondary-900">No Tenders in Your Register</p>
                <p className="text-secondary-400 text-sm mt-2">Click "Select Tender" to add a tender you're participating in.</p>
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="mt-6 bg-secondary-900 text-white px-8 py-3 rounded-2xl font-black hover:bg-secondary-800 transition-all"
                >
                  + Select Your First Tender
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-secondary-100 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary-50 border-b border-secondary-100">
                      {['Tender Title', 'Department', 'Est. Value', 'Selected On', 'Status', ''].map(h => (
                        <th key={h} className="text-left py-4 px-6 text-[10px] font-black text-secondary-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMyTenders.map(item => (
                      <RegisterRow
                        key={item.id}
                        item={item}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── BID REGISTRY TAB ──────────────────────────────── */}
        {activeTab === 'bids' && (
          <motion.div key="bids" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                <input
                  type="text" placeholder="Filter by title or ID..."
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-secondary-200 rounded-2xl outline-none font-medium text-sm focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
                />
              </div>
              <div className="flex gap-2">
                {['All', 'Submitted', 'Approved', 'Rejected'].map(tab => (
                  <button key={tab} onClick={() => setStatusFilter(tab)}
                    className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all
                      ${statusFilter === tab ? 'bg-secondary-900 border-secondary-900 text-white' : 'bg-white border-secondary-200 text-secondary-500 hover:bg-secondary-50'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {loading && filteredBids.length === 0 ? (
              <div className="flex items-center justify-center py-32 gap-4">
                <Loader2 className="animate-spin text-primary-500" size={32} />
              </div>
            ) : error ? (
              <div className="p-16 bg-red-50 rounded-3xl flex flex-col items-center gap-4 text-center">
                <AlertCircle size={40} className="text-red-500" />
                <h3 className="text-xl font-black text-secondary-900">Bid Sync Interrupted</h3>
                <button onClick={fetchTenders} className="bg-primary-600 text-white px-8 py-3 rounded-2xl font-bold">Retry Fetch</button>
              </div>
            ) : filteredBids.length === 0 ? (
              <div className="py-20 text-center opacity-40">
                <FileText size={64} className="mx-auto mb-4" />
                <p className="text-xl font-bold">No bids registered yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBids.map((tender, i) => (
                  <motion.div
                    key={tender.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: tender.isOptimistic ? 0.6 : 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm flex items-center justify-between gap-6 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-secondary-100 rounded-2xl flex items-center justify-center text-secondary-400 group-hover:bg-primary-500 group-hover:text-white transition-all shrink-0">
                        <FileText size={22} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-secondary-900 truncate">{tender.title}</p>
                        {tender.tenderValue && (
                          <p className="text-sm text-secondary-500 font-medium">₹{Number(tender.tenderValue).toLocaleString('en-IN')}</p>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={tender.status} />
                    <button
                      onClick={() => handleSelectFromBid(tender)}
                      disabled={tender.isOptimistic}
                      className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-secondary-900 hover:bg-secondary-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40"
                    >
                      <BookMarked size={14} />
                      Select
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: Select / Register Tender ─────────────────────────── */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute inset-0 bg-secondary-900/80 backdrop-blur-md"
            />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="bg-white rounded-[3rem] p-10 w-full max-w-lg relative shadow-2xl border border-secondary-100 z-10"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black text-secondary-900 tracking-tighter">Select Tender</h2>
                  <p className="text-secondary-500 text-sm mt-1">Add a tender to your personal register.</p>
                </div>
                <button onClick={() => setIsRegisterModalOpen(false)} className="p-3 bg-secondary-50 hover:bg-secondary-100 rounded-2xl transition-all">
                  <X size={20} className="text-secondary-500" />
                </button>
              </div>
              <form onSubmit={handleRegisterTender} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Tender Title *</label>
                  <input name="title" required className="w-full px-5 py-4 bg-secondary-50 border-none rounded-2xl font-bold outline-none text-sm" placeholder="e.g. Smart City Road Phase II" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Tender Number</label>
                    <input name="tenderNumber" className="w-full px-5 py-4 bg-secondary-50 border-none rounded-2xl font-bold outline-none text-sm" placeholder="TN-2026-001" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Department</label>
                    <input name="department" className="w-full px-5 py-4 bg-secondary-50 border-none rounded-2xl font-bold outline-none text-sm" placeholder="PWD / Highways" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Estimated Value (₹)</label>
                    <input name="estimatedValue" type="number" className="w-full px-5 py-4 bg-secondary-50 border-none rounded-2xl font-bold outline-none text-sm" placeholder="5000000" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Source</label>
                    <input name="source" className="w-full px-5 py-4 bg-secondary-50 border-none rounded-2xl font-bold outline-none text-sm" placeholder="e-Tender / Offline" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Notes</label>
                  <textarea name="notes" rows={2} className="w-full px-5 py-4 bg-secondary-50 border-none rounded-2xl font-bold outline-none text-sm resize-none" placeholder="Any remarks..." />
                </div>
                <button type="submit" className="w-full bg-secondary-900 text-white py-5 rounded-2xl font-black text-base hover:bg-secondary-800 transition-all flex items-center justify-center gap-2">
                  <BookMarked size={20} /> Add to My Tender Register
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: Register New Bid ──────────────────────────────────── */}
      <AnimatePresence>
        {isBidModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsBidModalOpen(false)}
              className="absolute inset-0 bg-secondary-900/80 backdrop-blur-md"
            />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="bg-white rounded-[3rem] p-10 w-full max-w-lg relative shadow-2xl border border-secondary-100 z-10"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black text-secondary-900 tracking-tighter">Register New Bid</h2>
                  <p className="text-secondary-500 text-sm mt-1">Record a tender you have submitted a bid for.</p>
                </div>
                <button onClick={() => setIsBidModalOpen(false)} className="p-3 bg-secondary-50 hover:bg-secondary-100 rounded-2xl transition-all">
                  <X size={20} className="text-secondary-500" />
                </button>
              </div>
              <form onSubmit={handleAddBid} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Tender Title *</label>
                  <input name="title" required className="w-full px-5 py-4 bg-secondary-50 border-none rounded-2xl font-bold outline-none text-sm" placeholder="e.g. Smart City Drainage Phase II" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Bid Value (₹) *</label>
                    <input name="tenderValue" required type="number" className="w-full px-5 py-4 bg-secondary-50 border-none rounded-2xl font-bold outline-none text-sm" placeholder="5000000" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Authority</label>
                    <input name="authority" className="w-full px-5 py-4 bg-secondary-50 border-none rounded-2xl font-bold outline-none text-sm" placeholder="PWD / KMC" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-primary-600 text-white py-5 rounded-2xl font-black text-base hover:bg-primary-700 transition-all flex items-center justify-center gap-2">
                  <Check size={20} /> Register Bid
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tenders;
