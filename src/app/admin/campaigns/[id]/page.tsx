
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAppDispatch } from '@/store/hooks';
// import { updateCampaign, deleteCampaign } from '@/features/admin/adminCampaignsSlice';
// import { 
//   ArrowLeft, Edit3, Save, X, Link as LinkIcon, Loader2, Calendar, Trash2, 
//   BarChart3, Activity, CheckCircle2, Clock, XCircle, Globe2, Medal, 
//   Zap, Shield, Target, Crown, Users, Plus
// } from 'lucide-react';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
// const CATEGORIES = ["SOCIAL", "SURVEY", "VIDEO_AD", "APP_INSTALL", "OFFERWALL", "LEARN_EARN", "DAILY_STREAK"];
// const FREE_TIERS = ["BASIC", "COPPER", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "CROWN", "ELITE", "FOUNDER"];

// // ─── Platform Logo Helper ───
// export const PlatformLogo = ({ url, className = "w-6 h-6" }: { url: string | null, className?: string }) => {
//   if (!url) return <LinkIcon className={className} />;
//   const lowerUrl = url.toLowerCase();
//   if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
//     return <svg viewBox="0 0 24 24" className={`fill-current ${className}`}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
//   }
//   if (lowerUrl.includes('instagram.com')) {
//     return <svg viewBox="0 0 24 24" className={`fill-current ${className}`}><path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>;
//   }
//   return <LinkIcon className={className} />;
// };

// const formatDate = (isoString: string) => {
//   return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
// };

// // ─── MAIN COMPONENT ───
// export default function SingleCampaignPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = React.use(params);
//   const router = useRouter();
//   const dispatch = useAppDispatch();
  
//   const [campaign, setCampaign] = useState<any>(null);
//   const [analytics, setAnalytics] = useState<any>(null);
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
  
//   const [editForm, setEditForm] = useState<any>({});

//   useEffect(() => {
//     const fetchCampaignData = async () => {
//       try {
//         const token = sessionStorage.getItem('sats_token');
//         const headers = { 'Authorization': `Bearer ${token}` };

//         const [campRes, analyticsRes] = await Promise.all([
//           fetch(`${API_URL}/admin/campaigns/${id}`, { headers }),
//           fetch(`${API_URL}/admin/campaigns/${id}/analytics`, { headers }).catch(() => ({ ok: false })) // Catch just in case analytics fail
//         ]);

//         if (campRes.ok) {
//           const campData = await campRes.json();
//           setCampaign(campData);
//           setEditForm(campData); // Initialize edit form
//         }

//         if (analyticsRes && analyticsRes.ok) {
//           const analyticsData = await analyticsRes.json();
//           setAnalytics(analyticsData);
//         }

//       } catch (err) {
//         console.error("Failed to fetch campaign data", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchCampaignData();
//   }, [id]);

//   const handleSave = async () => {
//     setIsSaving(true);
    
//     // Clean up payload based on Zod Schema
//     const payload = {
//       title: editForm.title.trim(),
//       description: editForm.description.trim(),
//       category: editForm.category,
//       isPremiumOnly: editForm.isPremiumOnly,
//       requiredFreeTier: editForm.requiredFreeTier,
//       baseRewardSats: Number(editForm.baseRewardSats),
//       maxCompletions: Number(editForm.maxCompletions),
//       tierRewardMatrix: editForm.tierRewardMatrix,
//       isActive: editForm.isActive,
//       targetUrl: editForm.targetUrl?.trim() || undefined,
//       socialHandleTarget: editForm.socialHandleTarget?.trim() || undefined,
//     };

//     const result = await dispatch(updateCampaign({ id: campaign.id, data: payload }));
    
//     if (updateCampaign.fulfilled.match(result)) {
//       const updatedCampaign = { ...campaign, ...result.payload };
//       setCampaign(updatedCampaign);
//       setEditForm(updatedCampaign);
//       setIsEditing(false);
//     } else {
//       alert("Failed to update campaign.");
//     }
//     setIsSaving(false);
//   };

//   const handleDelete = async () => {
//     if (window.confirm(`Are you sure you want to delete "${campaign.title}"? All user submissions and associated tasks will be lost forever.`)) {
//       setIsDeleting(true);
//       const result = await dispatch(deleteCampaign(campaign.id));
//       if (deleteCampaign.fulfilled.match(result)) {
//         router.push('/admin/campaigns');
//       } else {
//         alert("Failed to delete campaign.");
//         setIsDeleting(false);
//       }
//     }
//   };

//   const handleCancel = () => {
//     setEditForm(campaign); // Revert changes
//     setIsEditing(false);
//   };

