'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchHighRiskQueue, fetchUserFraudReport, clearSelectedReport } from '@/features/admin/adminFraudSlice';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, Search, 
  Eye, X, Activity, UserX, Fingerprint, Ban, CheckCircle2 
} from 'lucide-react';

export default function AdminFraudPage() {
  const dispatch = useAppDispatch();
  const { highRiskQueue, selectedUserReport, isQueueLoading, isReportLoading, error } = useAppSelector((state) => state.adminFraud);
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchHighRiskQueue());
  }, [dispatch]);

  const filteredQueue = highRiskQueue.filter(report => 
    report.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.userId.includes(searchTerm)
  );

  const handleViewReport = (userId: string) => {
    dispatch(fetchUserFraudReport(userId));
  };

  const handleCloseModal = () => {
    dispatch(clearSelectedReport());
  };

  // --- UI Helpers ---
  const getRiskColor = (level: string) => {
    if (level === 'CRITICAL') return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (level === 'MODERATE') return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    return 'text-green-500 bg-green-500/10 border-green-500/20';
  };

  // --- Loading State ---
  if (isQueueLoading && highRiskQueue.length === 0) {
    return (
      <div className="min-h-screen bg-[#020202] p-4 md:p-8 animate-pulse">
        <div className="max-w-[1200px] mx-auto">
          <div className="h-10 w-64 bg-[#1a1a1a] rounded-xl mb-8" />
          <div className="h-96 w-full bg-[#050505] border border-[#1a1a1a] rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6 md:gap-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                <ShieldAlert className="w-6 h-6 text-red-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Security & Fraud</h1>
            </div>
            <p className="text-gray-400 text-sm mt-1">Review accounts flagged for suspicious activity or withdrawal risks.</p>
          </div>
          
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Email or User ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all shadow-inner"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400 text-sm font-semibold">
            <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        {/* DATA TABLE */}
        <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#0a0a0a]/50">
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Account</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Risk Level</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Threat Score</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Flags Triggered</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-[#1a1a1a]">
                {filteredQueue.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <ShieldCheck className="w-12 h-12 mb-4 text-green-500/50" />
                        <p className="font-bold text-lg text-white">System is Secure</p>
                        <p className="text-sm mt-1">No high-risk users are currently in the queue.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredQueue.map((report) => (
                    <tr key={report.userId} className="hover:bg-[#0a0a0a] transition-all">
                      
                      <td className="px-6 py-5 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#111] border border-[#2a2a2a] flex items-center justify-center shrink-0">
                            <UserX className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{report.email}</p>
                            <p className="text-[10px] font-mono text-gray-400 truncate mt-0.5">{report.userId}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-middle text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${getRiskColor(report.riskLevel || 'MODERATE')}`}>
                          {report?.riskLevel || 'MODERATE'}
                        </span>
                      </td>

                      <td className="px-6 py-5 align-middle text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Activity className={`w-4 h-4 ${report.riskScore >= 75 ? 'text-red-500' : 'text-yellow-500'}`} />
                          <span className={`font-black ${report.riskScore >= 75 ? 'text-red-500' : 'text-yellow-500'}`}>
                            {report.riskScore}/100
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-middle text-center">
                        <span className="text-sm font-bold text-gray-300">
                          {report.flags.length} Red Flags
                        </span>
                      </td>

                      <td className="px-6 py-5 align-middle text-right">
                        <button 
                          onClick={() => handleViewReport(report.userId)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#111] hover:bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs font-bold text-white transition-all active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" /> Review Report
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 🚀 MODAL: Detailed Fraud Report */}
      {selectedUserReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleCloseModal} />

          <div className="relative bg-[#050505] border border-red-500/20 rounded-3xl w-full max-w-xl shadow-[0_0_50px_rgba(239,68,68,0.15)] animate-in zoom-in-95 duration-200">
            
            <div className="border-b border-[#1a1a1a] p-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-red-500" /> Threat Analysis
                </h2>
                <p className="text-sm text-gray-400 mt-1">Target: <span className="font-mono text-gray-300">{selectedUserReport.email}</span></p>
              </div>
              <button onClick={handleCloseModal} className="p-2 rounded-full bg-[#111] text-gray-400 hover:text-white border border-[#2a2a2a]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Score Header */}
              <div className="flex items-center justify-between bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-2xl">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Risk Score</span>
                <span className={`text-2xl font-black ${selectedUserReport.riskScore >= 75 ? 'text-red-500' : 'text-yellow-500'}`}>
                  {selectedUserReport.riskScore}/100
                </span>
              </div>

              {/* The Flags */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Security Triggers Detected</h3>
                {isReportLoading ? (
                  <div className="h-20 bg-[#111] rounded-xl animate-pulse" />
                ) : (
                  <div className="space-y-3">
                    {selectedUserReport.flags.map((flag, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 p-3.5 rounded-xl">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-200 font-medium leading-relaxed">{flag}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Admin Actions */}
            <div className="p-6 border-t border-[#1a1a1a] bg-[#0a0a0a] rounded-b-3xl flex items-center justify-end gap-3">
              <button 
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-all"
              >
                Close
              </button>
              
              {/* NOTE: These buttons are UI placeholders for your future Ban/Clear functionality */}
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#111] border border-green-500/20 text-green-500 hover:bg-green-500/10 transition-all">
                <CheckCircle2 className="w-4 h-4" /> Clear User
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">
                <Ban className="w-4 h-4" /> Suspend Account
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}