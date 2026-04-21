// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { fetchAllUsers, clearUsersState } from '@/features/admin/adminUsersSlice';
// import { 
//   Search, ShieldAlert, Crown, User as UserIcon, 
//   Zap, Calendar, MoreHorizontal, ArrowDownToLine, Coins
// } from 'lucide-react';

// export default function AdminUsersPage() {
//   const dispatch = useAppDispatch();
//   const { users, isLoading, error } = useAppSelector((state) => state.adminUsers);
  
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     dispatch(fetchAllUsers());
//     return () => { dispatch(clearUsersState()); };
//   }, [dispatch]);

//   // Client-side search filter
//   const filteredUsers = users.filter((u) => 
//     u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     (u.fullName && u.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
//     (u.referralCode && u.referralCode.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   // ─── Loading Skeleton ──────────────────────────────────────────────────────
//   if (isLoading && users.length === 0) {
//     return (
//       <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 animate-pulse">
//         <div className="max-w-7xl mx-auto">
//           <div className="h-10 w-48 bg-[#1a1a1a] rounded-xl mb-8" />
//           <div className="bg-[#080808] border border-[#1a1a1a] rounded-3xl p-6">
//             <div className="h-12 w-full bg-[#1a1a1a] rounded-xl mb-6" />
//             <div className="space-y-4">
//               {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 w-full bg-[#1a1a1a] rounded-xl" />)}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ─── Error State ────────────────────────────────────────────────────────────
//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#020202] flex items-center justify-center p-4">
//         <div className="bg-[#050505] border border-red-500/20 text-red-400 p-8 rounded-3xl flex flex-col items-center gap-4 max-w-sm text-center">
//           <ShieldAlert className="w-12 h-12 text-red-500/80" />
//           <p className="font-semibold text-lg">{error}</p>
//           <button 
//             onClick={() => dispatch(fetchAllUsers())} 
//             className="px-6 py-2.5 bg-[#111] border border-[#2a2a2a] rounded-xl text-sm text-white hover:bg-white/5 transition-all mt-2"
//           >
//             Retry Fetch
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ─── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
//       <div className="max-w-[1400px] mx-auto">
        
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-4">
//           <div>
//             <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">User Directory</h1>
//             <p className="text-gray-400 text-sm mt-1">Manage all registered users, balances, and tiers.</p>
//           </div>
          
//           <div className="flex items-center gap-3 w-full md:w-auto">
//             <div className="relative flex-1 md:w-80">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
//               <input 
//                 type="text" 
//                 placeholder="Search email, name, or referral..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-sats-orange-500/50 focus:bg-[#111] transition-all"
//               />
//             </div>
//             <button className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl text-white font-semibold hover:bg-[#111] transition-all shrink-0 shadow-sm">
//               <ArrowDownToLine className="w-4 h-4" /> Export
//             </button>
//           </div>
//         </div>

//         {/* Data Table Card */}
//         <div className="bg-[#080808] border border-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl relative">
          
//           {/* Ambient Glow */}
//           <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 blur-[120px] rounded-full pointer-events-none" />

//           <div className="overflow-x-auto custom-scrollbar relative z-10">
//             <table className="w-full text-left border-collapse min-w-[1000px]">
//               <thead>
//                 <tr className="border-b border-[#1a1a1a] bg-[#050505]">
//                   <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">User Details</th>
//                   <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status & Tier</th>
//                   <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Balances</th>
//                   <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Engagement</th>
//                   <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Joined</th>
//                   <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#1a1a1a]">
//                 {filteredUsers.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="px-6 py-16 text-center">
//                       <div className="flex flex-col items-center justify-center text-gray-500">
//                         <Search className="w-8 h-8 mb-3 opacity-20" />
//                         <p className="font-medium text-sm">No users found matching your search.</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredUsers.map((user) => {
//                     const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    
//                     return (
//                       <tr key={user.id} className="hover:bg-[#0c0c0c] transition-colors group">
                        
//                         {/* 1. User Details */}
//                         <td className="px-6 py-5 align-middle">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-full bg-[#111] border border-[#2a2a2a] flex items-center justify-center shrink-0">
//                               <UserIcon className="w-4 h-4 text-gray-400" />
//                             </div>
//                             <div className="min-w-0">
//                               <p className="text-sm font-bold text-white truncate max-w-[200px]">{user.fullName || 'No Name'}</p>
//                               <p className="text-xs font-medium text-gray-500 truncate max-w-[200px]">{user.email}</p>
//                             </div>
//                           </div>
//                         </td>

//                         {/* 2. Status & Tier */}
//                         <td className="px-6 py-5 align-middle">
//                           <div className="flex flex-col items-start gap-1.5">
//                             {/* Role Badge */}
//                             <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
//                               user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-[#111] text-gray-400 border border-[#2a2a2a]'
//                             }`}>
//                               {user.role}
//                             </span>
//                             {/* Tier Badge */}
//                             <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
//                               user.isPremium 
//                                 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.1)]' 
//                                 : 'bg-white/5 border-white/10 text-white/40'
//                             }`}>
//                               {user.isPremium && <Crown className="w-3 h-3" />}
//                               {user.activeTier}
//                             </span>
//                           </div>
//                         </td>