//   const handleMatrixChange = (tier: string, value: string) => {
//     setEditForm((prev: any) => ({
//       ...prev,
//       tierRewardMatrix: { ...prev.tierRewardMatrix, [tier]: value === '' ? 0 : parseInt(value, 10) }
//     }));
//   };

//   if (isLoading) {
//     return <div className="min-h-screen bg-[#020202] flex items-center justify-center"><Loader2 className="w-10 h-10 text-sats-orange-500 animate-spin" /></div>;
//   }

//   if (!campaign) {
//     return <div className="min-h-screen bg-[#020202] flex items-center justify-center text-red-400 font-bold">Campaign not found.</div>;
//   }

//   const safeTotal = Number(campaign.totalCompletions) || 0;
//   const safeMax = Number(campaign.maxCompletions) || 1;
//   const progressPercent = Math.min((safeTotal / safeMax) * 100, 100);

//   return (
//     <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
//       <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6 md:gap-8">
        
//         {/* ─── STICKY HEADER ─── */}
//         <div className="sticky top-0 z-40 bg-[#020202]/80 backdrop-blur-xl border border-[#1a1a1a] rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-2xl mt-4">
//           <button 
//             onClick={() => router.push('/admin/campaigns')} 
//             className="flex items-center text-gray-400 hover:text-white bg-[#0a0a0a] border border-[#1a1a1a] hover:bg-[#111] px-5 py-2.5 rounded-xl transition-all font-bold w-full sm:w-auto justify-center shadow-sm"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" /> Back
//           </button>
          
//           <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
//             {!isEditing ? (
//               <>
//                 <button 
//                   onClick={handleDelete} 
//                   disabled={isDeleting}
//                   className="flex items-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
//                 >
//                   {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />} Delete
//                 </button>
//                 <button onClick={() => setIsEditing(true)} className="flex items-center bg-[#111] border border-[#2a2a2a] hover:bg-white/5 text-white px-6 py-2.5 rounded-xl transition-all shadow-sm font-bold">
//                   <Edit3 className="w-4 h-4 mr-2" /> Edit Campaign
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button onClick={handleCancel} className="flex items-center text-gray-400 hover:text-white px-4 py-2.5 transition-colors font-bold">
//                   <X className="w-5 h-5 mr-1.5" /> Cancel
//                 </button>
//                 <button onClick={handleSave} disabled={isSaving} className="flex items-center bg-green-500 hover:bg-green-400 text-black font-black px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(34,197,94,0.3)] active:scale-95">
//                   {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          
//           {/* ─── LEFT COLUMN (Spans 2): Campaign Details ─── */}
//           <div className="xl:col-span-2 flex flex-col gap-6 md:gap-8">
//             <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8">
              
//               {/* Core Info Header */}
//               <div className="flex items-start gap-6 mb-8 border-b border-[#1a1a1a] pb-8">
//                 <div className="w-16 h-16 rounded-2xl bg-[#0a0a0a] border border-[#2a2a2a] flex items-center justify-center text-gray-400 shrink-0 shadow-inner">
//                   <PlatformLogo url={campaign.targetUrl} className="w-8 h-8" />
//                 </div>
//                 <div className="flex-1 w-full overflow-hidden pt-1">
//                   {!isEditing ? (
//                     <>
//                       <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate mb-2">{campaign.title}</h1>
//                       <p className="text-gray-400 leading-relaxed text-sm md:text-base">{campaign.description}</p>
//                     </>
//                   ) : (
//                     <div className="space-y-4">
//                       <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full bg-[#111] border border-[#2a2a2a] text-white text-xl font-bold px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 transition-all" />
//                       <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full bg-[#111] border border-[#2a2a2a] text-gray-300 px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 min-h-[120px] transition-all" />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Progress & Budget */}
//               <div className="bg-gradient-to-b from-[#0a0a0a] to-[#050505] rounded-2xl p-6 border border-[#1a1a1a] mb-8">
//                 <div className="flex justify-between items-end mb-5">
//                   <div>
//                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Completions Limit</p>
//                     <div className="flex items-baseline gap-2">
//                       <span className="text-3xl font-black text-white">{safeTotal.toLocaleString()}</span>
//                       <span className="text-gray-500 font-medium">/ {safeMax.toLocaleString()}</span>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center justify-end gap-1.5"><Zap className="w-3.5 h-3.5 text-sats-orange-500" /> Base Reward</p>
//                     <span className="text-sats-orange-500 font-black text-3xl">~ {campaign.baseRewardSats.toLocaleString()} <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Sats</span></span>
//                   </div>
//                 </div>
//                 <div className="w-full bg-[#111] border border-[#2a2a2a] rounded-full h-3 overflow-hidden shadow-inner">
//                   <div className="h-full bg-sats-orange-500 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
//                 </div>
//               </div>

