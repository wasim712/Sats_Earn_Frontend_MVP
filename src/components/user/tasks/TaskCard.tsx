// 'use client';

// import React from 'react';
// import { AlertTriangle, CheckCircle2, ChevronRight, ExternalLink, Link as LinkIcon, RotateCcw, Upload, X } from 'lucide-react';
// import { PROOF_META } from './taskPage.helpers';
// import type { ProofMeta, UserTaskPageTask, UserTaskResult, UserTaskStatus } from './taskPage.types';

// function inferTaskPlatform(task: UserTaskPageTask) {
//   const rawPlatform = String(task.requiredPlatform || '').trim().toUpperCase();
//   const url = String(task.targetUrl || '').toLowerCase();

//   if (rawPlatform && rawPlatform !== 'NONE') {
//     const labels: Record<string, string> = {
//       TWITTER: 'Twitter',
//       X: 'X',
//       LINKEDIN: 'LinkedIn',
//       INSTAGRAM: 'Instagram',
//       TELEGRAM: 'Telegram',
//       FACEBOOK: 'Facebook',
//       YOUTUBE: 'YouTube',
//       DISCORD: 'Discord',
//       TIKTOK: 'TikTok',
//       REDDIT: 'Reddit',
//       DESKTOP: 'Desktop',
//       ANDROID: 'Android',
//       IOS: 'iOS',
//     };

//     return labels[rawPlatform] || rawPlatform.charAt(0) + rawPlatform.slice(1).toLowerCase();
//   }

//   if (url.includes('linkedin.com')) return 'LinkedIn';
//   if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
//   if (url.includes('instagram.com')) return 'Instagram';
//   if (url.includes('t.me') || url.includes('telegram.')) return 'Telegram';
//   if (url.includes('facebook.com')) return 'Facebook';
//   if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
//   if (url.includes('discord.com')) return 'Discord';
//   if (url.includes('tiktok.com')) return 'TikTok';
//   if (url.includes('reddit.com')) return 'Reddit';

//   return 'General Task';
// }

// function formatProofLabel(proofType: UserTaskPageTask['proofType']) {
//   const labels: Record<UserTaskPageTask['proofType'], string> = {
//     SCREENSHOT: 'Screenshot Proof',
//     URL: 'Link Proof',
//     TEXT_RESPONSE: 'Text Proof',
//     API_VERIFIED: 'Auto Verified',
//   };

//   return labels[proofType];
// }

// function ScreenshotInput({
//   taskId,
//   file,
//   onChange,
// }: {
//   taskId: string;
//   file: File | null;
//   onChange: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
// }) {
//   return (
//     <label className="group block cursor-pointer">
//       <div className="relative flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-[#1a1a1a] bg-[#0d0d0d] transition-all duration-200 group-hover:border-sats-orange-500/30 group-hover:bg-sats-orange-500/[0.03]">
//         <input type="file" accept="image/*" className="hidden" onChange={(e) => onChange(taskId, e)} />
//         <div className="w-10 h-10 rounded-xl bg-sats-orange-500/8 border border-sats-orange-500/15 flex items-center justify-center mb-3">
//           <Upload className="w-4 h-4 text-sats-orange-500" />
//         </div>
//         <p className="text-sm font-medium text-white/70">{file ? file.name : 'Click to upload screenshot'}</p>
//         <p className="text-[11px] text-white/20 mt-1">PNG, JPG up to 5MB</p>
//       </div>
//     </label>
//   );
// }

// function StatusBadge({ status }: { status: UserTaskStatus }) {
//   const config = {
//     completed: { cls: 'bg-green-500/10 border-green-500/25 text-green-400', dot: 'bg-green-400', label: 'Completed' },
//     pending_review: { cls: 'bg-amber-500/10 border-amber-500/25 text-amber-400', dot: 'bg-amber-400', label: 'In Review' },
//     rejected: { cls: 'bg-red-500/10 border-red-500/25 text-red-400', dot: 'bg-red-400', label: 'Rejected' },
//     idle: { cls: 'bg-white/5 border-white/8 text-white/30', dot: 'bg-white/20', label: 'Pending' },
//   }[status];

