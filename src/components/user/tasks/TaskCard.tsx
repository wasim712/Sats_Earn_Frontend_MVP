'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, ChevronRight, ExternalLink, Link as LinkIcon, RotateCcw, Upload, X } from 'lucide-react';
import { PROOF_META } from './taskPage.helpers';
import type { ProofMeta, UserTaskPageTask, UserTaskResult, UserTaskStatus } from './taskPage.types';

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
    <label className="group block cursor-pointer">
      <div className="relative flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-[#1a1a1a] bg-[#0d0d0d] transition-all duration-200 group-hover:border-sats-orange-500/30 group-hover:bg-sats-orange-500/[0.03]">
        <input type="file" accept="image/*" className="hidden" onChange={(e) => onChange(taskId, e)} />
        <div className="w-10 h-10 rounded-xl bg-sats-orange-500/8 border border-sats-orange-500/15 flex items-center justify-center mb-3">
          <Upload className="w-4 h-4 text-sats-orange-500" />
        </div>
        <p className="text-sm font-medium text-white/70">{file ? file.name : 'Click to upload screenshot'}</p>
        <p className="text-[11px] text-white/20 mt-1">PNG, JPG up to 5MB</p>
      </div>
    </label>
  );
}

function StatusBadge({ status }: { status: UserTaskStatus }) {
  const config = {
    completed: { cls: 'bg-green-500/10 border-green-500/25 text-green-400', dot: 'bg-green-400', label: 'Completed' },
    pending_review: { cls: 'bg-amber-500/10 border-amber-500/25 text-amber-400', dot: 'bg-amber-400', label: 'In Review' },
    rejected: { cls: 'bg-red-500/10 border-red-500/25 text-red-400', dot: 'bg-red-400', label: 'Rejected' },
    idle: { cls: 'bg-white/5 border-white/8 text-white/30', dot: 'bg-white/20', label: 'Pending' },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.cls}`}>
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
    <div className="space-y-3">
      <p className="text-[11px] text-white/20 flex items-center gap-1.5">
        <span className="text-white/15">{meta.icon}</span>
        {meta.hint}
      </p>

      {task.proofType === 'SCREENSHOT' && <ScreenshotInput taskId={task.id} file={selectedFile} onChange={onFileChange} />}

      {task.proofType === 'URL' && (
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"><LinkIcon className="w-4 h-4" /></div>
          <input type="url" placeholder="https://twitter.com/..." value={textInput} onChange={(e) => onTextChange(task.id, e.target.value)} className="w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-sats-orange-500/35 hover:border-white/8 transition-colors" />
        </div>
      )}

      {task.proofType === 'TEXT_RESPONSE' && (
        <textarea placeholder="Describe what you did to complete this task..." value={textInput} onChange={(e) => onTextChange(task.id, e.target.value)} rows={3} className="w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-sats-orange-500/35 hover:border-white/8 transition-colors resize-none" />
      )}

      {task.proofType === 'API_VERIFIED' && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#0d0d0d] border border-[#1a1a1a]">
          <div className="shrink-0 w-8 h-8 rounded-xl bg-sats-orange-500/8 border border-sats-orange-500/15 flex items-center justify-center">{meta.icon}</div>
          <div>
            <p className="text-sm font-semibold text-white/80">Automatic verification enabled</p>
            <p className="text-xs text-white/35 mt-1">Submit this step and our system will verify completion automatically.</p>
          </div>
        </div>
      )}

      {result?.success === false && (
        <div className="flex items-start gap-2.5 p-3 bg-red-500/6 border border-red-500/10 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-400/80 leading-relaxed">{result.message}</p>
        </div>
      )}

      <button onClick={() => onSubmit(task.id, task.proofType)} disabled={isSubmitDisabled} className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.98] ${isSubmitDisabled ? 'bg-[#111] text-white/15 border border-[#1a1a1a] cursor-not-allowed' : 'bg-sats-orange-500 text-black hover:bg-sats-orange-500/90 shadow-[0_0_24px_rgba(238,139,18,0.2)]'}`}>
        {isSubmitting ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Submitting...
          </>
        ) : (
          <>
            {taskStatus === 'rejected' ? 'Resubmit Proof' : 'Submit Proof'}
            <ChevronRight className="w-4 h-4 opacity-60" />
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
  const isCompleted = taskStatus === 'completed' || taskStatus === 'pending_review';
  const isSubmitDisabled = isSubmitting || isCompleted || (task.proofType === 'SCREENSHOT' && !selectedFile) || ((task.proofType === 'URL' || task.proofType === 'TEXT_RESPONSE') && !textInput.trim());

  return (
    <div className={`relative bg-[#080808] border rounded-2xl overflow-hidden transition-all duration-300 ${isCompleted ? 'border-green-500/15' : result?.success === false ? 'border-red-500/15' : 'border-[#1a1a1a]'}`}>
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 ${isCompleted ? 'bg-green-500/50' : result?.success === false ? 'bg-red-500/50' : 'bg-sats-orange-500/20'}`} />
      <div className="pl-6 pr-5 pt-6 pb-6 md:pl-7">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-4">
            <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black border mt-0.5 transition-all duration-300 ${isCompleted ? 'bg-green-500/10 border-green-500/25 text-green-400' : 'bg-[#111] border-[#1e1e1e] text-white/20'}`}>{isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}</div>
            <div>
              <h3 className="text-base font-bold text-white leading-snug mb-1">{task.title}</h3>
              <p className="text-sm text-white/35 leading-relaxed">{task.description}</p>
            </div>
          </div>
          <div className="hidden sm:block shrink-0"><StatusBadge status={taskStatus} /></div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4 pl-12">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/6 text-[10px] font-bold uppercase tracking-wider text-white/30">{task.requiredPlatform}</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sats-orange-500/5 border border-sats-orange-500/15 text-[10px] font-bold uppercase tracking-wider text-sats-orange-500/60">{meta.icon}{meta.label}</span>
          <span className="sm:hidden"><StatusBadge status={taskStatus} /></span>
        </div>

        {task.targetUrl && (
          <div className="pl-12 mb-5">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] group/link">
              <div className="shrink-0 w-6 h-6 rounded-lg bg-sats-orange-500/8 border border-sats-orange-500/15 flex items-center justify-center"><span className="text-[9px] font-black text-sats-orange-500/70">1</span></div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/25 mb-0.5">Step 1 ? Open on {task.requiredPlatform}</p>
                <p className="text-xs text-white/40 truncate">{task.targetUrl}</p>
              </div>
              <a href={task.targetUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sats-orange-500/8 border border-sats-orange-500/20 text-sats-orange-500 text-xs font-bold hover:bg-sats-orange-500/15 hover:border-sats-orange-500/35 transition-all"><span> Open </span><ExternalLink className="w-3 h-3" /></a>
            </div>
          </div>
        )}

        <div className="pl-0 sm:pl-12">
          {isCompleted ? (
            <div className={`flex items-start gap-3 p-4 rounded-xl border ${taskStatus === 'completed' ? 'bg-green-500/5 border-green-500/15' : 'bg-amber-500/5 border-amber-500/15'}`}>
              <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${taskStatus === 'completed' ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>{taskStatus === 'completed' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <RotateCcw className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />}</div>
              <div>
                <p className={`text-sm font-semibold mb-0.5 ${taskStatus === 'completed' ? 'text-green-300' : 'text-amber-300'}`}>{taskStatus === 'completed' ? 'Task Completed' : 'Submission Under Review'}</p>
                <p className={`text-xs ${taskStatus === 'completed' ? 'text-green-400/50' : 'text-amber-400/50'}`}>{taskStatus === 'completed' ? 'Your proof was approved. Sats have been credited.' : 'Our team is reviewing your submission. This usually takes a few hours.'}</p>
              </div>
            </div>
          ) : taskStatus === 'rejected' ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center"><X className="w-4 h-4 text-red-400" /></div>
                <div>
                  <p className="text-sm font-semibold text-red-300 mb-0.5">Submission Rejected</p>
                  <p className="text-xs text-red-400/50">Your previous submission was rejected. Please re-submit with valid proof.</p>
                </div>
              </div>
              <ProofInputZone taskStatus={taskStatus} task={task} meta={meta} selectedFile={selectedFile} textInput={textInput} result={result} isSubmitting={isSubmitting} isSubmitDisabled={isSubmitDisabled} onFileChange={onFileChange} onTextChange={onTextChange} onSubmit={onSubmit} />
            </div>
          ) : (
            <ProofInputZone taskStatus={taskStatus} task={task} meta={meta} selectedFile={selectedFile} textInput={textInput} result={result} isSubmitting={isSubmitting} isSubmitDisabled={isSubmitDisabled} onFileChange={onFileChange} onTextChange={onTextChange} onSubmit={onSubmit} />
          )}
        </div>
      </div>
    </div>
  );
}
