import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, PlusCircle, Search, Loader2, AlertCircle, X,
  Check, BookMarked, Trash2, ChevronDown
} from 'lucide-react';
import apiClient from '../services/apiClient';
import useApi from '../hooks/useApi';
import { toast } from 'react-hot-toast';

// ─── Status Config ────────────────────────────────────────────
const STATUS_CFG = {
  SELECTED:         { label: 'Selected',       color: 'bg-blue-100 text-blue-700 border-blue-200' },
  DOCUMENT_PENDING: { label: 'Docs Pending',   color: 'bg-amber-100 text-amber-700 border-amber-200' },
  SUBMITTED:        { label: 'Submitted',      color: 'bg-purple-100 text-purple-700 border-purple-200' },
  WON:              { label: 'Won ✓',          color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  LOST:             { label: 'Lost',           color: 'bg-red-100 text-red-700 border-red-200' },
  submitted:        { label: 'Submitted',      color: 'bg-blue-100 text-blue-700 border-blue-200' },
  approved:         { label: 'Approved',       color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  rejected:         { label: 'Rejected',       color: 'bg-red-100 text-red-700 border-red-200' },
};

const Badge = ({ status }) => {
  const cfg = STATUS_CFG[status] || { label: status, color: 'bg-secondary-100 text-secondary-600 border-secondary-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

// ─── Reusable Button ──────────────────────────────────────────
const Btn = ({ children, onClick, variant = 'primary', size = 'md', fullMobile = false, disabled = false, type = 'button', className = '' }) => {
  const base = 'inline-flex items-center justify-center gap-2 font-black rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-2 text-xs', md: 'px-5 py-3 text-sm', lg: 'px-6 py-4 text-base' };
  const variants = {
    primary:   'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/20',
    dark:      'bg-secondary-900 hover:bg-secondary-800 text-white shadow-md',
    outline:   'bg-white border-2 border-secondary-200 text-secondary-700 hover:border-secondary-400 hover:bg-secondary-50',
    danger:    'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200',
    ghost:     'text-secondary-500 hover:bg-secondary-100 hover:text-secondary-900',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullMobile ? 'w-full md:w-auto' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// ─── Register Table Row ───────────────────────────────────────
const RegisterRow = ({ item, onStatusChange, onDelete }) => {
  const [saving, setSaving] = useState(false);
  const STATUSES = ['SELECTED', 'DOCUMENT_PENDING', 'SUBMITTED', 'WON', 'LOST'];

  const onChange = async (s) => {
    setSaving(true);
    await onStatusChange(item.id, s);
    setSaving(false);
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-secondary-100 hover:bg-secondary-50/60 transition-colors group"
    >
      <td className="py-4 px-4 min-w-[160px]">
        <p className="font-bold text-secondary-900 text-sm leading-snug">{item.title}</p>
        <p className="text-[11px] text-secondary-400 font-mono mt-0.5">{item.tenderNumber}</p>
      </td>
      <td className="py-4 px-4 text-sm text-secondary-600 hidden sm:table-cell whitespace-nowrap">{item.department || '—'}</td>
      <td className="py-4 px-4 text-sm font-bold text-secondary-900 hidden md:table-cell whitespace-nowrap">
        {item.estimatedValue ? `₹${Number(item.estimatedValue).toLocaleString('en-IN')}` : '—'}
      </td>
      <td className="py-4 px-4 text-xs text-secondary-500 hidden lg:table-cell whitespace-nowrap">
        {new Date(item.selectedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>
      <td className="py-4 px-4">
        <div className="relative inline-block">
          <select
            value={item.status}
            onChange={(e) => onChange(e.target.value)}
            disabled={saving}
            className="appearance-none pl-3 pr-7 py-1.5 rounded-xl text-[11px] font-black border border-secondary-200 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
          >
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_CFG[s]?.label || s}</option>)}
          </select>
          <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
        </div>
      </td>
      <td className="py-4 px-3">
        <button
          onClick={() => onDelete(item.id)}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          aria-label="Delete"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </motion.tr>
  );
};

// ─── Modal Wrapper ────────────────────────────────────────────
const Modal = ({ open, onClose, title, subtitle, children }) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-secondary-900/80 backdrop-blur-sm" />
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative bg-white w-full sm:max-w-lg rounded-t-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Drag Handle (mobile) */}
          <div className="w-12 h-1.5 bg-secondary-200 rounded-full mx-auto mb-6 sm:hidden" />
          <div className="flex justify-between items-start mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-secondary-900 tracking-tighter">{title}</h2>
              {subtitle && <p className="text-secondary-500 text-sm mt-1">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="p-2.5 bg-secondary-100 hover:bg-secondary-200 rounded-2xl transition-all hidden sm:flex">
              <X size={18} className="text-secondary-500" />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ─── Main Page ────────────────────────────────────────────────
const Tenders = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);

  const [myTenders, setMyTenders] = useState([]);
  const [optimisticBids, setOptimisticBids] = useState([]);

  const { execute: fetchMy, data: myRes, loading: myLoading } = useApi(() => apiClient.get('/tenders/selected'));
  const { execute: fetchBids, data: bidsRes, loading: bidsLoading, error: bidsError } = useApi(() => apiClient.get('/tenders'));

  useEffect(() => { fetchMy(); fetchBids(); }, []);
  useEffect(() => { if (myRes?.data) setMyTenders(myRes.data); }, [myRes]);
  useEffect(() => { if (bidsRes?.data) setOptimisticBids(bidsRes.data); }, [bidsRes]);

  // Register Tender
  const handleRegister = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    if (data.estimatedValue) data.estimatedValue = parseFloat(data.estimatedValue);
    const tid = toast.loading('Saving to register...');
    setShowSelectModal(false);
    try {
      const res = await apiClient.post('/tenders/selected', data);
      setMyTenders(p => [res.data.data, ...p]);
      toast.success('✅ Tender saved to your register!', { id: tid });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed.', { id: tid });
    }
  };

  // Select from Bid list
  const handleSelectBid = async (tender) => {
    const tid = toast.loading('Adding to register...');
    try {
      const res = await apiClient.post('/tenders/selected', {
        title: tender.title,
        tenderNumber: tender.id.slice(0, 8).toUpperCase(),
        estimatedValue: tender.tenderValue,
        source: 'Bid Registry',
      });
      setMyTenders(p => [res.data.data, ...p]);
      toast.success('Added to My Register!', { id: tid });
    } catch { toast.error('Failed.', { id: tid }); }
  };

  // Status change
  const handleStatusChange = async (id, status) => {
    try {
      await apiClient.put(`/tenders/selected/${id}/status`, { status });
      setMyTenders(p => p.map(t => t.id === id ? { ...t, status } : t));
      toast.success('Status updated!');
    } catch { toast.error('Update failed.'); }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/tenders/selected/${id}`);
      setMyTenders(p => p.filter(t => t.id !== id));
      toast.success('Removed.');
    } catch { toast.error('Delete failed.'); }
  };

  // Add Bid
  const handleAddBid = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.tenderValue = parseFloat(data.tenderValue);
    const tempId = `tmp-${Date.now()}`;
    setOptimisticBids(p => [{ ...data, id: tempId, status: 'submitted', isOptimistic: true }, ...p]);
    setShowBidModal(false);
    const tid = toast.loading('Registering bid...');
    try {
      await apiClient.post('/tenders', data);
      toast.success('Bid registered!', { id: tid });
      fetchBids();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed.', { id: tid });
      setOptimisticBids(p => p.filter(t => t.id !== tempId));
    }
  };

  // Stats
  const stats = useMemo(() => ({
    total: myTenders.length,
    pending: myTenders.filter(t => t.status === 'DOCUMENT_PENDING').length,
    submitted: myTenders.filter(t => t.status === 'SUBMITTED').length,
    won: myTenders.filter(t => t.status === 'WON').length,
  }), [myTenders]);

  const filteredMy = useMemo(() => {
    const q = search.toLowerCase();
    return myTenders.filter(t =>
      (t.title.toLowerCase().includes(q) || t.tenderNumber?.toLowerCase().includes(q)) &&
      (statusFilter === 'All' || t.status === statusFilter)
    );
  }, [myTenders, search, statusFilter]);

  const filteredBids = useMemo(() => {
    const q = search.toLowerCase();
    return optimisticBids.filter(t =>
      t.title.toLowerCase().includes(q) &&
      (statusFilter === 'All' || t.status?.toLowerCase() === statusFilter.toLowerCase())
    );
  }, [optimisticBids, search, statusFilter]);

  const REG_FILTERS = ['All', 'SELECTED', 'DOCUMENT_PENDING', 'SUBMITTED', 'WON', 'LOST'];
  const BID_FILTERS = ['All', 'Submitted', 'Approved', 'Rejected'];

  return (
    <div className="space-y-6 pb-24">

      {/* ── Page Header ──────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-secondary-900 tracking-tighter">Tender Management</h1>
          <p className="text-secondary-500 text-sm md:text-base font-medium mt-1">Select, track and win government & private tenders.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Btn variant="dark" onClick={() => setShowSelectModal(true)} fullMobile>
            <BookMarked size={16} /> Select Tender
          </Btn>
          <Btn variant="primary" onClick={() => setShowBidModal(true)} fullMobile>
            <PlusCircle size={16} /> Register New Bid
          </Btn>
        </div>
      </header>

      {/* ── Tabs ─────────────────────────────────────────── */}
      <div className="inline-flex gap-1 bg-secondary-100 p-1.5 rounded-2xl overflow-x-auto scrollbar-none max-w-full">
        {[
          { id: 'register', label: `My Register (${myTenders.length})`, icon: BookMarked },
          { id: 'bids',     label: 'Bid Registry',                      icon: FileText  },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setSearch(''); setStatusFilter('All'); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm whitespace-nowrap transition-all
              ${activeTab === id ? 'bg-white shadow-md text-secondary-900' : 'text-secondary-500 hover:text-secondary-700'}`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* ── MY REGISTER ──────────────────────────────────── */}
      <AnimatePresence mode="wait">
      {activeTab === 'register' && (
        <motion.div key="register" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: 'Total Selected', value: stats.total,     color: 'text-blue-600' },
              { label: 'Doc Pending',    value: stats.pending,   color: 'text-amber-600' },
              { label: 'Submitted',      value: stats.submitted, color: 'text-purple-600' },
              { label: 'Won',            value: stats.won,       color: 'text-emerald-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl p-4 md:p-5 border border-secondary-100 shadow-sm">
                <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-1 truncate">{label}</p>
                <p className={`text-2xl md:text-3xl font-black ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={17} />
              <input
                type="text" placeholder="Search by title or tender number..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-secondary-200 rounded-2xl outline-none font-medium text-sm focus:ring-2 focus:ring-primary-500/20 shadow-sm"
              />
            </div>
            {/* Filter chips — horizontally scrollable on mobile */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {REG_FILTERS.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`shrink-0 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wide border transition-all
                    ${statusFilter === s ? 'bg-secondary-900 text-white border-secondary-900' : 'bg-white border-secondary-200 text-secondary-500 hover:bg-secondary-50'}`}
                >
                  {STATUS_CFG[s]?.label || s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {myLoading ? (
            <div className="flex items-center justify-center py-24 gap-3">
              <Loader2 className="animate-spin text-primary-500" size={28} />
              <p className="text-secondary-400 font-black uppercase text-xs tracking-widest">Loading...</p>
            </div>
          ) : filteredMy.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-secondary-100">
              <BookMarked size={56} className="mx-auto mb-4 text-secondary-200" />
              <p className="text-lg font-black text-secondary-900">No tenders in your register</p>
              <p className="text-secondary-400 text-sm mt-1 mb-6">Click "Select Tender" to start tracking.</p>
              <Btn variant="dark" onClick={() => setShowSelectModal(true)}>+ Select Your First Tender</Btn>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-secondary-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[540px]">
                  <thead>
                    <tr className="bg-secondary-50 border-b border-secondary-100">
                      {['Tender Title', 'Department', 'Est. Value', 'Selected On', 'Status', ''].map((h, i) => (
                        <th key={i} className={`text-left py-3.5 px-4 text-[10px] font-black text-secondary-400 uppercase tracking-widest whitespace-nowrap
                          ${i === 1 ? 'hidden sm:table-cell' : ''}
                          ${i === 2 ? 'hidden md:table-cell' : ''}
                          ${i === 3 ? 'hidden lg:table-cell' : ''}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMy.map(item => (
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
            </div>
          )}
        </motion.div>
      )}

      {/* ── BID REGISTRY ─────────────────────────────────── */}
      {activeTab === 'bids' && (
        <motion.div key="bids" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

          {/* Search + Filters */}
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={17} />
              <input
                type="text" placeholder="Filter by title or ID..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-secondary-200 rounded-2xl outline-none font-medium text-sm focus:ring-2 focus:ring-primary-500/20 shadow-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {BID_FILTERS.map(f => (
                <button key={f} onClick={() => setStatusFilter(f)}
                  className={`shrink-0 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wide border transition-all
                    ${statusFilter === f ? 'bg-secondary-900 text-white border-secondary-900' : 'bg-white border-secondary-200 text-secondary-500 hover:bg-secondary-50'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {bidsLoading && filteredBids.length === 0 ? (
            <div className="flex items-center justify-center py-24 gap-3">
              <Loader2 className="animate-spin text-primary-500" size={28} />
            </div>
          ) : bidsError ? (
            <div className="p-12 bg-red-50 rounded-3xl flex flex-col items-center gap-4 text-center">
              <AlertCircle size={36} className="text-red-500" />
              <p className="font-black text-secondary-900 text-lg">Bid Sync Interrupted</p>
              <Btn variant="primary" onClick={fetchBids}>Retry Fetch</Btn>
            </div>
          ) : filteredBids.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-secondary-100">
              <FileText size={56} className="mx-auto mb-3 text-secondary-200" />
              <p className="font-bold text-secondary-400">No bids registered yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBids.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: t.isOptimistic ? 0.6 : 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-white rounded-2xl border border-secondary-100 shadow-sm p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 shrink-0 bg-secondary-100 rounded-2xl flex items-center justify-center text-secondary-400 group-hover:bg-primary-500 group-hover:text-white transition-all">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-secondary-900 text-sm truncate">{t.title}</p>
                      {t.tenderValue && (
                        <p className="text-xs text-secondary-500 font-medium mt-0.5">
                          ₹{Number(t.tenderValue).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge status={t.status} />
                    <Btn
                      variant="dark"
                      size="sm"
                      onClick={() => handleSelectBid(t)}
                      disabled={t.isOptimistic}
                    >
                      <BookMarked size={13} /> Select
                    </Btn>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
      </AnimatePresence>

      {/* ── MODAL: Select Tender ──────────────────────────── */}
      <Modal
        open={showSelectModal}
        onClose={() => setShowSelectModal(false)}
        title="Select Tender"
        subtitle="Add a tender to your personal register."
      >
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Tender Title *</label>
            <input name="title" required className="w-full px-4 py-3.5 bg-secondary-50 rounded-2xl font-bold outline-none text-sm border-none focus:ring-2 focus:ring-primary-500/20" placeholder="e.g. Smart City Road Phase II" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Tender Number</label>
              <input name="tenderNumber" className="w-full px-4 py-3.5 bg-secondary-50 rounded-2xl font-bold outline-none text-sm border-none" placeholder="TN-2026-001" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Department</label>
              <input name="department" className="w-full px-4 py-3.5 bg-secondary-50 rounded-2xl font-bold outline-none text-sm border-none" placeholder="PWD / TNHB" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Est. Value (₹)</label>
              <input name="estimatedValue" type="number" className="w-full px-4 py-3.5 bg-secondary-50 rounded-2xl font-bold outline-none text-sm border-none" placeholder="5000000" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Source</label>
              <input name="source" className="w-full px-4 py-3.5 bg-secondary-50 rounded-2xl font-bold outline-none text-sm border-none" placeholder="e-Tender / Offline" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Notes</label>
            <textarea name="notes" rows={2} className="w-full px-4 py-3.5 bg-secondary-50 rounded-2xl font-bold outline-none text-sm border-none resize-none" placeholder="Any remarks..." />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Btn type="button" variant="outline" onClick={() => setShowSelectModal(false)} fullMobile>Cancel</Btn>
            <Btn type="submit" variant="dark" fullMobile>
              <BookMarked size={16} /> Add to Register
            </Btn>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: Register New Bid ───────────────────────── */}
      <Modal
        open={showBidModal}
        onClose={() => setShowBidModal(false)}
        title="Register New Bid"
        subtitle="Record a tender you have submitted a bid for."
      >
        <form onSubmit={handleAddBid} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Tender Title *</label>
            <input name="title" required className="w-full px-4 py-3.5 bg-secondary-50 rounded-2xl font-bold outline-none text-sm border-none" placeholder="e.g. Smart City Drainage Phase II" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Bid Value (₹) *</label>
              <input name="tenderValue" required type="number" className="w-full px-4 py-3.5 bg-secondary-50 rounded-2xl font-bold outline-none text-sm border-none" placeholder="5000000" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Authority</label>
              <input name="authority" className="w-full px-4 py-3.5 bg-secondary-50 rounded-2xl font-bold outline-none text-sm border-none" placeholder="PWD / KMC" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Btn type="button" variant="outline" onClick={() => setShowBidModal(false)} fullMobile>Cancel</Btn>
            <Btn type="submit" variant="primary" fullMobile>
              <Check size={16} /> Register Bid
            </Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tenders;