//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.cls}`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'pending_review' ? 'animate-pulse' : ''}`} />
//       {config.label}
//     </span>
//   );
// }

// function ProofInputZone({
//   taskStatus,
//   task,
//   meta,
//   selectedFile,
//   textInput,
//   result,
//   isSubmitting,
//   isSubmitDisabled,
//   onFileChange,
//   onTextChange,
//   onSubmit,
// }: {
//   taskStatus: UserTaskStatus;
//   task: UserTaskPageTask;
//   meta: ProofMeta;
//   selectedFile: File | null;
//   textInput: string;
//   result: UserTaskResult | null;
//   isSubmitting: boolean;
//   isSubmitDisabled: boolean;
//   onFileChange: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
//   onTextChange: (id: string, val: string) => void;
//   onSubmit: (id: string, proofType: string) => void;
// }) {
//   return (
//     <div className="space-y-3">
//       <p className="text-[11px] text-white/20 flex items-center gap-1.5">
//         <span className="text-white/15">{meta.icon}</span>
//         {meta.hint}
//       </p>

//       {task.proofType === 'SCREENSHOT' && <ScreenshotInput taskId={task.id} file={selectedFile} onChange={onFileChange} />}

//       {task.proofType === 'URL' && (
//         <div className="relative">
//           <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"><LinkIcon className="w-4 h-4" /></div>
//           <input type="url" placeholder="https://twitter.com/..." value={textInput} onChange={(e) => onTextChange(task.id, e.target.value)} className="w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-sats-orange-500/35 hover:border-white/8 transition-colors" />
//         </div>
//       )}

//       {task.proofType === 'TEXT_RESPONSE' && (
//         <textarea placeholder="Describe what you did to complete this task..." value={textInput} onChange={(e) => onTextChange(task.id, e.target.value)} rows={3} className="w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-sats-orange-500/35 hover:border-white/8 transition-colors resize-none" />
//       )}

//       {task.proofType === 'API_VERIFIED' && (
//         <div className="flex items-start gap-3 p-4 rounded-xl bg-[#0d0d0d] border border-[#1a1a1a]">
//           <div className="shrink-0 w-8 h-8 rounded-xl bg-sats-orange-500/8 border border-sats-orange-500/15 flex items-center justify-center">{meta.icon}</div>
//           <div>
//             <p className="text-sm font-semibold text-white/80">Automatic verification enabled</p>
//             <p className="text-xs text-white/35 mt-1">Submit this step and our system will verify completion automatically.</p>
//           </div>
//         </div>
//       )}

//       {result?.success === false && (
//         <div className="flex items-start gap-2.5 p-3 bg-red-500/6 border border-red-500/10 rounded-xl">
//           <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
//           <p className="text-xs text-red-400/80 leading-relaxed">{result.message}</p>
//         </div>
//       )}

//       <button onClick={() => onSubmit(task.id, task.proofType)} disabled={isSubmitDisabled} className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.98] ${isSubmitDisabled ? 'bg-[#111] text-white/15 border border-[#1a1a1a] cursor-not-allowed' : 'bg-sats-orange-500 text-black hover:bg-sats-orange-500/90 shadow-[0_0_24px_rgba(238,139,18,0.2)]'}`}>
//         {isSubmitting ? (
//           <>
//             <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
//             Submitting...
//           </>
//         ) : (
//           <>
//             {taskStatus === 'rejected' ? 'Resubmit Proof' : 'Submit Proof'}
//             <ChevronRight className="w-4 h-4 opacity-60" />
//           </>
//         )}
//       </button>
//     </div>
//   );
// }