//               {/* Metadata Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                
//                 <Field title="Campaign Status">
//                   {!isEditing ? (
//                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${campaign.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-gray-400 border-[#2a2a2a]'}`}>
//                       <span className={`w-1.5 h-1.5 rounded-full ${campaign.isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></span>
//                       {campaign.isActive ? 'Live & Active' : 'Paused / Draft'}
//                     </span>
//                   ) : (
//                     <select value={editForm.isActive ? 'true' : 'false'} onChange={e => setEditForm({...editForm, isActive: e.target.value === 'true'})} className={inputCls}>
//                       <option value="true">Active (Live)</option>
//                       <option value="false">Paused (Draft)</option>
//                     </select>
//                   )}
//                 </Field>

//                 <Field title="Category">
//                   {!isEditing ? (
//                     <span className="text-white font-bold">{campaign.category.replace('_', ' ')}</span>
//                   ) : (
//                     <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className={inputCls}>
//                       {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>)}
//                     </select>
//                   )}
//                 </Field>

//                 <Field title="Access Gate">
//                   {!isEditing ? (
//                     <div className="flex items-center gap-2">
//                       {campaign.isPremiumOnly && <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-black text-yellow-400 uppercase tracking-widest"><Crown className="w-3 h-3" /> Premium Only</span>}
//                       <span className="text-gray-300 font-bold text-sm uppercase tracking-wider bg-[#111] px-2 py-0.5 rounded border border-[#2a2a2a]">Tier: {campaign.requiredFreeTier}</span>
//                     </div>
//                   ) : (
//                     <div className="flex gap-4">
//                        <select value={editForm.requiredFreeTier} onChange={e => setEditForm({...editForm, requiredFreeTier: e.target.value})} className={inputCls}>
//                         {FREE_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
//                       </select>
//                       <button type="button" onClick={() => setEditForm((prev: any) => ({ ...prev, isPremiumOnly: !prev.isPremiumOnly }))} className={`shrink-0 px-4 rounded-xl border text-xs font-bold transition-all ${editForm.isPremiumOnly ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-[#111] border-[#2a2a2a] text-gray-500'}`}>
//                         <Crown className="w-4 h-4 mx-auto mb-0.5" /> Premium
//                       </button>
//                     </div>
//                   )}
//                 </Field>

//                 <Field title="Base Economics">
//                   {!isEditing ? (
//                     <span className="text-white font-bold">{campaign.maxCompletions.toLocaleString()} Max <span className="text-gray-500 mx-2">|</span> {campaign.baseRewardSats.toLocaleString()} Sats Base</span>
//                   ) : (
//                     <div className="flex gap-4">
//                       <input type="number" value={editForm.baseRewardSats} onChange={e => setEditForm({...editForm, baseRewardSats: Number(e.target.value)})} placeholder="Base Sats" className={inputCls} />
//                       <input type="number" value={editForm.maxCompletions} onChange={e => setEditForm({...editForm, maxCompletions: Number(e.target.value)})} placeholder="Max Users" className={inputCls} />
//                     </div>
//                   )}
//                 </Field>

//                 <Field title="Target URL">
//                   {!isEditing ? (
//                     <a href={campaign.targetUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline break-all font-medium">{campaign.targetUrl || 'N/A'}</a>
//                   ) : (
//                     <input type="url" value={editForm.targetUrl || ''} onChange={e => setEditForm({...editForm, targetUrl: e.target.value})} placeholder="https://..." className={inputCls} />
//                   )}
//                 </Field>

//                 <Field title="Social Handle Requirement">
//                   {!isEditing ? (
//                     <span className="text-white font-medium">{campaign.socialHandleTarget || 'None'}</span>
//                   ) : (
//                     <input type="text" value={editForm.socialHandleTarget || ''} onChange={e => setEditForm({...editForm, socialHandleTarget: e.target.value})} placeholder="@username" className={inputCls} />
//                   )}
//                 </Field>
                
//                 {/* Embedded Tier Matrix Editing */}
//                 {isEditing && (
//                   <div className="col-span-full mt-4 pt-6 border-t border-[#1a1a1a]">
//                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-4">Tier Reward Matrix Overrides</span>
//                     <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
//                       {FREE_TIERS.map(tier => (
//                         <div key={tier} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-2 flex flex-col gap-1">
//                           <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{tier}</span>
//                           <input type="number" value={editForm.tierRewardMatrix?.[tier] || 0} onChange={(e) => handleMatrixChange(tier, e.target.value)} className="w-full bg-transparent text-white font-bold outline-none text-sm" />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-4 sm:gap-8 pt-8 mt-8 border-t border-[#1a1a1a] text-xs font-semibold text-gray-500">
//                 <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Deployed: {formatDate(campaign.createdAt)}</div>
//                 <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Last Updated: {formatDate(campaign.updatedAt)}</div>
//               </div>
//             </div>
            
