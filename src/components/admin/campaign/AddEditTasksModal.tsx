'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, AlertTriangle, Code, Coins } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { createTask, updateTask } from '@/features/admin/adminCampaignsSlice';
import type { Task } from '@/features/admin/adminCampaignsSlice';

const FREE_TIERS = ["BASIC", "COPPER", "BRONZE", "SILVER", "GOLD"];
const PREMIUM_TIERS = ["PLATINUM", "DIAMOND", "CROWN", "ELITE", "FOUNDER"];
const ALL_TIERS = [...FREE_TIERS, ...PREMIUM_TIERS];

function parseWholeNumber(value: string) {
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly === '') return 0;

  const parsed = Number.parseInt(digitsOnly, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function createEmptyTierMatrix() {
  return ALL_TIERS.reduce<Record<string, number>>((acc, tier) => {
    acc[tier] = 0;
    return acc;
  }, {});
}

function mergeTierMatrix(matrix?: Record<string, number> | null) {
  const merged = createEmptyTierMatrix();

  if (!matrix) return merged;

  for (const tier of ALL_TIERS) {
    merged[tier] = Number(matrix[tier] || 0);
  }

  return merged;
}

interface AddEditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  task?: Task | null;
  onSuccess: () => void; // Used to trigger the live fetch in the parent
}