//                         {/* 3. Balances */}
//                         <td className="px-6 py-5 align-middle">
//                           <div className="flex flex-col gap-1">
//                             <p className="flex items-center gap-1.5 text-sm font-bold text-sats-orange-500">
//                               <Coins className="w-3.5 h-3.5" /> {user.balanceAvailable} <span className="text-[10px] font-medium text-sats-orange-500/50 uppercase">Avail</span>
//                             </p>
//                             {(user.balancePending > 0 || user.balanceLocked > 0) && (
//                               <p className="text-xs font-medium text-gray-500 pl-5">
//                                 + {user.balancePending + user.balanceLocked} <span className="text-[10px] uppercase">Pending/Locked</span>
//                               </p>
//                             )}
//                           </div>
//                         </td>

//                         {/* 4. Engagement */}
//                         <td className="px-6 py-5 align-middle">
//                           <div className="flex flex-col gap-1">
//                             <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-300">
//                               <Zap className="w-3 h-3 text-yellow-500" /> {user.totalXp} XP
//                             </p>
//                             <p className="text-[10px] text-gray-500 uppercase tracking-wide">
//                               {user._count.submissions} Quizzes · {user._count.referrals} Refs
//                             </p>
//                           </div>
//                         </td>

//                         {/* 5. Joined */}
//                         <td className="px-6 py-5 align-middle">
//                           <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
//                             <Calendar className="w-4 h-4 text-gray-600" /> {joinedDate}
//                           </div>
//                         </td>

//                         {/* 6. Actions */}
//                         <td className="px-6 py-5 align-middle text-right">
//                           <button className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
//                             <MoreHorizontal className="w-5 h-5" />
//                           </button>
//                         </td>

//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
          