// export function TaskCard({
//   task,
//   index,
//   taskStatus,
//   result,
//   isSubmitting,
//   selectedFile,
//   textInput,
//   onFileChange,
//   onTextChange,
//   onSubmit,
// }: {
//   task: UserTaskPageTask;
//   index: number;
//   taskStatus: UserTaskStatus;
//   result: UserTaskResult | null;
//   isSubmitting: boolean;
//   selectedFile: File | null;
//   textInput: string;
//   onFileChange: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
//   onTextChange: (id: string, val: string) => void;
//   onSubmit: (id: string, proofType: string) => void;
// }) {
//   const meta = PROOF_META[task.proofType] ?? PROOF_META.TEXT_RESPONSE;
//   const taskPlatform = inferTaskPlatform(task);
//   const proofLabel = formatProofLabel(task.proofType);
//   const isCompleted = taskStatus === 'completed' || taskStatus === 'pending_review';
//   const isSubmitDisabled = isSubmitting || isCompleted || (task.proofType === 'SCREENSHOT' && !selectedFile) || ((task.proofType === 'URL' || task.proofType === 'TEXT_RESPONSE') && !textInput.trim());

//   return (
//     <div className={`relative bg-[#080808] border rounded-2xl overflow-hidden transition-all duration-300 ${isCompleted ? 'border-green-500/15' : result?.success === false ? 'border-red-500/15' : 'border-[#1a1a1a]'}`}>
//       <div className={`absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 ${isCompleted ? 'bg-green-500/50' : result?.success === false ? 'bg-red-500/50' : 'bg-sats-orange-500/20'}`} />
//       <div className="pl-6 pr-5 pt-6 pb-6 md:pl-7">
//         <div className="flex items-start justify-between gap-4 mb-5">
//           <div className="flex items-start gap-4">
//             <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black border mt-0.5 transition-all duration-300 ${isCompleted ? 'bg-green-500/10 border-green-500/25 text-green-400' : 'bg-[#111] border-[#1e1e1e] text-white/20'}`}>{isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}</div>
//             <div>
//               <h3 className="text-base font-bold text-white leading-snug mb-1">{task.title}</h3>
//               <p className="text-sm text-white/35 leading-relaxed">{task.description}</p>
//             </div>
//           </div>
//           <div className="hidden sm:block shrink-0"><StatusBadge status={taskStatus} /></div>
//         </div>

//         <div className="flex flex-wrap items-center gap-2 mb-4 pl-12">
//           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/6 text-[10px] font-bold uppercase tracking-wider text-white/50">{taskPlatform}</span>
//           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sats-orange-500/5 border border-sats-orange-500/15 text-[10px] font-bold uppercase tracking-wider text-sats-orange-500/70">{meta.icon}{proofLabel}</span>
//           <span className="sm:hidden"><StatusBadge status={taskStatus} /></span>
//         </div>

//         {task.targetUrl && (
//           <div className="pl-12 mb-5">
//             <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] group/link">
//               <div className="shrink-0 w-6 h-6 rounded-lg bg-sats-orange-500/8 border border-sats-orange-500/15 flex items-center justify-center"><span className="text-[9px] font-black text-sats-orange-500/70">1</span></div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-[10px] font-bold uppercase tracking-wider text-white/25 mb-0.5">Step 1 • Open on {taskPlatform}</p>
//                 <p className="text-xs text-white/40 truncate">{task.targetUrl}</p>
//               </div>
//               <a href={task.targetUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sats-orange-500/8 border border-sats-orange-500/20 text-sats-orange-500 text-xs font-bold hover:bg-sats-orange-500/15 hover:border-sats-orange-500/35 transition-all"><span> Open </span><ExternalLink className="w-3 h-3" /></a>
//             </div>
//           </div>
//         )}

