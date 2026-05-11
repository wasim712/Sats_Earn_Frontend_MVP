'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, Wallet, Clock, CheckCircle2, AlertTriangle, 
  ArrowRight, Shield, XCircle, ArrowUpRight, Loader2, History
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// --- TYPES ---
interface Balances {
  available: number;
  pending: number;
  locked: number;
}

interface Withdrawal {
  id: string;
  amountSats: number;
  lightningInvoice: string;
  status: 'PENDING' | 'PAID' | 'REJECTED';
  paymentProof: string | null;
  createdAt: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// SKELETON
// ══════════════════════════════════════════════════════════════════════════════
function WithdrawalSkeleton() {
  return (
    <div className="max-w-6xl w-full mx-auto space-y-8 animate-pulse pb-20 p-4 md:p-6 lg:p-8">
      
      {/* ─── PAGE HEADER SKELETON ─── */}
      <div>
        <div className="h-[40px] sm:h-[48px] w-64 bg-white/5 rounded-xl" />
        <div className="h-[24px] w-80 sm:w-96 bg-white/[0.03] rounded-lg mt-1.5" />
      </div>

      {/* ─── LIQUIDITY OVERVIEW SKELETON ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* Orange Card */}
        <div className="bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-3xl p-6 relative overflow-hidden">
          <div className="h-[16px] w-36 bg-sats-orange-500/20 rounded mb-2" />
          <div className="h-[40px] w-32 bg-sats-orange-500/20 rounded-xl" />
          <div className="h-[20px] w-10 bg-sats-orange-500/10 rounded mt-1" />
        </div>
        
        {/* Dark Cards */}
        {[1, 2].map(i => (
          <div key={i} className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-white/10 shrink-0" />
              <div className="h-[16px] w-32 bg-white/5 rounded" />
            </div>
            <div className="h-[36px] w-24 bg-white/5 rounded-xl" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full">
        
        {/* ─── WITHDRAWAL FORM SKELETON ─── */}
        <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 md:p-8 shadow-xl relative z-10 w-full">
          <div className="flex items-center gap-3 mb-6 border-b border-[#1a1a1a] pb-5">
            <div className="w-10 h-10 rounded-xl bg-[#111] border border-[#2a2a2a] shrink-0" />
            <div className="h-7 w-40 bg-white/5 rounded-lg" />
          </div>

          <div className="space-y-6 w-full">
            {/* Amount Input */}
            <div className="w-full">
              <div className="flex justify-between mb-2">
                <div className="h-[16px] w-28 bg-white/5 rounded" />
                <div className="h-[16px] w-8 bg-sats-orange-500/20 rounded" />
              </div>
              <div className="w-full h-[60px] bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl" />
            </div>

            {/* Textarea Input */}
            <div className="w-full">
              <div className="h-[16px] w-36 bg-white/5 rounded mb-2" />
              <div className="w-full h-[116px] bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl" />
              {/* Fake helper text */}
              <div className="h-[16px] w-11/12 bg-white/[0.03] rounded mt-2" />
              <div className="h-[16px] w-2/3 bg-white/[0.03] rounded mt-1" />
            </div>

            {/* Submit Button */}
            <div className="w-full h-[60px] bg-sats-orange-500/10 border border-sats-orange-500/15 rounded-xl" />
          </div>
        </div>

        {/* ─── WITHDRAWAL HISTORY SKELETON ─── */}
        <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 md:p-8 shadow-xl w-full">
          <div className="flex items-center gap-3 mb-6 border-b border-[#1a1a1a] pb-5">
            <div className="w-10 h-10 rounded-xl bg-[#111] border border-[#2a2a2a] shrink-0" />
            <div className="h-7 w-36 bg-white/5 rounded-lg" />
          </div>

          {/* Added the min-h-[300px] and pr-2 to perfectly match the scrollbar spacing of the loaded UI! */}
          <div className="min-h-[300px] overflow-hidden pr-2 w-full">
            <div className="space-y-4 w-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-4 w-full">
                  <div className="flex justify-between items-start mb-3 w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 shrink-0" />
                      <div className="flex flex-col gap-1">
                        <div className="h-[16px] w-20 bg-white/10 rounded" />
                        <div className="h-[14px] w-28 bg-white/5 rounded" />
                      </div>
                    </div>
                    <div className="h-[28px] w-24 bg-white/5 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
export default function UserWithdrawalsPage() {
  const [balances, setBalances] = useState<Balances | null>(null);
  const [history, setHistory] = useState<Withdrawal[]>([]);
  const [minWithdrawal, setMinWithdrawal] = useState<number>(25000); // Default fallback
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [amount, setAmount] = useState<string>('');
  const [invoice, setInvoice] = useState<string>('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 1. FETCH DATA (Balances, History, Settings)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
        const headers = { 'Authorization': `Bearer ${token}` };
        let activeTier: string | undefined;

        // Fetch user dashboard data (for balances), withdrawal history, and platform settings
        const [dashRes, historyRes, settingsRes] = await Promise.all([
          fetch(`${API_URL}/users/dashboard`, { headers }),
          fetch(`${API_URL}/users/withdrawals`, { headers }), // Assuming you have this route!
          fetch(`${API_URL}/users/settings`, { headers })     // Assuming public settings route
        ]);

        if (dashRes.ok) {
          const dashData = await dashRes.json();
          setBalances(dashData.balances);
          activeTier = dashData?.gamification?.activeTier;
        }
        
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setHistory(historyData);
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          const tierMin = activeTier
            ? settingsData?.tierMinWithdrawalMatrix?.[activeTier]
            : undefined;
          if (tierMin !== undefined && tierMin !== null) setMinWithdrawal(Number(tierMin));
          else setError('Minimum withdrawal is not configured for your tier. Please contact admin.');
        }

      } catch (err) {
        console.error("Failed to load withdrawal data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. HANDLE WITHDRAWAL REQUEST
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const withdrawAmount = Number(amount);

    // Frontend Validations
    if (!balances) return;
    if (withdrawAmount < minWithdrawal) return setError(`Minimum withdrawal is ${minWithdrawal.toLocaleString()} Sats.`);
    if (withdrawAmount > balances.available) return setError("You cannot withdraw more than your available balance.");
    if (!invoice.trim().toLowerCase().startsWith('lnbc')) return setError("Please enter a valid Lightning Network invoice (starts with 'lnbc').");

    setIsSubmitting(true);

    try {
      const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
      const res = await fetch(`${API_URL}/users/withdrawals`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          amountSats: withdrawAmount,
          lightningInvoice: invoice.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to process withdrawal.");

      setSuccess("Withdrawal requested successfully! It is now pending admin review.");
      setAmount('');
      setInvoice('');
      
      // Optimistically update the UI
      setBalances(prev => prev ? { ...prev, available: prev.available - withdrawAmount } : null);
      setHistory(prev => [data.withdrawal, ...prev]); // Assuming backend returns the new withdrawal

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusUI = (status: string) => {
    switch (status) {
      case 'PAID': return { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: <CheckCircle2 className="w-4 h-4" /> };
      case 'REJECTED': return { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: <XCircle className="w-4 h-4" /> };
      case 'PENDING': default: return { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: <Clock className="w-4 h-4" /> };
    }
  };

  if (isLoading) {
      return <WithdrawalSkeleton/>;
  
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 p-4 md:p-6 lg:p-8">
      
      {/* ─── PAGE HEADER ─── */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Withdraw Funds</h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1.5 font-medium">
          Cash out your hard-earned Sats directly to your Lightning wallet ⚡
        </p>
      </div>

      {/* ─── LIQUIDITY OVERVIEW ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(249,115,22,0.1)] relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10"><Zap className="w-32 h-32 text-sats-orange-500" /></div>
          <p className="text-xs font-black uppercase tracking-widest text-sats-orange-400 mb-2">Available to Withdraw</p>
          <h3 className="text-4xl font-black text-sats-orange-500">{balances?.available.toLocaleString() || 0}</h3>
          <p className="text-sm font-bold text-sats-orange-500/60 mt-1">Sats</p>
        </div>
        
        <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-500" />
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Pending AI Review</p>
          </div>
          <h3 className="text-3xl font-black text-white">{balances?.pending.toLocaleString() || 0}</h3>
        </div>

        <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Security Lock (15D)</p>
          </div>
          <h3 className="text-3xl font-black text-white">{balances?.locked.toLocaleString() || 0}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* ─── WITHDRAWAL FORM ─── */}
        <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 md:p-8 shadow-xl relative z-10">
          <div className="flex items-center gap-3 mb-6 border-b border-[#1a1a1a] pb-5">
            <div className="p-2.5 bg-[#111] border border-[#2a2a2a] rounded-xl shadow-inner">
              <Wallet className="w-5 h-5 text-sats-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Request Payout</h2>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-6">
            
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm font-medium">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3 text-green-400 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{success}</p>
              </div>
            )}

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Amount (Sats)</label>
                <button type="button" onClick={() => setAmount(String(balances?.available || 0))} className="text-xs font-bold text-sats-orange-500 hover:underline">MAX</button>
              </div>
              <div className="relative">
                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text"
                  inputMode='numeric' 
                  min={minWithdrawal}
                  max={balances?.available || 0}
                  value={amount}
                  onChange={(e) =>{
                    const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                     setAmount(onlyNums)}}
                  placeholder={`Min. ${minWithdrawal.toLocaleString()}`}
                  required
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-lg font-black px-4 py-4 pl-12 rounded-xl outline-none focus:border-sats-orange-500/50 focus:bg-[#111] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Lightning Invoice</label>
              <textarea 
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
                placeholder="lnbc..."
                required
                rows={4}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm font-mono px-4 py-4 rounded-xl outline-none focus:border-sats-orange-500/50 focus:bg-[#111] transition-all resize-none"
              />
              <p className="text-[10px] text-gray-500 mt-2 font-medium">
                Ensure your invoice amount matches the requested withdrawal amount to prevent payout failures.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || balances?.available === 0}
              className="w-full flex items-center justify-center gap-2 bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-black text-lg py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(249,115,22,0.2)] active:scale-95"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowUpRight className="w-6 h-6" />}
              {isSubmitting ? 'Processing...' : 'Withdraw to Wallet'}
            </button>
          </form>
        </div>

        {/* ─── WITHDRAWAL HISTORY ─── */}
        <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6 border-b border-[#1a1a1a] pb-5">
            <div className="p-2.5 bg-[#111] border border-[#2a2a2a] rounded-xl shadow-inner">
              <History className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Payout History</h2>
          </div>

          <div className="min-h-[300px] max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item) => {
                  const ui = getStatusUI(item.status);
                  return (
                    <div key={item.id} className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-4 hover:border-[#2a2a2a] transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${ui.bg} ${ui.color}`}>
                            {ui.icon}
                          </div>
                          <div>
                            <p className={`text-xs font-black uppercase tracking-wider ${ui.color}`}>
                              {item.status}
                            </p>
                            <p className="text-[10px] text-gray-500 font-medium">
                              {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-black text-white">{item.amountSats.toLocaleString()} Sats</p>
                      </div>
                      
                      {item.paymentProof && (
                        <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Payment Preimage / Hash</p>
                          <p className="text-xs text-green-400 font-mono break-all bg-[#0a0a0a] p-2 rounded-lg border border-[#1a1a1a]">
                            {item.paymentProof}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 opacity-60">
                <Wallet className="w-12 h-12 text-gray-600 mb-4" />
                <p className="text-lg font-bold text-white mb-1">No withdrawals yet</p>
                <p className="text-sm text-gray-400">Complete tasks and grow your balance to request your first payout.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