//           {/* Pagination Footer Placeholder */}
//           <div className="p-4 border-t border-[#1a1a1a] bg-[#050505] flex items-center justify-between text-xs text-gray-500 font-medium">
//             <p>Showing <span className="text-white">{filteredUsers.length}</span> user{filteredUsers.length !== 1 ? 's' : ''}</p>
//             {/* Future Pagination Controls Can Go Here */}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }   
'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllUsers, clearUsersState } from '@/features/admin/adminUsersSlice';
import { 
  Search, ShieldAlert, Crown, User as UserIcon, 
  Zap, Calendar, ArrowDownToLine, Coins, 
  Medal, Eye, Pencil, Ban
} from 'lucide-react';

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const { users, isLoading, error } = useAppSelector((state) => state.adminUsers);
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAllUsers());
    return () => { dispatch(clearUsersState()); };
  }, [dispatch]);

  // Client-side search filter
  const filteredUsers = users.filter((u) => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.fullName && u.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.referralCode && u.referralCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ─── Functional Export to CSV ───────────────────────────────────────────────
  const handleExportCSV = () => {
    if (filteredUsers.length === 0) return;
    
    // Create CSV headers
    const headers = ['ID', 'Email', 'Full Name', 'Role', 'Tier', 'Available Sats', 'Total XP', 'Joined Date'];
    
    // Map user data to CSV rows
    const csvRows = filteredUsers.map(u => [
      u.id,
      u.email,
      `"${u.fullName || ''}"`, // Quotes to handle commas in names
      u.role,
      u.activeTier,
      u.balanceAvailable,
      u.totalXp,
      new Date(u.createdAt).toLocaleDateString()
    ].join(','));
    
    // Combine headers and rows
    const csvString = [headers.join(','), ...csvRows].join('\n');
    
    // Trigger download
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SatsEarn_Users_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ─── Loading Skeleton ──────────────────────────────────────────────────────
  if (isLoading && users.length === 0) {
    return (
      <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 animate-pulse">
        <div className="max-w-[1400px] mx-auto">
          <div className="h-10 w-48 bg-[#1a1a1a] rounded-xl mb-8" />
          <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6">
            <div className="h-12 w-full bg-[#1a1a1a] rounded-xl mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 w-full bg-[#1a1a1a] rounded-2xl" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-4">
        <div className="bg-[#050505] border border-red-500/20 text-red-400 p-8 rounded-3xl flex flex-col items-center gap-4 max-w-sm text-center shadow-2xl shadow-red-500/5">
          <ShieldAlert className="w-12 h-12 text-red-500/80" />
          <p className="font-semibold text-lg">{error}</p>
          <button 
            onClick={() => dispatch(fetchAllUsers())} 
            className="px-6 py-2.5 bg-[#111] border border-[#2a2a2a] rounded-xl text-sm text-white hover:bg-white/5 transition-all mt-2"
          >
            Retry Fetch
          </button>
        </div>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6 md:gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mt-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-sats-orange-500 tracking-tight">User Directory</h1>
            <p className="text-gray-400 text-sm mt-1">Monitor and manage the user base, balances, and tiers.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-80 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search email, name, or referral..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-sats-orange-500/50 focus:bg-[#111] transition-all shadow-inner"
              />
            </div>
            <button 
              onClick={handleExportCSV}
              disabled={filteredUsers.length === 0}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl text-white font-bold hover:bg-[#111] hover:border-[#333] transition-all shrink-0 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
            >
              <ArrowDownToLine className="w-4 h-4 text-sats-orange-500" /> Export CSV
            </button>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
          
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              
              {/* Table Header */}
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#0a0a0a]/50">
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Player</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Rank & Status</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Wealth</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Stats</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Registration</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Admin Actions</th>
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody className="divide-y divide-[#1a1a1a]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl flex items-center justify-center mb-4">
                          <Search className="w-8 h-8 opacity-40" />
                        </div>
                        <p className="font-bold text-base text-gray-300">No players found</p>
                        <p className="text-sm mt-1">Adjust your search parameters and try again.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    
                    return (
                      <tr key={user.id} className="hover:bg-gradient-to-r hover:from-white/[0.02] hover:to-transparent transition-all group">
                        
                        {/* 1. User Details */}
                        <td className="px-6 py-5 align-middle">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#111] border border-[#2a2a2a] flex items-center justify-center shrink-0 shadow-inner group-hover:border-sats-orange-500/30 transition-colors">
                              <UserIcon className="w-4 h-4 text-gray-400 group-hover:text-sats-orange-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-white truncate max-w-[180px]">{user.fullName || 'Anonymous Player'}</p>
                              <p className="text-xs font-medium text-gray-500 truncate max-w-[180px]">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* 2. Rank & Status */}
                        <td className="px-6 py-5 align-middle">
                          <div className="flex flex-col items-start gap-2">
                            {/* Role Badge */}
                            {user.role === 'ADMIN' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm">
                                System Admin
                              </span>
                            )}
                            
                            {/* Dynamic Tier Badge */}
                            <TierBadge tier={user.activeTier} isPremium={user.isPremium} />
                          </div>
                        </td>

                        {/* 3. Wealth (Balances) */}
                        <td className="px-6 py-5 align-middle">
                          <div className="flex flex-col gap-1.5">
                            <p className="flex items-center gap-1.5 text-sm font-black text-sats-orange-500">
                              <Coins className="w-4 h-4 shrink-0" /> {user.balanceAvailable} <span className="text-[10px] font-bold text-sats-orange-500/50 uppercase tracking-widest">Sats</span>
                            </p>
                            {(user.balancePending > 0 || user.balanceLocked > 0) && (
                              <p className="text-xs font-semibold text-gray-500 pl-5.5">
                                + {user.balancePending + user.balanceLocked} <span className="text-[9px] uppercase tracking-wider opacity-70">Locked</span>
                              </p>
                            )}
                          </div>
                        </td>

                        {/* 4. Stats (Engagement) */}
                        <td className="px-6 py-5 align-middle">
                          <div className="flex flex-col gap-1.5">
                            <p className="flex items-center gap-1.5 text-xs font-bold text-gray-200">
                              <Zap className="w-3.5 h-3.5 text-yellow-500" /> {user.totalXp.toLocaleString()} <span className="text-gray-500">XP</span>
                            </p>
                            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                              {user._count.submissions} Q&apos;s · {user._count.referrals} Refs
                            </p>
                          </div>
                        </td>

                        {/* 5. Registration */}
                        <td className="px-6 py-5 align-middle">
                          <div className="flex items-center gap-2 text-sm text-gray-400 font-semibold">
                            <Calendar className="w-4 h-4 text-gray-500 shrink-0" /> {joinedDate}
                          </div>
                        </td>

                        {/* 6. Admin Actions (Functional UI) */}
                        <td className="px-6 py-5 align-middle text-right">
                          <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button title="View User's Profile" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button title="Edit User" className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button title="Suspend User" className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination/Status Footer */}
          <div className="p-5 border-t border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-widest mt-auto">
            <p>Displaying <span className="text-white">{filteredUsers.length}</span> Account{filteredUsers.length !== 1 ? 's' : ''}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Micro-Component: Dynamic Tier Badge ─────────────────────────────────────
function TierBadge({ tier, isPremium }: { tier: string, isPremium: boolean }) {
  const t = tier.toUpperCase();
  
  // Determine color palette based on tier name
  let styles = { color: 'text-gray-400', bg: 'bg-[#111]', border: 'border-[#2a2a2a]' }; // Basic
  
  if (t.includes('BRONZE')) {
    styles = { color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
  } else if (t.includes('SILVER')) {
    styles = { color: 'text-slate-300', bg: 'bg-slate-300/10', border: 'border-slate-300/20' };
  } else if (t.includes('GOLD')) {
    styles = { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' };
  } else if (t.includes('DIAMOND') || t.includes('PLATINUM')) {
    styles = { color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' };
  }

  // If they have a premium subscription, override with a special glowing effect
  if (isPremium) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
        <Crown className="w-3.5 h-3.5" /> Premium {t}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${styles.bg} ${styles.border} ${styles.color}`}>
      <Medal className="w-3.5 h-3.5" /> {t}
    </span>
  );
}