//         <div className="pl-0 sm:pl-12">
//           {isCompleted ? (
//             <div className={`flex items-start gap-3 p-4 rounded-xl border ${taskStatus === 'completed' ? 'bg-green-500/5 border-green-500/15' : 'bg-amber-500/5 border-amber-500/15'}`}>
//               <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${taskStatus === 'completed' ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>{taskStatus === 'completed' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <RotateCcw className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />}</div>
//               <div>
//                 <p className={`text-sm font-semibold mb-0.5 ${taskStatus === 'completed' ? 'text-green-300' : 'text-amber-300'}`}>{taskStatus === 'completed' ? 'Task Completed' : 'Submission Under Review'}</p>
//                 <p className={`text-xs ${taskStatus === 'completed' ? 'text-green-400/50' : 'text-amber-400/50'}`}>{taskStatus === 'completed' ? 'Your proof was approved. Sats have been credited.' : 'Our team is reviewing your submission. This usually takes a few hours.'}</p>
//               </div>
//             </div>
//           ) : taskStatus === 'rejected' ? (
//             <div className="space-y-4">
//               <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/15">
//                 <div className="shrink-0 w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center"><X className="w-4 h-4 text-red-400" /></div>
//                 <div>
//                   <p className="text-sm font-semibold text-red-300 mb-0.5">Submission Rejected</p>
//                   <p className="text-xs text-red-400/50">Your previous submission was rejected. Please re-submit with valid proof.</p>
//                 </div>
//               </div>
//               <ProofInputZone taskStatus={taskStatus} task={task} meta={meta} selectedFile={selectedFile} textInput={textInput} result={result} isSubmitting={isSubmitting} isSubmitDisabled={isSubmitDisabled} onFileChange={onFileChange} onTextChange={onTextChange} onSubmit={onSubmit} />
//             </div>
//           ) : (
//             <ProofInputZone taskStatus={taskStatus} task={task} meta={meta} selectedFile={selectedFile} textInput={textInput} result={result} isSubmitting={isSubmitting} isSubmitDisabled={isSubmitDisabled} onFileChange={onFileChange} onTextChange={onTextChange} onSubmit={onSubmit} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, ChevronRight, ExternalLink, Link as LinkIcon, RotateCcw, Upload, X, Zap } from 'lucide-react';
import { PROOF_META } from './taskPage.helpers';
import type { ProofMeta, UserTaskPageTask, UserTaskResult, UserTaskStatus } from './taskPage.types';

function inferTaskPlatform(task: UserTaskPageTask) {
  const rawPlatform = String(task.requiredPlatform || '').trim().toUpperCase();
  const url = String(task.targetUrl || '').toLowerCase();

  if (rawPlatform && rawPlatform !== 'NONE') {
    const labels: Record<string, string> = {
      TWITTER: 'Twitter',
      X: 'X',
      LINKEDIN: 'LinkedIn',
      INSTAGRAM: 'Instagram',
      TELEGRAM: 'Telegram',
      FACEBOOK: 'Facebook',
      YOUTUBE: 'YouTube',
      DISCORD: 'Discord',
      TIKTOK: 'TikTok',
      REDDIT: 'Reddit',
      DESKTOP: 'Desktop',
      ANDROID: 'Android',
      IOS: 'iOS',
    };

    return labels[rawPlatform] || rawPlatform.charAt(0) + rawPlatform.slice(1).toLowerCase();
  }

  if (url.includes('linkedin.com')) return 'LinkedIn';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('t.me') || url.includes('telegram.')) return 'Telegram';
  if (url.includes('facebook.com')) return 'Facebook';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('discord.com')) return 'Discord';
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('reddit.com')) return 'Reddit';

  return 'General Task';
}

function formatProofLabel(proofType: UserTaskPageTask['proofType']) {
  const labels: Record<UserTaskPageTask['proofType'], string> = {
    SCREENSHOT: 'Screenshot Proof',
    URL: 'Link Proof',
    TEXT_RESPONSE: 'Text Proof',
    API_VERIFIED: 'Auto Verified',
  };

  return labels[proofType];
}