//             {/* ─── Task Management (Child Placeholder) ─── */}
//             <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8 flex flex-col">
//               <div className="flex items-center justify-between mb-6 border-b border-[#1a1a1a] pb-4">
//                 <h2 className="text-xl font-black text-white flex items-center gap-2">
//                   <Target className="w-5 h-5 text-gray-400" /> Associated Tasks
//                 </h2>
//                 <button className="flex items-center justify-center gap-2 bg-[#111] border border-[#2a2a2a] hover:bg-white/5 text-white font-bold py-2 px-4 rounded-xl transition-all shadow-sm text-sm">
//                   <Plus className="w-4 h-4" /> Add Task
//                 </button>
//               </div>
              
//               <div className="flex flex-col items-center justify-center py-10 text-center">
//                 <p className="text-gray-500 font-medium mb-1">Task management logic goes here.</p>
//                 <p className="text-xs text-gray-600">The parent campaign economics dictate default rewards.</p>
//               </div>
//             </div>

//           </div>

//           {/* ─── RIGHT COLUMN: Real-Time Analytics ─── */}
//           {analytics && (
//             <div className="xl:col-span-1 flex flex-col gap-6 md:gap-8">
//               <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8 h-full">
                
//                 <div className="flex items-center gap-3 mb-8 border-b border-[#1a1a1a] pb-6">
//                   <div className="p-2.5 bg-[#111] rounded-xl border border-[#2a2a2a] shadow-inner">
//                     <BarChart3 className="w-5 h-5 text-blue-400" />
//                   </div>
//                   <h2 className="text-xl font-black text-white tracking-tight">Real-Time Traffic</h2>
//                 </div>

//                 <div className="space-y-6">
                  
//                   {/* Status Breakdown */}
//                   <div className="grid grid-cols-2 gap-3">
//                     <AnalyticStatCard title="Total Traffic" value={analytics.totalSubmissions || 0} icon={<Activity className="w-4 h-4 text-gray-400" />} color="bg-[#0a0a0a] border-[#1a1a1a] text-white" />
//                     <AnalyticStatCard title="Verified" value={analytics.statusCounts?.verified || 0} icon={<CheckCircle2 className="w-4 h-4 text-green-500" />} color="bg-green-500/5 border-green-500/20 text-green-400" />
//                     <AnalyticStatCard title="Pending Review" value={analytics.statusCounts?.pending || 0} icon={<Clock className="w-4 h-4 text-yellow-500" />} color="bg-yellow-500/5 border-yellow-500/20 text-yellow-400" />
//                     <AnalyticStatCard title="Rejected" value={analytics.statusCounts?.rejected || 0} icon={<XCircle className="w-4 h-4 text-red-500" />} color="bg-red-500/5 border-red-500/20 text-red-400" />
//                   </div>

//                   {/* Tier Distribution */}
//                   <div className="pt-4">
//                     <div className="flex items-center gap-2 mb-4 text-gray-400">
//                       <Medal className="w-4 h-4 text-yellow-500" />
//                       <h3 className="font-bold text-sm">Tier Distribution</h3>
//                     </div>
//                     <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4">
//                       {Object.keys(analytics.tierDistribution || {}).length > 0 ? (
//                         <ul className="space-y-3">
//                           {Object.entries(analytics.tierDistribution).map(([tier, count]) => (
//                             <li key={tier} className="flex justify-between items-center text-sm">
//                               <span className="text-gray-400 uppercase tracking-widest text-[10px] font-black">{tier}</span>
//                               <span className="font-bold text-white px-2 py-0.5 bg-[#111] border border-[#2a2a2a] rounded-md">{String(count)}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       ) : (
//                         <p className="text-xs text-gray-600 font-medium italic text-center py-2">No tier data collected yet.</p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Geo Distribution */}
//                   <div className="pt-2">
//                     <div className="flex items-center gap-2 mb-4 text-gray-400">
//                       <Globe2 className="w-4 h-4 text-blue-500" />
//                       <h3 className="font-bold text-sm">Geographic Origin</h3>
//                     </div>
//                     <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 max-h-[200px] overflow-y-auto custom-scrollbar">
//                       {Object.keys(analytics.geographicDistribution || {}).length > 0 ? (
//                         <ul className="space-y-3">
//                           {Object.entries(analytics.geographicDistribution).map(([country, count]) => (
//                             <li key={country} className="flex justify-between items-center text-sm">
//                               <span className="text-gray-400 font-medium">{country}</span>
//                               <span className="font-bold text-white px-2 py-0.5 bg-[#111] border border-[#2a2a2a] rounded-md">{String(count)}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       ) : (
//                         <p className="text-xs text-gray-600 font-medium italic text-center py-2">No geo-data collected yet.</p>
//                       )}
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Micro-Components ───

