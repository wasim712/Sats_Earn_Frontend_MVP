'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, ExternalLink, Upload, Image as ImageIcon, 
  CheckCircle2, AlertTriangle, Loader2, Zap, Link as LinkIcon, FileText
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// --- Type Definitions ---
interface Task {
  id: string;
  title: string;
  description: string;
  requiredPlatform: string;
  proofType: string; // "SCREENSHOT" | "URL" | "TEXT_RESPONSE" | "API_VERIFIED"
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  baseRewardSats: number;
  targetUrl: string | null;
  tasks: Task[];
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Submission State ---
  const [selectedFiles, setSelectedFiles] = useState<{ [taskId: string]: File | null }>({});
  const [textInputs, setTextInputs] = useState<{ [taskId: string]: string }>({}); // 🚀 NEW: For URLs and Text
  const [isSubmitting, setIsSubmitting] = useState<{ [taskId: string]: boolean }>({});
  const [submissionResults, setSubmissionResults] = useState<{ [taskId: string]: { success: boolean; message: string } }>({});

  // 1. FETCH CAMPAIGN DETAILS
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
        
        const response = await fetch(`${API_URL}/users/campaigns/${campaignId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
console.log(response);

        if (!response.ok) throw new Error('Failed to fetch task details.');

        const data = await response.json();
        setCampaign(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  // 2. INPUT HANDLERS
  const handleFileChange = (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) return alert("Please upload a valid image file (JPG, PNG).");
      if (file.size > 5 * 1024 * 1024) return alert("Image must be smaller than 5MB.");
      
      setSelectedFiles(prev => ({ ...prev, [taskId]: file }));
    }
  };

  const handleTextChange = (taskId: string, value: string) => {
    setTextInputs(prev => ({ ...prev, [taskId]: value }));
  };

  // 3. DYNAMIC SUBMIT LOGIC
  const handleSubmitProof = async (taskId: string, proofType: string) => {
    setIsSubmitting(prev => ({ ...prev, [taskId]: true }));
    setError(null);

    try {
      const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
      
      let fetchOptions: RequestInit = {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      };

      // Branch logic based on Proof Type!
      if (proofType === 'SCREENSHOT') {
        const file = selectedFiles[taskId];
        if (!file) throw new Error("Please upload a screenshot.");
        
        const formData = new FormData();
        formData.append('proofImage', file);
        fetchOptions.body = formData; // No Content-Type header needed for FormData
        
      } else if (proofType === 'URL' || proofType === 'TEXT_RESPONSE') {
        const text = textInputs[taskId];
        if (!text || text.trim() === '') throw new Error("Response cannot be empty.");
        
        fetchOptions.headers = { ...fetchOptions.headers, 'Content-Type': 'application/json' };
        fetchOptions.body = JSON.stringify({ proofText: text.trim() });
        
      } else if (proofType === 'API_VERIFIED') {
        fetchOptions.headers = { ...fetchOptions.headers, 'Content-Type': 'application/json' };
        fetchOptions.body = JSON.stringify({ triggerVerification: true });
      }

      const response = await fetch(`${API_URL}/users/tasks/${taskId}/submit`, fetchOptions);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Submission failed');

      setSubmissionResults(prev => ({ 
        ...prev, 
        [taskId]: { success: true, message: data.message || "Submitted successfully!" } 
      }));

    } catch (err: any) {
      setSubmissionResults(prev => ({ 
        ...prev, 
        [taskId]: { success: false, message: err.message } 
      }));
    } finally {
      setIsSubmitting(prev => ({ ...prev, [taskId]: false }));
    }
  };

  // --- RENDER STATES ---
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-sats-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Could not load campaign</h2>
        <p className="text-red-400 mb-6">{error}</p>
        <button onClick={() => router.back()} className="text-white hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 p-4 md:p-6">
      
      {/* 1. BACK BUTTON & HEADER */}
      <button 
        onClick={() => router.back()}
        className="flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tasks
      </button>

      <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 md:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Zap className="w-48 h-48" />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/20 text-sats-orange-500 text-sm font-bold mb-6">
            💰 {campaign.baseRewardSats} Sats Reward
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            {campaign.title}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            {campaign.description}
          </p>

          {campaign.targetUrl && (
            <a 
              href={campaign.targetUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center px-6 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold rounded-xl transition-colors border border-[#333]"
            >
              Open Target Link <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          )}
        </div>
      </div>

      {/* 2. TASKS LIST */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Tasks to Complete</h2>
        
        {campaign.tasks?.map((task, index) => {
          
          // Disable submit button logic dynamically based on proof type
          const isSubmitDisabled = 
            isSubmitting[task.id] ||
            (task.proofType === 'SCREENSHOT' && !selectedFiles[task.id]) ||
            ((task.proofType === 'URL' || task.proofType === 'TEXT_RESPONSE') && !textInputs[task.id]?.trim());

          return (
            <div key={task.id} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 justify-between">
                
                {/* Task Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-bold text-white">{task.title}</h3>
                  </div>
                  <p className="text-gray-400 ml-11">{task.description}</p>
                  <div className="mt-4 ml-11 flex items-center gap-3">
                    <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                      Platform: {task.requiredPlatform}
                    </span>
                    <span className="inline-block px-3 py-1 bg-[#111] border border-[#333] text-gray-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                      Type: {task?.proofType?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* DYNAMIC Upload & Submit Zone */}
                <div className="w-full md:w-80 shrink-0 bg-black border border-[#1a1a1a] rounded-xl p-5 flex flex-col justify-center">
                  
                  {submissionResults[task.id]?.success ? (
                    <div className="text-center py-4">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <h4 className="text-green-400 font-bold">Task Completed!</h4>
                      <p className="text-xs text-gray-500 mt-1">{submissionResults[task.id].message}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      
                      {/* Error Message Display */}
                      {submissionResults[task.id]?.success === false && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 font-medium">
                          {submissionResults[task.id].message}
                        </div>
                      )}

                      {/* ─── DYNAMIC FORM RENDERING ─── */}
                      {task.proofType === 'SCREENSHOT' && (
                        <>
                          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-gray-500" /> Upload Screenshot</h4>
                          <label className="cursor-pointer flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#333] hover:border-sats-orange-500 hover:bg-sats-orange-500/5 rounded-xl transition-all">
                            {selectedFiles[task.id] ? (
                              <>
                                <ImageIcon className="w-6 h-6 text-sats-orange-500 mb-2" />
                                <span className="text-xs font-bold text-white truncate px-4 max-w-full">
                                  {selectedFiles[task.id]?.name}
                                </span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-6 h-6 text-gray-500 mb-2" />
                                <span className="text-xs font-medium text-gray-400">Click to browse</span>
                              </>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(task.id, e)} />
                          </label>
                        </>
                      )}

                      {task.proofType === 'URL' && (
                        <>
                          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><LinkIcon className="w-4 h-4 text-gray-500" /> Submit Link</h4>
                          <input 
                            type="url" 
                            placeholder="https://..." 
                            value={textInputs[task.id] || ''} 
                            onChange={(e) => handleTextChange(task.id, e.target.value)}
                            className="w-full bg-[#111] border border-[#333] text-white text-sm px-4 py-3 rounded-xl focus:border-sats-orange-500 outline-none transition-colors"
                          />
                        </>
                      )}

                      {task.proofType === 'TEXT_RESPONSE' && (
                        <>
                          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-gray-500" /> Submit Text</h4>
                          <textarea 
                            placeholder="Enter your response here..." 
                            value={textInputs[task.id] || ''} 
                            onChange={(e) => handleTextChange(task.id, e.target.value)}
                            className="w-full min-h-[100px] bg-[#111] border border-[#333] text-white text-sm px-4 py-3 rounded-xl focus:border-sats-orange-500 outline-none transition-colors resize-none"
                          />
                        </>
                      )}

                      {task.proofType === 'API_VERIFIED' && (
                        <div className="text-center p-4 bg-[#111] border border-[#333] rounded-xl">
                          <Zap className="w-6 h-6 text-sats-orange-500 mx-auto mb-2" />
                          <p className="text-xs text-gray-400 font-medium">Click below to securely verify completion via API.</p>
                        </div>
                      )}

                      {/* Universal Submit Button */}
                      <button
                        onClick={() => handleSubmitProof(task.id, task.proofType)}
                        disabled={isSubmitDisabled}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all mt-2 ${
                          isSubmitDisabled 
                            ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' 
                            : 'bg-sats-orange-500 hover:bg-sats-orange-400 text-black shadow-[0_0_20px_rgba(247,147,26,0.3)] active:scale-95'
                        }`}
                      >
                        {isSubmitting[task.id] ? (
                          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                        ) : (
                          'Submit Proof'
                        )}
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}

        {campaign.tasks?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No specific tasks found for this campaign.
          </div>
        )}
      </div>
    </div>
  );
}