function ScreenshotInput({
  taskId,
  file,
  onChange,
}: {
  taskId: string;
  file: File | null;
  onChange: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="group block cursor-pointer outline-none">
      <div className="relative flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed border-[#2a2a2a] bg-[#0c0c0c] transition-all duration-300 ease-out group-hover:border-sats-orange-500/50 group-hover:bg-sats-orange-500/[0.04] group-hover:shadow-[0_0_30px_rgba(238,139,18,0.05)]">
        <input type="file" accept="image/*" className="hidden" onChange={(e) => onChange(taskId, e)} />
        
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#111] to-[#1a1a1a] border border-[#222] shadow-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:border-sats-orange-500/30 group-active:scale-95">
          <Upload className="w-5 h-5 text-white/50 group-hover:text-sats-orange-500 transition-colors duration-300" />
        </div>
        
        <p className="text-sm font-semibold text-white/80 transition-colors duration-300 group-hover:text-white">
          {file ? file.name : 'Click to upload screenshot'}
        </p>
        <p className="text-xs text-white/30 mt-1.5 font-medium">PNG, JPG up to 5MB</p>
      </div>
    </label>
  );
}

function StatusBadge({ status }: { status: UserTaskStatus }) {
  const config = {
    completed: { cls: 'bg-green-500/10 border-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]', dot: 'bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]', label: 'Completed' },
    pending_review: { cls: 'bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]', dot: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]', label: 'In Review' },
    rejected: { cls: 'bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]', dot: 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]', label: 'Rejected' },
    idle: { cls: 'bg-white/5 border-white/10 text-white/40 backdrop-blur-sm', dot: 'bg-white/30', label: 'Pending' },
  }[status];

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border backdrop-blur-md transition-all duration-300 ${config.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'pending_review' ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  );
}

function ProofInputZone({
  taskStatus,
  task,
  meta,
  selectedFile,
  textInput,
  result,
  isSubmitting,
  isSubmitDisabled,
  onFileChange,
  onTextChange,
  onSubmit,
}: {
  taskStatus: UserTaskStatus;
  task: UserTaskPageTask;
  meta: ProofMeta;
  selectedFile: File | null;
  textInput: string;
  result: UserTaskResult | null;
  isSubmitting: boolean;
  isSubmitDisabled: boolean;
  onFileChange: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (id: string, val: string) => void;
  onSubmit: (id: string, proofType: string) => void;
}) {
  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2 text-xs font-medium text-white/40 bg-white/[0.02] border border-white/[0.05] w-fit px-3 py-1.5 rounded-lg">
        <span className="text-white/30">{meta.icon}</span>
        {meta.hint}
      </div>

      {task.proofType === 'SCREENSHOT' && <ScreenshotInput taskId={task.id} file={selectedFile} onChange={onFileChange} />}

      {task.proofType === 'URL' && (
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none transition-colors duration-300 group-focus-within:text-sats-orange-500">
            <LinkIcon className="w-4 h-4" />
          </div>
          <input 
            type="url" 
            placeholder="https://twitter.com/..." 
            value={textInput} 
            onChange={(e) => onTextChange(task.id, e.target.value)} 
            className="w-full bg-[#0c0c0c] border border-[#222] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-sats-orange-500/50 focus:ring-4 focus:ring-sats-orange-500/10 hover:border-[#333] transition-all duration-300 shadow-inner" 
          />
        </div>
      )}

      {task.proofType === 'TEXT_RESPONSE' && (
        <textarea 
          placeholder="Describe what you did to complete this task..." 
          value={textInput} 
          onChange={(e) => onTextChange(task.id, e.target.value)} 
          rows={3} 
          className="w-full bg-[#0c0c0c] border border-[#222] rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-sats-orange-500/50 focus:ring-4 focus:ring-sats-orange-500/10 hover:border-[#333] transition-all duration-300 resize-none shadow-inner leading-relaxed" 
        />
      )}

      {task.proofType === 'API_VERIFIED' && (
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#0c0c0c] to-[#080808] border border-[#1f1f1f] shadow-lg">
          <div className="shrink-0 w-10 h-10 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/20 flex items-center justify-center text-sats-orange-500">
            {meta.icon}
          </div>
          <div>
            <p className="text-sm font-bold text-white/90 tracking-wide">Automatic verification enabled</p>
            <p className="text-sm text-white/40 mt-1 leading-relaxed">Submit this step and our system will verify completion securely in the background.</p>
          </div>
        </div>
      )}

      {result?.success === false && (
        <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.05)] animate-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-400/90 leading-relaxed">{result.message}</p>
        </div>
      )}

      <button 
        onClick={() => onSubmit(task.id, task.proofType)} 
        disabled={isSubmitDisabled} 
        className={`relative overflow-hidden w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
          isSubmitDisabled 
            ? 'bg-[#111] text-white/20 border border-[#222] cursor-not-allowed' 
            : 'bg-gradient-to-r from-sats-orange-500 to-[#ff9e2a] text-black hover:shadow-[0_0_30px_rgba(238,139,18,0.3)] hover:-translate-y-0.5 active:scale-[0.98]'
        }`}
      >
        {isSubmitting ? (
          <>
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing Submission...
          </>
        ) : (
          <>
            <span className="tracking-wide">{taskStatus === 'rejected' ? 'Resubmit Proof' : 'Submit Proof'}</span>
            <ChevronRight className="w-5 h-5 opacity-70" />
            
            {/* Glossy overlay effect for active button */}
            {!isSubmitDisabled && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            )}
          </>
        )}
      </button>
    </div>
  );
}

