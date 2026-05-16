'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  AlertTriangle, BadgeCheck, Clock, Copy, Check, Eye, 
  Loader2, RefreshCw, Search, Wallet, XCircle, Zap, ShieldAlert 
} from 'lucide-react';
import { approveWithdrawal, fetchAdminWithdrawals, rejectWithdrawal } from '@/features/admin/adminPaymentsSlice';
import type { AdminWithdrawal } from '@/types/admin';

export default function AdminWithdrawalsPage() {
  const dispatch = useAppDispatch();
  const { withdrawals, isLoading, isProcessing, error } = useAppSelector((state) => state.adminPayments);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [paymentProof, setPaymentProof] = useState('');
  const [copied, setCopied] = useState(false);

  // 1. FETCH QUEUE
  const fetchWithdrawals = async () => {
    await dispatch(fetchAdminWithdrawals());
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [dispatch]);

  // 2. DERIVED DATA
  const filteredWithdrawals = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return withdrawals;

    return withdrawals.filter(w => 
      w.user.email.toLowerCase().includes(term) ||
      (w.user.fullName && w.user.fullName.toLowerCase().includes(term)) ||
      w.id.toLowerCase().includes(term) ||
      w.status.toLowerCase().includes(term)
    );
  }, [searchTerm, withdrawals]);

  const selectedWithdrawal = withdrawals.find(w => w.id === selectedId);
  const pendingCount = withdrawals.filter(w => w.status === 'PENDING').length;

  // 3. COPY TO CLIPBOARD HELPER
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 4. ACTION: MARK AS PAID
  const handleApprove = async () => {
    if (!selectedId) return;
    if (!paymentProof.trim()) return alert("You must provide the payment proof (preimage/hash) before marking as paid.");
    
    if (!window.confirm("Are you sure you have paid this invoice? This cannot be undone.")) return;

    try {
      await dispatch(approveWithdrawal({ id: selectedId, paymentProof: paymentProof.trim() })).unwrap();
      setPaymentProof('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 5. ACTION: REJECT
  const handleReject = async () => {
    if (!selectedId) return;
    if (!window.confirm("Are you sure you want to reject this? The funds should be returned to the user's available balance.")) return;

    try {
      await dispatch(rejectWithdrawal(selectedId)).unwrap();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- RENDER HELPERS ---
  const getStatusUI = (status: string) => {
    switch (status) {
      case 'PAID': return { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' };
      case 'REJECTED': return { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
      case 'PENDING': default: return { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' };
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6 md:gap-8">
        
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mt-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-sats-orange-500 tracking-tight">Withdrawals Desk</h1>
            <p className="text-gray-400 text-sm mt-1">Review payout requests, pay invoices, and securely release funds.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
            <div className="relative w-full sm:w-96 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search email, ID, status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-sats-orange-500/50 focus:bg-[#111] transition-all shadow-inner"
              />
            </div>
            <button
              onClick={fetchWithdrawals}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl text-white font-bold hover:bg-[#111] transition-all shrink-0 w-full sm:w-auto active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 text-sats-orange-500 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard icon={<Clock className="w-5 h-5 text-yellow-400" />} label="Pending Payouts" value={pendingCount} glow="bg-yellow-500/10" />
          <SummaryCard icon={<BadgeCheck className="w-5 h-5 text-green-400" />} label="Total Processed" value={withdrawals.length - pendingCount} glow="bg-green-500/10" />
          <SummaryCard icon={<Wallet className="w-5 h-5 text-sats-orange-400" />} label="Filtered Views" value={filteredWithdrawals.length} glow="bg-sats-orange-500/10" />
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        {/* MAIN SPLIT VIEW */}
        <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.5fr)_450px] gap-6 items-start">
          
          {/* LEFT: QUEUE */}
          <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl">
            {isLoading && withdrawals.length === 0 ? (
              <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 text-sats-orange-500 animate-spin" /></div>
            ) : filteredWithdrawals.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <Wallet className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-lg font-semibold text-white">No withdrawals found.</p>
                <p className="text-sm mt-1">The queue is completely empty.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#141414]">
                {filteredWithdrawals.map((w) => {
                  const ui = getStatusUI(w.status);
                  const isSelected = selectedId === w.id;

                  return (
                    <div
                      key={w.id}
                      onClick={() => {
                        setSelectedId(w.id);
                        setPaymentProof(w.paymentProof || '');
                      }}
                      className={`cursor-pointer w-full text-left p-5 transition-all ${isSelected ? 'bg-sats-orange-500/8' : 'hover:bg-[#0b0b0b]'}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 ${ui.bg} ${ui.color}`}>
                            <Zap className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-white">{w.amountSats.toLocaleString()} Sats</h3>
                            <p className="text-sm text-gray-400">{w.user.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-1">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${ui.bg} ${ui.color}`}>
                            {w.status}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">{new Date(w.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: INSPECTOR */}
          <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-5 shadow-2xl sticky top-24">
            {selectedWithdrawal ? (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-sats-orange-500/80 mb-2">Request Details</p>
                  <div className="flex justify-between items-start">
                    <h2 className="text-3xl font-black text-white">{selectedWithdrawal.amountSats.toLocaleString()} <span className="text-lg text-gray-500">Sats</span></h2>
                    <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusUI(selectedWithdrawal.status).bg} ${getStatusUI(selectedWithdrawal.status).color}`}>
                      {selectedWithdrawal.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <DetailRow label="User" value={selectedWithdrawal.user.fullName || 'Unknown'} />
                  <DetailRow label="Email" value={selectedWithdrawal.user.email} />
                  <DetailRow label="Requested At" value={new Date(selectedWithdrawal.createdAt).toLocaleString()} />
                </div>

                {/* THE INVOICE SECTION */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Lightning Invoice</label>
                    <button 
                      onClick={() => handleCopy(selectedWithdrawal.lightningInvoice)}
                      className="text-[10px] font-bold text-sats-orange-500 hover:text-sats-orange-400 flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'COPIED!' : 'COPY INVOICE'}
                    </button>
                  </div>
                  <div className="w-full h-32 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-4 overflow-y-auto custom-scrollbar">
                    <p className="text-xs text-gray-300 font-mono break-all leading-relaxed">
                      {selectedWithdrawal.lightningInvoice}
                    </p>
                  </div>
                </div>

                {/* ACTIONS SECTION (Only if PENDING) */}
                {selectedWithdrawal.status === 'PENDING' ? (
                  <div className="space-y-4 pt-4 border-t border-[#1a1a1a]">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        Payment Preimage (Required to mark paid)
                      </label>
                      <input
                        type="text"
                        value={paymentProof}
                        onChange={(e) => setPaymentProof(e.target.value)}
                        placeholder="Paste preimage hash after paying..."
                        className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-sm text-white font-mono outline-none focus:border-green-500/50 transition-all"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleApprove}
                        disabled={isProcessing || !paymentProof.trim()}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 hover:bg-green-400 text-black py-3 font-black transition-all disabled:opacity-50"
                      >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <BadgeCheck className="w-4 h-4" />}
                        Mark as Paid
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={isProcessing}
                        className="inline-flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-5 font-bold transition-all disabled:opacity-50"
                        title="Reject & Refund"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display the saved proof if it was already processed */
                  selectedWithdrawal.paymentProof && (
                    <div className="space-y-2 pt-4 border-t border-[#1a1a1a]">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Saved Payment Proof</label>
                      <div className="w-full rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 text-xs text-green-400 font-mono break-all">
                        {selectedWithdrawal.paymentProof}
                      </div>
                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="py-16 text-center opacity-50">
                <Zap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-lg font-bold text-white">Select a request</p>
                <p className="text-sm text-gray-400 mt-1">Pick an invoice from the queue to process the payout.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Micro Components ---

function SummaryCard({ icon, label, value, glow }: { icon: React.ReactNode; label: string; value: number; glow: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#1a1a1a] bg-[#050505] p-5 shadow-xl">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full blur-3xl ${glow}`} />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-500">{label}</p>
          <h3 className="mt-3 text-3xl font-black text-white">{value}</h3>
        </div>
        <div className="rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-3">{icon}</div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 flex justify-between items-center gap-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 shrink-0">{label}</p>
      <p className="text-sm font-semibold text-white truncate">{value}</p>
    </div>
  );
}