export default function AddEditTaskModal({ isOpen, onClose, campaignId, task, onSuccess }: AddEditTaskModalProps) {
  const dispatch = useAppDispatch();
  const isEditMode = !!task;

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  
  // Overrides & JSON
  const [hasOverrides, setHasOverrides] = useState(false);
  const [baseReward, setBaseReward] = useState(0);
  const [tierMatrix, setTierMatrix] = useState<Record<string, number>>({});
  const [requirementsStr, setRequirementsStr] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setTargetUrl(task.targetUrl || '');
        setRequirementsStr(task.requirements ? JSON.stringify(task.requirements, null, 2) : '');
        
        if (task.baseRewardSatsOverride || task.tierRewardMatrixOverride) {
          setHasOverrides(true);
          setBaseReward(task.baseRewardSatsOverride || 0);
          setTierMatrix(mergeTierMatrix(task.tierRewardMatrixOverride));
        } else {
          setHasOverrides(false);
          setBaseReward(0);
          setTierMatrix(createEmptyTierMatrix());
        }
      } else {
        // Reset for Create
        setTitle('');
        setDescription('');
        setTargetUrl('');
        setRequirementsStr('');
        setHasOverrides(false);
        setBaseReward(0);
        setTierMatrix(createEmptyTierMatrix());
      }
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setErrorMsg(null);

    if (title.trim().length < 3) return setErrorMsg("Title must be at least 3 characters.");

    // Validate JSON safely
    let parsedRequirements = null;
    if (requirementsStr.trim()) {
      try {
        parsedRequirements = JSON.parse(requirementsStr);
        if (typeof parsedRequirements !== 'object') throw new Error("Must be a JSON object");
      } catch (err) {
        return setErrorMsg("Invalid JSON format in AI Requirements field.");
      }
    }

    if (hasOverrides) {
      const hasAnyTierOverride = ALL_TIERS.some((tier) => Number(tierMatrix[tier] || 0) > 0);
      if (baseReward <= 0 && !hasAnyTierOverride) {
        return setErrorMsg("Add a base reward override or at least one tier reward override.");
      }
    }

    setIsSaving(true);

    // Build Payload
    const payload: any = {
      title: title.trim(),
    };
    if (description.trim()) payload.description = description.trim();
    if (targetUrl.trim()) payload.targetUrl = targetUrl.trim();
    if (parsedRequirements) payload.requirements = parsedRequirements;

    if (hasOverrides) {
      payload.baseRewardSatsOverride = Number(baseReward);
      payload.tierRewardMatrixOverride = tierMatrix;
    }

    const action = isEditMode 
      ? updateTask({ campaignId, taskId: task.id, data: payload }) 
      : createTask({ campaignId, data: payload });

    const result = await dispatch(action);

    // 🚨 THE FIX: Check 'result.type', not 'action.type'
    if (result.type.endsWith('fulfilled')) {
      onSuccess(); // Trigger live refetch
      onClose();
    } else {
      setErrorMsg(result.payload as string || "Failed to save task.");
    }
    
    setIsSaving(false);
  };

  return (
    // Overlay WITHOUT onClick={onClose} to prevent accidental closure
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-hidden">
      
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#050505] border border-[#1a1a1a] rounded-3xl shadow-2xl relative">
        
        {/* Header */}
        <div className="p-6 border-b border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-between shrink-0 rounded-t-3xl">
          <div>
            <h2 className="text-xl font-black text-white">{isEditMode ? 'Edit Task' : 'Add New Task'}</h2>
            <p className="text-xs text-gray-500 mt-1">Configure action requirements and overrides.</p>
          </div>
          {/* ONLY WAY TO CLOSE */}
          <button onClick={onClose} disabled={isSaving} className="p-2 rounded-xl bg-[#111] hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> {errorMsg}
            </div>
          )}

          {/* Basic Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Task Title <span className="text-sats-orange-500">*</span></label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required minLength={3} className={inputCls} placeholder="e.g. Retweet our pinned post" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Description (Optional)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputCls} min-h-[100px] resize-none`} placeholder="Specific instructions..." />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Target URL (Optional)</label>
                <input type="url" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} className={inputCls} placeholder="https://..." />
                
                <div className="mt-4">
                  <label className="flex items-center gap-1.5 text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 ml-1">
                    <Code className="w-3 h-3" /> AI / JSON Requirements
                  </label>
                  <textarea value={requirementsStr} onChange={(e) => setRequirementsStr(e.target.value)} className={`${inputCls} min-h-[60px] font-mono text-xs`} placeholder='{"mustContain": "SatsEarn"}' />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#1a1a1a]" />

          {/* Economic Overrides */}
          <div>
            <div className="flex items-center justify-between mb-4 bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-2xl">
              <div>
                <p className="text-sm font-bold text-white flex items-center gap-1.5"><Coins className="w-4 h-4 text-yellow-500" /> Economic Overrides</p>
                <p className="text-xs text-gray-500 mt-0.5">Override the parent campaign's default payouts for this specific task.</p>
              </div>
              <button type="button" onClick={() => setHasOverrides(!hasOverrides)} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${hasOverrides ? 'bg-yellow-500' : 'bg-[#111] border border-[#2a2a2a]'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${hasOverrides ? 'translate-x-[22px]' : 'translate-x-1'}`} />
              </button>
            </div>

            {hasOverrides && (
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-5 rounded-2xl space-y-6 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Base Reward Override (Sats) <span className="text-sats-orange-500">*</span></label>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={baseReward || ''} onChange={(e) => setBaseReward(parseWholeNumber(e.target.value))} className={inputCls} placeholder="0" />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Tier Matrix Override</label>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="px-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Free Tiers</div>
                      <div className="grid grid-cols-1 gap-3">
                        {FREE_TIERS.map((tier) => (
                          <div key={tier} className="rounded-xl border border-[#1a1a1a] bg-[#050505] p-2.5 flex items-center justify-between">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider truncate mr-2">{tier}</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={tierMatrix[tier] || ''}
                              onChange={(e) => setTierMatrix((prev) => ({ ...prev, [tier]: parseWholeNumber(e.target.value) }))}
                              placeholder="0"
                              className="w-16 bg-[#111] border border-[#2a2a2a] rounded-lg px-2 py-1 text-right text-xs font-bold text-white outline-none focus:border-sats-orange-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="px-1 text-[10px] font-black uppercase tracking-[0.18em] text-yellow-400">Premium Tiers</div>
                      <div className="grid grid-cols-1 gap-3">
                        {PREMIUM_TIERS.map((tier) => (
                          <div key={tier} className="rounded-xl border border-yellow-500/30 bg-[#050505] p-2.5 flex items-center justify-between shadow-[0_0_0_1px_rgba(234,179,8,0.06)]">
                            <label className="text-[10px] font-black text-yellow-300 uppercase tracking-wider truncate mr-2">{tier}</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={tierMatrix[tier] || ''}
                              onChange={(e) => setTierMatrix((prev) => ({ ...prev, [tier]: parseWholeNumber(e.target.value) }))}
                              placeholder="0"
                              className="w-16 bg-[#111] border border-yellow-500/20 rounded-lg px-2 py-1 text-right text-xs font-bold text-white outline-none focus:border-sats-orange-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-end gap-3 shrink-0 rounded-b-3xl">
          <button onClick={onClose} disabled={isSaving} className="px-6 py-2.5 rounded-xl border border-[#2a2a2a] text-gray-400 font-bold hover:text-white hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isSaving} className="px-6 py-2.5 rounded-xl bg-sats-orange-500 text-black font-black hover:bg-sats-orange-400 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(238,139,18,0.2)]">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
            {isEditMode ? 'Save Changes' : 'Create Task'}
          </button>
        </div>

      </div>
    </div>
  );
}

const inputCls = "w-full bg-[#111] border border-[#2a2a2a] text-white text-sm font-medium px-4 py-2.5 rounded-xl outline-none focus:border-sats-orange-500/50 focus:bg-[#151515] transition-all";