// function Field({ title, children }: { title: string, children: React.ReactNode }) {
//   return (
//     <div className="flex flex-col gap-2">
//       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</span>
//       <div>{children}</div>
//     </div>
//   );
// }

// function AnalyticStatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
//   return (
//     <div className={`p-4 rounded-2xl border ${color} flex flex-col gap-3 shadow-inner transition-transform hover:-translate-y-0.5`}>
//       <div className="flex justify-between items-center opacity-80">
//         <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
//         {icon}
//       </div>
//       <span className="text-2xl md:text-3xl font-black">{value.toLocaleString()}</span>
//     </div>
//   );
// }

// const inputCls = "w-full bg-[#111] border border-[#2a2a2a] text-white text-sm font-medium px-4 py-2.5 rounded-xl outline-none focus:border-sats-orange-500/50 focus:bg-[#151515] transition-all";
// ****************************************************************
// ****************************************************************
// ****************************************************************

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { updateCampaign, deleteCampaign } from '@/features/admin/adminCampaignsSlice';
import { 
  ArrowLeft, Edit3, Save, X, Link as LinkIcon, Loader2, Calendar, Trash2, 
  BarChart3, Activity, CheckCircle2, Clock, XCircle, Globe2, Medal, 
  Zap, Shield, Target, Crown, Users, Plus
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const CATEGORIES = ["SOCIAL", "SURVEY", "VIDEO_AD", "APP_INSTALL", "OFFERWALL", "LEARN_EARN", "DAILY_STREAK"];
const FREE_TIERS = ["BASIC", "COPPER", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "CROWN", "ELITE", "FOUNDER"];

// ─── Platform Logo Helper ───
export const PlatformLogo = ({ url, className = "w-6 h-6" }: { url: string | null, className?: string }) => {
  if (!url) return <LinkIcon className={className} />;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return <svg viewBox="0 0 24 24" className={`fill-current ${className}`}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
  }
  if (lowerUrl.includes('instagram.com')) {
    return <svg viewBox="0 0 24 24" className={`fill-current ${className}`}><path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>;
  }
  return <LinkIcon className={className} />;
};

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// ─── MAIN COMPONENT ───
export default function SingleCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [campaign, setCampaign] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [editForm, setEditForm] = useState<any>({});

  // Extracted fetch function so we can call it after updates to get fresh data
  const fetchCampaignData = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('sats_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Ensure cache: 'no-store' is present so Next.js doesn't serve stale data
      const [campRes, analyticsRes] = await Promise.all([
        fetch(`${API_URL}/admin/campaigns/${id}`, { headers, cache: 'no-store' }),
        fetch(`${API_URL}/admin/campaigns/${id}/analytics`, { headers, cache: 'no-store' }).catch(() => ({ ok: false }))
      ]);

      if (campRes.ok) {
        const campData = await campRes.json();
        setCampaign(campData);
        setEditForm(campData);
      }

      if (analyticsRes && analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }
    } catch (err) {
      console.error("Failed to fetch campaign data", err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCampaignData();
  }, [fetchCampaignData]);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Clean up payload based on Zod Schema
    const payload = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      category: editForm.category,
      isPremiumOnly: editForm.isPremiumOnly,
      requiredFreeTier: editForm.requiredFreeTier,
      baseRewardSats: Number(editForm.baseRewardSats),
      maxCompletions: Number(editForm.maxCompletions),
      tierRewardMatrix: editForm.tierRewardMatrix,
      isActive: editForm.isActive,
      targetUrl: editForm.targetUrl?.trim() || undefined,
      socialHandleTarget: editForm.socialHandleTarget?.trim() || undefined,
    };

    const result = await dispatch(updateCampaign({ id: campaign.id, data: payload }));
    
    if (updateCampaign.fulfilled.match(result)) {
      // Fetch Live from Database to ensure total synchronicity
      await fetchCampaignData();
      setIsEditing(false);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert("Failed to update campaign.");
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${campaign.title}"? All user submissions and associated tasks will be lost forever.`)) {
      setIsDeleting(true);
      const result = await dispatch(deleteCampaign(campaign.id));
      if (deleteCampaign.fulfilled.match(result)) {
        router.push('/admin/campaigns');
      } else {
        alert("Failed to delete campaign.");
        setIsDeleting(false);
      }
    }
  };

  const handleCancel = () => {
    setEditForm(campaign); // Revert changes
    setIsEditing(false);
  };

  const handleMatrixChange = (tier: string, value: string) => {
    setEditForm((prev: any) => ({
      ...prev,
      tierRewardMatrix: { ...prev.tierRewardMatrix, [tier]: value === '' ? 0 : parseInt(value, 10) }
    }));
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#020202] flex items-center justify-center"><Loader2 className="w-10 h-10 text-sats-orange-500 animate-spin" /></div>;
  }

  if (!campaign) {
    return <div className="min-h-screen bg-[#020202] flex items-center justify-center text-red-400 font-bold">Campaign not found.</div>;
  }

  const safeTotal = Number(campaign.totalCompletions) || 0;
  const safeMax = Number(campaign.maxCompletions) || 1;
  const progressPercent = Math.min((safeTotal / safeMax) * 100, 100);

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32 relative overflow-x-hidden">
      
      {/* ─── SUCCESS TOAST ─── */}
      <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-[#0a0a0a] border border-green-500/30 text-green-400 px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(34,197,94,0.15)] transition-all duration-500 ${showSuccess ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}>
        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <p className="font-bold text-sm text-white">Update Successful</p>
          <p className="text-xs opacity-80">Campaign has been refreshed live.</p>
        </div>
      </div>

      <div className="max-w-350 mx-auto w-full flex flex-col gap-6 md:gap-8">
        
        {/* ─── STICKY HEADER ─── */}
        <div className="sticky top-0 z-40 bg-[#020202]/80 backdrop-blur-xl border border-[#1a1a1a] rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-2xl mt-4">
          <button 
            onClick={() => router.push('/admin/campaigns')} 
            className="flex items-center text-gray-400 hover:text-white bg-[#0a0a0a] border border-[#1a1a1a] hover:bg-[#111] px-5 py-2.5 rounded-xl transition-all font-bold w-full sm:w-auto justify-center shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            {!isEditing ? (
              <>
                <button 
                  onClick={handleDelete} 
                  disabled={isDeleting}
                  className="flex items-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />} Delete
                </button>
                <button onClick={() => setIsEditing(true)} className="flex items-center bg-[#111] border border-[#2a2a2a] hover:bg-white/5 text-white px-6 py-2.5 rounded-xl transition-all shadow-sm font-bold">
                  <Edit3 className="w-4 h-4 mr-2" /> Edit Campaign
                </button>
              </>
            ) : (
              <>
                <button onClick={handleCancel} className="flex items-center text-gray-400 hover:text-white px-4 py-2.5 transition-colors font-bold">
                  <X className="w-5 h-5 mr-1.5" /> Cancel
                </button>
                <button onClick={handleSave} disabled={isSaving} className="flex items-center bg-green-500 hover:bg-green-400 text-black font-black px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(34,197,94,0.3)] active:scale-95">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          
          {/* ─── LEFT COLUMN (Spans 2): Campaign Details ─── */}
          <div className="xl:col-span-2 flex flex-col gap-6 md:gap-8">
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8">
              
              {/* Core Info Header */}
              <div className="flex items-start gap-6 mb-8 border-b border-[#1a1a1a] pb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#0a0a0a] border border-[#2a2a2a] flex items-center justify-center text-gray-400 shrink-0 shadow-inner">
                  <PlatformLogo url={campaign.targetUrl} className="w-8 h-8" />
                </div>
                <div className="flex-1 w-full overflow-hidden pt-1">
                  {!isEditing ? (
                    <>
                      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate mb-2">{campaign.title}</h1>
                      <p className="text-gray-400 leading-relaxed text-sm md:text-base">{campaign.description}</p>
                    </>
                  ) : (
                    <div className="space-y-4">
                      {/* Added minLength Validations */}
                      <input type="text" value={editForm.title} required minLength={5} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full bg-[#111] border border-[#2a2a2a] text-white text-xl font-bold px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 transition-all" placeholder="Campaign Title (Min 5 chars)" />
                      <textarea value={editForm.description} required minLength={10} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full bg-[#111] border border-[#2a2a2a] text-gray-300 px-4 py-3 rounded-xl outline-none focus:border-sats-orange-500 min-h-[120px] transition-all" placeholder="Description (Min 10 chars)" />
                    </div>
                  )}
                </div>
              </div>

              {/* Progress & Budget */}
              <div className="bg-gradient-to-b from-[#0a0a0a] to-[#050505] rounded-2xl p-6 border border-[#1a1a1a] mb-8">
                <div className="flex justify-between items-end mb-5">
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Completions Limit</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">{safeTotal.toLocaleString()}</span>
                      <span className="text-gray-500 font-medium">/ {safeMax.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center justify-end gap-1.5"><Zap className="w-3.5 h-3.5 text-sats-orange-500" /> Base Reward</p>
                    <span className="text-sats-orange-500 font-black text-3xl">~ {campaign.baseRewardSats.toLocaleString()} <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Sats</span></span>
                  </div>
                </div>
                <div className="w-full bg-[#111] border border-[#2a2a2a] rounded-full h-3 overflow-hidden shadow-inner">
                  <div className="h-full bg-sats-orange-500 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                
                <Field title="Campaign Status">
                  {!isEditing ? (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${campaign.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-gray-400 border-[#2a2a2a]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${campaign.isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></span>
                      {campaign.isActive ? 'Live & Active' : 'Paused / Draft'}
                    </span>
                  ) : (
                    <select value={editForm.isActive ? 'true' : 'false'} onChange={e => setEditForm({...editForm, isActive: e.target.value === 'true'})} className={inputCls}>
                      <option value="true">Active (Live)</option>
                      <option value="false">Paused (Draft)</option>
                    </select>
                  )}
                </Field>

                <Field title="Category">
                  {!isEditing ? (
                    <span className="text-white font-bold">{campaign.category.replace('_', ' ')}</span>
                  ) : (
                    <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className={inputCls}>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>)}
                    </select>
                  )}
                </Field>

                <Field title="Access Gate">
                  {!isEditing ? (
                    <div className="flex items-center gap-2">
                      {campaign.isPremiumOnly && <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-black text-yellow-400 uppercase tracking-widest"><Crown className="w-3 h-3" /> Premium Only</span>}
                      <span className="text-gray-300 font-bold text-sm uppercase tracking-wider bg-[#111] px-2 py-0.5 rounded border border-[#2a2a2a]">Tier: {campaign.requiredFreeTier}</span>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                       <select value={editForm.requiredFreeTier} onChange={e => setEditForm({...editForm, requiredFreeTier: e.target.value})} className={inputCls}>
                        {FREE_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <button type="button" onClick={() => setEditForm((prev: any) => ({ ...prev, isPremiumOnly: !prev.isPremiumOnly }))} className={`shrink-0 px-4 rounded-xl border text-xs font-bold transition-all ${editForm.isPremiumOnly ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-[#111] border-[#2a2a2a] text-gray-500'}`}>
                        <Crown className="w-4 h-4 mx-auto mb-0.5" /> Premium
                      </button>
                    </div>
                  )}
                </Field>

                <Field title="Base Economics">
                  {!isEditing ? (
                    <span className="text-white font-bold">{campaign.maxCompletions.toLocaleString()} Max <span className="text-gray-500 mx-2">|</span> {campaign.baseRewardSats.toLocaleString()} Sats Base</span>
                  ) : (
                    <div className="flex gap-4">
                      {/* Added min validation */}
                      <input type="number" required min={1} value={editForm.baseRewardSats} onChange={e => setEditForm({...editForm, baseRewardSats: Number(e.target.value)})} placeholder="Base Sats" className={inputCls} />
                      <input type="number" required min={1} value={editForm.maxCompletions} onChange={e => setEditForm({...editForm, maxCompletions: Number(e.target.value)})} placeholder="Max Users" className={inputCls} />
                    </div>
                  )}
                </Field>

                <Field title="Target URL">
                  {!isEditing ? (
                    <a href={campaign.targetUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline break-all font-medium">{campaign.targetUrl || 'N/A'}</a>
                  ) : (
                    <input type="url" value={editForm.targetUrl || ''} onChange={e => setEditForm({...editForm, targetUrl: e.target.value})} placeholder="https://..." className={inputCls} />
                  )}
                </Field>

                <Field title="Social Handle Requirement">
                  {!isEditing ? (
                    <span className="text-white font-medium">{campaign.socialHandleTarget || 'None'}</span>
                  ) : (
                    <input type="text" value={editForm.socialHandleTarget || ''} onChange={e => setEditForm({...editForm, socialHandleTarget: e.target.value})} placeholder="@username" className={inputCls} />
                  )}
                </Field>
                
                {/* ─── TIER MATRIX VIEW & EDIT ─── */}
                <div className="col-span-full mt-4 pt-6 border-t border-[#1a1a1a]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-4 flex items-center gap-2"><Medal className="w-4 h-4" /> Tier Reward Matrix</span>
                  
                  {!isEditing ? (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {FREE_TIERS.map(tier => (
                        <div key={tier} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-3 flex flex-col gap-1 shadow-sm">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{tier}</span>
                          <span className="text-white font-bold text-sm text-sats-orange-400">~ {campaign.tierRewardMatrix?.[tier] || 0}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {FREE_TIERS.map(tier => (
                        <div key={tier} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-2 flex flex-col gap-1">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{tier}</span>
                          {/* Added min validation */}
                          <input type="number" min={0} value={editForm.tierRewardMatrix?.[tier] || 0} onChange={(e) => handleMatrixChange(tier, e.target.value)} className="w-full bg-transparent text-white font-bold outline-none text-sm focus:border-b focus:border-sats-orange-500 pb-0.5" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-4 sm:gap-8 pt-8 mt-8 border-t border-[#1a1a1a] text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Deployed: {formatDate(campaign.createdAt)}</div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Last Updated: {formatDate(campaign.updatedAt)}</div>
              </div>
            </div>
            
            {/* ─── Task Management (Child Placeholder) ─── */}
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8 flex flex-col">
              <div className="flex items-center justify-between mb-6 border-b border-[#1a1a1a] pb-4">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-gray-400" /> Associated Tasks
                </h2>
                <button className="flex items-center justify-center gap-2 bg-[#111] border border-[#2a2a2a] hover:bg-white/5 text-white font-bold py-2 px-4 rounded-xl transition-all shadow-sm text-sm">
                  <Plus className="w-4 h-4" /> Add Task
                </button>
              </div>
              
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-gray-500 font-medium mb-1">Task management logic goes here.</p>
                <p className="text-xs text-gray-600">The parent campaign economics dictate default rewards.</p>
              </div>
            </div>

          </div>

          {/* ─── RIGHT COLUMN: Real-Time Analytics ─── */}
          {analytics && (
            <div className="xl:col-span-1 flex flex-col gap-6 md:gap-8">
              <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8 h-full">
                
                <div className="flex items-center gap-3 mb-8 border-b border-[#1a1a1a] pb-6">
                  <div className="p-2.5 bg-[#111] rounded-xl border border-[#2a2a2a] shadow-inner">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">Real-Time Traffic</h2>
                </div>

                <div className="space-y-6">
                  
                  {/* Status Breakdown */}
                  <div className="grid grid-cols-2 gap-3">
                    <AnalyticStatCard title="Total Traffic" value={analytics.totalSubmissions || 0} icon={<Activity className="w-4 h-4 text-gray-400" />} color="bg-[#0a0a0a] border-[#1a1a1a] text-white" />
                    <AnalyticStatCard title="Verified" value={analytics.statusCounts?.verified || 0} icon={<CheckCircle2 className="w-4 h-4 text-green-500" />} color="bg-green-500/5 border-green-500/20 text-green-400" />
                    <AnalyticStatCard title="Pending Review" value={analytics.statusCounts?.pending || 0} icon={<Clock className="w-4 h-4 text-yellow-500" />} color="bg-yellow-500/5 border-yellow-500/20 text-yellow-400" />
                    <AnalyticStatCard title="Rejected" value={analytics.statusCounts?.rejected || 0} icon={<XCircle className="w-4 h-4 text-red-500" />} color="bg-red-500/5 border-red-500/20 text-red-400" />
                  </div>

                  {/* Tier Distribution */}
                  <div className="pt-4">
                    <div className="flex items-center gap-2 mb-4 text-gray-400">
                      <Medal className="w-4 h-4 text-yellow-500" />
                      <h3 className="font-bold text-sm">Tier Distribution</h3>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4">
                      {Object.keys(analytics.tierDistribution || {}).length > 0 ? (
                        <ul className="space-y-3">
                          {Object.entries(analytics.tierDistribution).map(([tier, count]) => (
                            <li key={tier} className="flex justify-between items-center text-sm">
                              <span className="text-gray-400 uppercase tracking-widest text-[10px] font-black">{tier}</span>
                              <span className="font-bold text-white px-2 py-0.5 bg-[#111] border border-[#2a2a2a] rounded-md">{String(count)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-600 font-medium italic text-center py-2">No tier data collected yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Geo Distribution */}
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-4 text-gray-400">
                      <Globe2 className="w-4 h-4 text-blue-500" />
                      <h3 className="font-bold text-sm">Geographic Origin</h3>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                      {Object.keys(analytics.geographicDistribution || {}).length > 0 ? (
                        <ul className="space-y-3">
                          {Object.entries(analytics.geographicDistribution).map(([country, count]) => (
                            <li key={country} className="flex justify-between items-center text-sm">
                              <span className="text-gray-400 font-medium">{country}</span>
                              <span className="font-bold text-white px-2 py-0.5 bg-[#111] border border-[#2a2a2a] rounded-md">{String(count)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-600 font-medium italic text-center py-2">No geo-data collected yet.</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Micro-Components ───

function Field({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</span>
      <div>{children}</div>
    </div>
  );
}

function AnalyticStatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <div className={`p-4 rounded-2xl border ${color} flex flex-col gap-3 shadow-inner transition-transform hover:-translate-y-0.5`}>
      <div className="flex justify-between items-center opacity-80">
        <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
        {icon}
      </div>
      <span className="text-2xl md:text-3xl font-black">{value.toLocaleString()}</span>
    </div>
  );
}

const inputCls = "w-full bg-[#111] border border-[#2a2a2a] text-white text-sm font-medium px-4 py-2.5 rounded-xl outline-none focus:border-sats-orange-500/50 focus:bg-[#151515] transition-all";
