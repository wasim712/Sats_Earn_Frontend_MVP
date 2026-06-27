'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearUsersState, fetchAllUsers, fetchUserDetail as fetchUserDetailThunk, performUserAction } from '@/features/admin/adminUsersSlice';
import { ArrowDownToLine, Eye, RefreshCcw, Search, User as UserIcon } from 'lucide-react';
import { ErrorState, LoadingState, StatusPill, UserDetailModal } from '@/components/admin/users/AdminUsersPageSections';

type ActionState = {
  loading: boolean;
  error: string | null;
};

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const { users, isLoading, error, selectedUserDetail, detailLoading, detailError, actionLoading } = useAppSelector((state) => state.adminUsers);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [actionState, setActionState] = useState<ActionState>({ loading: false, error: null });

  useEffect(() => {
    dispatch(fetchAllUsers());
    return () => {
      dispatch(clearUsersState());
    };
  }, [dispatch]);

  const visibleUsers = users;

  const filteredUsers = useMemo(() => {
    return visibleUsers.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.referralCode || '').toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, visibleUsers]);

  const fetchUserDetail = async (userId: string) => {
    setSelectedUserId(userId);
    setActionState({ loading: false, error: null });
    await dispatch(fetchUserDetailThunk(userId));
  };

  const refreshUsers = () => {
    dispatch(fetchAllUsers());
  };

  const handleUserAction = async (action: 'ban' | 'activate' | 'delete') => {
    if (!selectedUserDetail) return;

    const actionLabel = action === 'ban' ? 'suspend' : action === 'activate' ? 'reactivate' : 'delete';
    const confirmed = window.confirm(`Are you sure you want to ${actionLabel} this user account?`);
    if (!confirmed) return;

    setActionState({ loading: true, error: null });

    try {
      await dispatch(performUserAction({ userId: selectedUserDetail.id, action })).unwrap();

      await refreshUsers();

      if (action === 'delete') {
        setSelectedUserId(null);
      } else {
        await fetchUserDetail(selectedUserDetail.id);
      }
    } catch (actionError) {
      const message = actionError instanceof Error ? actionError.message : 'Action failed';
      setActionState({ loading: false, error: message });
      return;
    }

    setActionState({ loading: false, error: null });
  };

  const handleExportCSV = () => {
    if (filteredUsers.length === 0) return;

    const headers = ['ID', 'Email', 'Full Name', 'Role', 'Active Tier', 'Available Sats', 'Pending Sats', 'Locked Sats', 'Total XP', 'Account Active', 'Recently Active (24h)', 'Joined'];
    const rows = filteredUsers.map((user) => [
      user.id,
      user.email,
      `"${user.fullName || ''}"`,
      user.role,
      user.activeTier,
      user.balanceAvailable,
      user.balancePending,
      user.balanceLocked,
      user.totalXp,
      user.isActive ? 'Yes' : 'No',
      user.isRecentlyActive ? 'Yes' : 'No',
      new Date(user.createdAt).toISOString(),
    ].join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `admin-users-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  if (isLoading && visibleUsers.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refreshUsers} />;
  }

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black">User Administration</h1>
            <p className="text-sm text-gray-400 mt-1">Inspect user profiles, control account access, and audit how sats reach user accounts.</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#111] border border-[#2a2a2a] hover:bg-[#171717] transition-all text-sm font-semibold"
          >
            <ArrowDownToLine className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="bg-sats-black-950 border border-[#1a1a1a] rounded-3xl overflow-hidden">
          <div className="p-5 border-b border-[#1a1a1a] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, email, or referral code"
                className="w-full bg-[#0b0b0b] border border-[#1a1a1a] rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-sats-orange-500/40"
              />
            </div>
            <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              {filteredUsers.length} account{filteredUsers.length === 1 ? '' : 's'}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#0b0b0b] text-gray-400 uppercase tracking-widest text-[11px]">
                <tr>
                  <th className="text-left px-6 py-4">User</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Balances</th>
                  <th className="text-left px-6 py-4">Activity</th>
                  <th className="text-left px-6 py-4">Joined</th>
                  <th className="text-right px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-[#141414] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#111] border border-[#222] flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-sats-orange-500" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{user.fullName || 'Anonymous User'}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <StatusPill active={user.isActive} />
                        <p className="text-xs text-gray-400">{user.role} · {user.activeTier}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1.5">
                        <p className="text-sats-orange-500 font-bold">{user.balanceAvailable.toLocaleString()} sats</p>
                        <p className="text-xs text-yellow-500">Pending: {user.balancePending.toLocaleString()}</p>
                        <p className="text-xs text-blue-400">Locked: {user.balanceLocked.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1.5 text-xs text-gray-400">
                        <p>{user.totalXp.toLocaleString()} XP</p>
                        <p>{user._count?.submissions || 0} submissions</p>
                        <p>{user._count?.referrals || 0} referrals</p>
                        <p className={user.isRecentlyActive ? 'text-green-400' : 'text-gray-400'}>
                          {user.isRecentlyActive ? 'Active in last 24h' : 'No activity in last 24h'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => fetchUserDetail(user.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111] border border-[#2a2a2a] hover:bg-[#1a1a1a] text-xs font-semibold"
                        >
                          <Eye className="w-4 h-4" /> Quick View
                        </button>
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/20 hover:bg-sats-orange-500/15 text-xs font-semibold text-sats-orange-400"
                        >
                          Open Page
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedUserId && (
        <UserDetailModal
          detail={selectedUserDetail}
          loading={detailLoading}
          error={detailError || actionState.error}
          actionLoading={actionState.loading || actionLoading}
          onClose={() => {
            setSelectedUserId(null);
            setActionState({ loading: false, error: null });
          }}
          onBan={() => handleUserAction('ban')}
          onActivate={() => handleUserAction('activate')}
          onDelete={() => handleUserAction('delete')}
          onRefresh={() => selectedUserId && fetchUserDetail(selectedUserId)}
        />
      )}
    </div>
  );
}


