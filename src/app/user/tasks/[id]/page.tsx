'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, ExternalLink, Upload, Image as ImageIcon, 
  CheckCircle2, AlertTriangle, Loader2, Zap
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// --- Type Definitions ---
interface Task {
  id: string;
  title: string;
  description: string;
  requiredPlatform: string;
  proofType: string;
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

  // Submission State per Task
  const [selectedFiles, setSelectedFiles] = useState<{ [taskId: string]: File | null }>({});
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

  // 2. HANDLE FILE SELECTION
  const handleFileChange = (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic validation: Check if it's an image and under 5MB
      if (!file.type.startsWith('image/')) {
        alert("Please upload a valid image file (JPG, PNG).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB.");
        return;
      }
      
      setSelectedFiles(prev => ({ ...prev, [taskId]: file }));
    }
  };

  // 3. SUBMIT PROOF TO MULTER BACKEND
  const handleSubmitProof = async (taskId: string) => {
    const file = selectedFiles[taskId];
    if (!file) return;

    setIsSubmitting(prev => ({ ...prev, [taskId]: true }));
    setError(null);

    try {
      const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
      
      // CRITICAL: We MUST use FormData to send files to Multer, NOT JSON.
      const formData = new FormData();
      formData.append('proofImage', file); // 'proofImage' matches your Multer config

      const response = await fetch(`${API_URL}/users/tasks/${taskId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Notice: We DO NOT set 'Content-Type' here. 
          // Fetch automatically sets the correct multipart/form-data boundary!
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Submission failed');

      // Success! Update UI for this specific task
      setSubmissionResults(prev => ({ 
        ...prev, 
        [taskId]: { success: true, message: data.message } 
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
        <button onClick={() => router.back()} className="text-white hover:underline">
          Go Back
        </button>
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
        
        {campaign.tasks?.map((task, index) => (
          <div key={task.id} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 justify-between">
              
              {/* Task Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-white">{task.title}</h3>
                </div>
                <p className="text-gray-400 ml-11">{task.description}</p>
                <div className="mt-4 ml-11 inline-block px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-semibold uppercase tracking-wider">
                  Platform: {task.requiredPlatform}
                </div>
              </div>

              {/* Upload & Submit Zone */}
              <div className="w-full md:w-80 shrink-0 bg-black border border-[#1a1a1a] rounded-xl p-5">
                {submissionResults[task.id]?.success ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h4 className="text-green-400 font-bold">Proof Submitted!</h4>
                    <p className="text-xs text-gray-500 mt-1">{submissionResults[task.id].message}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white mb-2">Upload Proof (Screenshot)</h4>
                    
                    {submissionResults[task.id]?.success === false && (
                      <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
                        {submissionResults[task.id].message}
                      </div>
                    )}

                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#333] hover:border-sats-orange-500 hover:bg-sats-orange-500/5 rounded-xl transition-all">
                      {selectedFiles[task.id] ? (
                        <>
                          <ImageIcon className="w-8 h-8 text-sats-orange-500 mb-2" />
                          <span className="text-sm font-medium text-white truncate px-4 max-w-full">
                            {selectedFiles[task.id]?.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-500 mb-2" />
                          <span className="text-sm font-medium text-gray-400">Click to browse</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleFileChange(task.id, e)} 
                      />
                    </label>

                    <button
                      onClick={() => handleSubmitProof(task.id)}
                      disabled={!selectedFiles[task.id] || isSubmitting[task.id]}
                      className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all ${
                        !selectedFiles[task.id] 
                          ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' 
                          : isSubmitting[task.id]
                            ? 'bg-sats-orange-500/50 text-white cursor-wait'
                            : 'bg-sats-orange-500 hover:bg-sats-orange-600 text-black shadow-[0_0_20px_rgba(247,147,26,0.3)]'
                      }`}
                    >
                      {isSubmitting[task.id] ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Uploading & Verifying...</>
                      ) : (
                        'Submit Proof'
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}

        {campaign.tasks?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No specific tasks found for this campaign.
          </div>
        )}
      </div>
    </div>
  );
}