export function TaskCard({
  task,
  index,
  taskStatus,
  result,
  isSubmitting,
  selectedFile,
  textInput,
  onFileChange,
  onTextChange,
  onSubmit,
}: {
  task: UserTaskPageTask;
  index: number;
  taskStatus: UserTaskStatus;
  result: UserTaskResult | null;
  isSubmitting: boolean;
  selectedFile: File | null;
  textInput: string;
  onFileChange: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (id: string, val: string) => void;
  onSubmit: (id: string, proofType: string) => void;
}) {
  const meta = PROOF_META[task.proofType] ?? PROOF_META.TEXT_RESPONSE;
  const taskPlatform = inferTaskPlatform(task);
  const proofLabel = formatProofLabel(task.proofType);
  const isCompleted = taskStatus === 'completed' || taskStatus === 'pending_review';
  const isSubmitDisabled = isSubmitting || isCompleted || (task.proofType === 'SCREENSHOT' && !selectedFile) || ((task.proofType === 'URL' || task.proofType === 'TEXT_RESPONSE') && !textInput.trim());

  return (
    <div className={`relative bg-gradient-to-b from-[#0f0f0f] to-[#080808] rounded-3xl overflow-hidden transition-all duration-500 shadow-xl ${
      isCompleted 
        ? 'border border-green-500/20 shadow-[0_8px_30px_rgba(34,197,94,0.04)] hover:border-green-500/30' 
        : result?.success === false 
          ? 'border border-red-500/20 hover:border-red-500/30' 
          : 'border border-[#1a1a1a] hover:border-[#2a2a2a] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
    }`}>
      
      {/* Accent Line Indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500 ${
        isCompleted 
          ? 'bg-gradient-to-b from-green-400 to-green-600 shadow-[0_0_15px_rgba(34,197,94,0.5)]' 
          : result?.success === false 
            ? 'bg-gradient-to-b from-red-400 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
            : 'bg-gradient-to-b from-sats-orange-400 to-sats-orange-600 opacity-50'
      }`} />

      <div className="p-6 md:p-8 pl-8 md:pl-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-6">
          <div className="flex items-start gap-4 md:gap-5">
            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border transition-all duration-500 shadow-sm ${
              isCompleted 
                ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)]' 
                : 'bg-gradient-to-tr from-[#111] to-[#1a1a1a] border-[#2a2a2a] text-white/50'
            }`}>
              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
            </div>
            
            <div className="pt-0.5">
              <h3 className="text-lg md:text-xl font-bold text-white/95 leading-tight tracking-wide mb-2">{task.title}</h3>
              <p className="text-sm md:text-base text-white/40 leading-relaxed max-w-2xl">{task.description}</p>
            </div>
          </div>
          <div className="hidden sm:block shrink-0 pt-1">
            <StatusBadge status={taskStatus} />
          </div>
        </div>

        {/* Badges Section */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8 md:pl-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.08] text-[11px] font-bold uppercase tracking-wider text-white/60 shadow-sm">
            {taskPlatform}
          </span>
          {typeof task.taskRewardSats === 'number' && task.taskRewardSats > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-[11px] font-bold uppercase tracking-wider text-yellow-300 shadow-sm">
              <Zap className="w-3.5 h-3.5" />
              {task.taskRewardSats.toLocaleString()} Sats
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sats-orange-500/10 border border-sats-orange-500/20 text-[11px] font-bold uppercase tracking-wider text-sats-orange-400 shadow-sm">
            <span className="opacity-80">{meta.icon}</span> {proofLabel}
          </span>
          <span className="sm:hidden">
            <StatusBadge status={taskStatus} />
          </span>
        </div>

        {/* Target URL Section */}
        {task.targetUrl && (
          <div className="md:pl-16 mb-8">
            <div className="flex items-center gap-4 p-4 md:p-5 rounded-2xl bg-black/40 border border-[#1f1f1f] group/link hover:border-[#2f2f2f] transition-all duration-300">
              <div className="shrink-0 w-8 h-8 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/20 flex items-center justify-center">
                <span className="text-xs font-black text-sats-orange-500">1</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-1">Step 1 • Open on {taskPlatform}</p>
                <p className="text-sm font-medium text-white/60 truncate group-hover/link:text-white/80 transition-colors duration-300">{task.targetUrl}</p>
              </div>
              <a 
                href={task.targetUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={(e) => e.stopPropagation()} 
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/20 text-sats-orange-400 text-xs font-bold uppercase tracking-wide hover:bg-sats-orange-500/20 hover:border-sats-orange-500/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Open</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Action/Proof Section */}
        <div className="md:pl-16">
          {isCompleted ? (
            <div className={`flex items-start gap-4 p-5 rounded-2xl border backdrop-blur-sm shadow-lg ${
              taskStatus === 'completed' 
                ? 'bg-green-500/5 border-green-500/20' 
                : 'bg-amber-500/5 border-amber-500/20'
            }`}>
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                taskStatus === 'completed' ? 'bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
              }`}>
                {taskStatus === 'completed' 
                  ? <CheckCircle2 className="w-5 h-5 text-green-400" /> 
                  : <RotateCcw className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                }
              </div>
              <div>
                <p className={`text-base font-bold mb-1 tracking-wide ${taskStatus === 'completed' ? 'text-green-400' : 'text-amber-400'}`}>
                  {taskStatus === 'completed' ? 'Task Completed' : 'Submission Under Review'}
                </p>
                <p className={`text-sm leading-relaxed ${taskStatus === 'completed' ? 'text-green-400/60' : 'text-amber-400/60'}`}>
                  {taskStatus === 'completed' 
                    ? 'Your proof was approved. Sats have been credited to your account.' 
                    : 'Our team is reviewing your submission. This usually takes a few hours.'
                  }
                </p>
              </div>
            </div>
          ) : taskStatus === 'rejected' ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-red-500/5 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                <div className="shrink-0 w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-base font-bold text-red-400 mb-1 tracking-wide">Submission Rejected</p>
                  <p className="text-sm text-red-400/60 leading-relaxed">Your previous submission was rejected. Please review the requirements and re-submit with valid proof.</p>
                </div>
              </div>
              <div className="pt-2">
                <ProofInputZone taskStatus={taskStatus} task={task} meta={meta} selectedFile={selectedFile} textInput={textInput} result={result} isSubmitting={isSubmitting} isSubmitDisabled={isSubmitDisabled} onFileChange={onFileChange} onTextChange={onTextChange} onSubmit={onSubmit} />
              </div>
            </div>
          ) : (
            <ProofInputZone taskStatus={taskStatus} task={task} meta={meta} selectedFile={selectedFile} textInput={textInput} result={result} isSubmitting={isSubmitting} isSubmitDisabled={isSubmitDisabled} onFileChange={onFileChange} onTextChange={onTextChange} onSubmit={onSubmit} />
          )}
        </div>
        
      </div>
    </div>
  );
}
