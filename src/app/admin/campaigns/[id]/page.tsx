'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { updateCampaign, deleteCampaign } from '@/features/admin/adminCampaignsSlice'; // Added deleteCampaign
import { ArrowLeft, Edit3, Save, X, Link as LinkIcon, Loader2, Calendar, Trash2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const PlatformLogo = ({ url, className = "w-6 h-6" }: { url: string | null, className?: string }) => {
  if (!url) return <LinkIcon className={className} />;
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return (
      <svg viewBox="0 0 24 24" className={`fill-current ${className}`}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (lowerUrl.includes('instagram.com')) {
    return (
      <svg viewBox="0 0 24 24" className={`fill-current ${className}`}>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );
  }
  return <LinkIcon className={className} />;
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

export default function SingleCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [campaign, setCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Added deleting state
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const token = sessionStorage.getItem('sats_token');
        const res = await fetch(`${API_URL}/admin/campaigns/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setCampaign(data);
          setEditForm(data);
        }
      } catch (err) {
        console.error("Failed to fetch campaign", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

const handleSave = async () => {
    setIsSaving(true);
    const { id: campId, tasks, createdAt, updatedAt, ...cleanUpdateData } = editForm;

    const result = await dispatch(updateCampaign({ id: campaign.id, data: cleanUpdateData }));
    
    if (updateCampaign.fulfilled.match(result)) {
      // THE FIX: Merge the old campaign with the new updated fields!
      const updatedCampaign = { ...campaign, ...result.payload };
      
      setCampaign(updatedCampaign);
      setEditForm(updatedCampaign);
      setIsEditing(false);
    } else {
      alert("Failed to update campaign.");
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${campaign.title}"? This cannot be undone.`)) {
      setIsDeleting(true);
      const result = await dispatch(deleteCampaign(campaign.id));
      if (deleteCampaign.fulfilled.match(result)) {
        router.push('/admin/campaigns'); // Go back to list immediately
      } else {
        alert("Failed to delete campaign.");
        setIsDeleting(false);
      }
    }
  };

  const handleCancel = () => {
    setEditForm(campaign); 
    setIsEditing(false);
  };

  if (isLoading) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 text-sats-orange-500 animate-spin" /></div>;
  }

  if (!campaign) {
    return <div className="text-center mt-20 text-red-400">Campaign not found.</div>;
  }

  const progressPercent = Math.min((campaign.totalCompletions / campaign.maxCompletions) * 100, 100);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 max-w-4xl mx-auto mt-4 sm:mt-10">
      
      <div className="bg-sats-black-900/80 border border-sats-black-800 rounded-3xl backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6 border-b border-sats-black-800 bg-sats-black-950/50">
          {/* UPDATED: Highly visible back button */}
          <button 
            onClick={() => router.push('/admin/campaigns')} 
            className="flex items-center text-gray-300 hover:text-white bg-sats-black-800 hover:bg-sats-black-700 px-4 py-2 rounded-xl transition-colors font-medium w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Campaigns
          </button>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            {!isEditing ? (
              <>
                {/* ADDED: Delete Button */}
                <button 
                  onClick={handleDelete} 
                  disabled={isDeleting}
                  className="flex items-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />} Delete
                </button>
                <button onClick={() => setIsEditing(true)} className="flex items-center bg-sats-black-800 hover:bg-sats-black-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm">
                  <Edit3 className="w-4 h-4 mr-2" /> Edit Campaign
                </button>
              </>
            ) : (
              <>
                <button onClick={handleCancel} className="flex items-center text-gray-400 hover:text-white px-4 py-2 transition-colors">
                  <X className="w-4 h-4 mr-2" /> Cancel
                </button>
                <button onClick={handleSave} disabled={isSaving} className="flex items-center bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-sats-orange-500/10 border border-sats-orange-500/30 flex items-center justify-center text-sats-orange-500 shrink-0">
              <PlatformLogo url={campaign.targetUrl} className="w-8 h-8" />
            </div>
            <div className="flex-1 w-full overflow-hidden">
              {!isEditing ? (
                <>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight truncate">{campaign.title}</h1>
                  <p className="text-gray-400 mt-2 leading-relaxed">{campaign.description}</p>
                </>
              ) : (
                <div className="space-y-3">
                  <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full bg-sats-black-950 border border-sats-black-700 text-white text-2xl font-bold px-4 py-2 rounded-xl outline-none focus:border-sats-orange-500" />
                  <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full bg-sats-black-950 border border-sats-black-700 text-gray-300 px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 min-h-25" />
                </div>
              )}
            </div>
          </div>

          <div className="bg-sats-black-950 rounded-2xl p-6 border border-sats-black-800">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Completions</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white">{(campaign.totalCompletions || 0).toLocaleString()}</span>
                  <span className="text-gray-500">/ {(campaign.maxCompletions || 0).toLocaleString()}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sats-orange-500 font-extrabold text-2xl">~ {campaign.rewardSats} <span className="text-sm text-gray-500">Sats</span></span>
              </div>
            </div>
            <div className="w-full bg-sats-black-800 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sats-orange-600 to-sats-orange-400 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <Field title="Target URL">
              {!isEditing ? (
                <a href={campaign.targetUrl} target="_blank" className="text-blue-400 hover:underline break-all">{campaign.targetUrl || 'N/A'}</a>
              ) : (
                <input type="text" value={editForm.targetUrl || ''} onChange={e => setEditForm({...editForm, targetUrl: e.target.value})} className="w-full bg-sats-black-950 border border-sats-black-700 text-white px-3 py-2 rounded-lg outline-none focus:border-sats-orange-500" />
              )}
            </Field>

            <Field title="Social Handle Target">
              {!isEditing ? (
                <span className="text-white font-medium">{campaign.socialHandleTarget || 'N/A'}</span>
              ) : (
                <input type="text" value={editForm.socialHandleTarget || ''} onChange={e => setEditForm({...editForm, socialHandleTarget: e.target.value})} className="w-full bg-sats-black-950 border border-sats-black-700 text-white px-3 py-2 rounded-lg outline-none focus:border-sats-orange-500" />
              )}
            </Field>

            <Field title="Reward (Sats)">
              {!isEditing ? (
                <span className="text-white font-medium">{campaign.rewardSats}</span>
              ) : (
                // UPDATED UX: Number inputs safely parse, allowing users to clear out the "0" and type easily
                <input 
                  type="number" 
                  value={editForm.rewardSats === 0 ? '' : editForm.rewardSats} 
                  onChange={e => setEditForm({...editForm, rewardSats: e.target.value === '' ? 0 : parseInt(e.target.value, 10)})} 
                  placeholder="0"
                  className="w-full bg-sats-black-950 border border-sats-black-700 text-white px-3 py-2 rounded-lg outline-none focus:border-sats-orange-500" 
                />
              )}
            </Field>

            <Field title="Max Completions">
              {!isEditing ? (
                <span className="text-white font-medium">{campaign.maxCompletions}</span>
              ) : (
                <input 
                  type="number" 
                  value={editForm.maxCompletions === 0 ? '' : editForm.maxCompletions} 
                  onChange={e => setEditForm({...editForm, maxCompletions: e.target.value === '' ? 0 : parseInt(e.target.value, 10)})} 
                  placeholder="0"
                  className="w-full bg-sats-black-950 border border-sats-black-700 text-white px-3 py-2 rounded-lg outline-none focus:border-sats-orange-500" 
                />
              )}
            </Field>

            <Field title="Status">
              {!isEditing ? (
                <span className={`px-3 py-1 rounded-md text-xs font-bold ${campaign.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {campaign.isActive ? 'ACTIVE' : 'PAUSED'}
                </span>
              ) : (
                <select value={editForm.isActive ? 'true' : 'false'} onChange={e => setEditForm({...editForm, isActive: e.target.value === 'true'})} className="w-full bg-sats-black-950 border border-sats-black-700 text-white px-3 py-2 rounded-lg outline-none focus:border-sats-orange-500">
                  <option value="true">Active</option>
                  <option value="false">Paused</option>
                </select>
              )}
            </Field>

            <Field title="Required Tier">
              <span className="text-white font-medium">{campaign.requiredTier}</span>
            </Field>
          </div>

          {/* Read-Only Timestamps (Aligned Left) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-4 sm:gap-8 pt-6 border-t border-sats-black-800 text-sm text-gray-500">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Created: {formatDate(campaign.createdAt)}</div>
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Updated: {formatDate(campaign.updatedAt)}</div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Field({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{title}</span>
      <div>{children}</div>
    </div>
  );
}