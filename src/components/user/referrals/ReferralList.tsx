'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Mail, Users } from 'lucide-react';
import type { UserReferral } from '@/types/user';

interface ReferralListProps {
  list: UserReferral[];
}

const PAGE_SIZE = 15;

export default function ReferralList({ list }: ReferralListProps) {
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedList = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return list.slice(startIndex, startIndex + PAGE_SIZE);
  }, [list, page]);

  return (
    <section className="bg-black border border-[#1a1a1a] rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 md:p-7 shadow-lg transition-all duration-300 hover:border-sats-orange-500/20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">My Network</h2>
            <span className="rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-sats-orange-300">
              {list.length} Users
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-400 font-medium">
            Track every referred user in a compact, easy-to-read view.
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <DesktopTable list={paginatedList} />
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={list.length}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}

function DesktopTable({ list }: { list: UserReferral[] }) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[#232323] bg-[#0b0b0b] shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#232323] bg-[linear-gradient(180deg,rgba(249,115,22,0.08),rgba(249,115,22,0.02))] px-4 py-3 sm:px-5">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-sats-orange-300">
          Network Overview
        </p>
        <p className="text-[11px] font-semibold text-gray-500 sm:text-xs inline lg:hidden">
          Swipe sideways to view all columns
        </p>
      </div>

      <div className="overflow-x-auto overscroll-x-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2a2a2a]">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-[#232323] bg-[#111111]">
              {['Username', 'Country', 'DOJ', 'Tasks', 'Status', 'Tier', 'Email'].map((heading) => (
                <th
                  key={heading}
                  className="px-4 xl:px-5 py-3 text-left text-[11px] font-black uppercase tracking-[0.16em] text-gray-500 whitespace-nowrap"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((referral) => {
              const data = getReferralDisplayData(referral);

              return (
                <tr key={referral.id} className="group border-b border-[#1c1c1c] last:border-b-0 transition-all duration-200 hover:bg-[linear-gradient(90deg,rgba(249,115,22,0.06),rgba(255,255,255,0.02),rgba(249,115,22,0.03))]">
                  <td className="px-4 xl:px-5 py-4 text-sm font-semibold text-white whitespace-nowrap transition-colors group-hover:text-sats-orange-100">{data.username}</td>
                  <td className="px-4 xl:px-5 py-4 text-sm text-gray-300 whitespace-nowrap transition-colors group-hover:text-white">{data.country}</td>
                  <td className="px-4 xl:px-5 py-4 text-sm text-gray-300 whitespace-nowrap transition-colors group-hover:text-white">{data.joinedAt}</td>
                  <td className="px-4 xl:px-5 py-4 text-sm font-semibold text-white whitespace-nowrap transition-colors group-hover:text-sats-orange-100">{data.tasksCompleted}</td>
                  <td className="px-4 xl:px-5 py-4 whitespace-nowrap">
                    <StatusBadge isActive={referral.isActive} />
                  </td>
                  <td className="px-4 xl:px-5 py-4 whitespace-nowrap">
                    <TierBadge tier={data.tier} />
                  </td>
                  <td className="px-4 xl:px-5 py-4 text-sm text-gray-300 max-w-[240px] xl:max-w-[320px] truncate transition-colors group-hover:text-white">{data.email}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}) {
  const start = totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, totalItems);

  if (totalItems <= PAGE_SIZE) {
    return (
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#1a1a1a] pt-4">
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          Showing {start}-{end} of {totalItems}
        </p>
      </div>
    );
  }

  const pages = getVisiblePages(page, totalPages);

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-[#1a1a1a] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs sm:text-sm text-gray-500 font-medium">
        Showing {start}-{end} of {totalItems}
      </p>

      <div className="flex items-center gap-2">
        <PaginationButton
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          ariaLabel="Previous page"
          icon={<ChevronLeft className="w-4 h-4" />}
        />

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={`min-w-[34px] h-[34px] rounded-xl border text-xs font-black transition-all ${
              pageNumber === page
                ? 'border-sats-orange-500 bg-sats-orange-500 text-black shadow-[0_0_18px_rgba(249,115,22,0.35)]'
                : 'border-[#2a2a2a] bg-[#111111] text-gray-300 hover:border-sats-orange-500/40 hover:text-white'
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <PaginationButton
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          ariaLabel="Next page"
          icon={<ChevronRight className="w-4 h-4" />}
        />
      </div>
    </div>
  );
}

function PaginationButton({
  onClick,
  disabled,
  ariaLabel,
  icon,
}: {
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="h-[34px] w-[34px] rounded-xl border border-[#2a2a2a] bg-[#111111] text-gray-300 transition-all hover:border-sats-orange-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[#2a2a2a]"
    >
      <span className="flex items-center justify-center">{icon}</span>
    </button>
  );
}

function StatusBadge({ isActive, compact = false }: { isActive: boolean; compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
        isActive
          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
          : 'border-white/10 bg-white/[0.05] text-gray-400'
      } ${compact ? 'min-w-[76px]' : ''}`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

function TierBadge({ tier, compact = false }: { tier: string; compact?: boolean }) {
  const theme = getTierTheme(tier);

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${theme} ${
        compact ? 'min-w-[80px]' : ''
      }`}
    >
      {formatTierLabel(tier)}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[22px] border border-dashed border-[#232323] bg-[#0b0b0b] px-4 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#232323] bg-[#111111]">
        <Users className="w-6 h-6 text-gray-500" />
      </div>
      <h3 className="mt-4 text-lg font-black text-white">No referrals yet</h3>
      <p className="mt-2 max-w-sm text-sm font-medium text-gray-400">
        Share your referral link to start building your network and tracking activity here.
      </p>
    </div>
  );
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5];
  }

  if (currentPage >= totalPages - 2) {
    return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
}

function getReferralDisplayData(referral: UserReferral) {
  const fallbackName = typeof referral.email === 'string' && referral.email.includes('@')
    ? referral.email.split('@')[0]
    : 'referral-user';

  return {
    username: referral.username?.trim() || referral.fullName?.trim() || fallbackName,
    country: referral.country?.trim() || 'N/A',
    joinedAt: referral.joinedAt
      ? new Date(referral.joinedAt).toLocaleDateString('en-GB')
      : 'N/A',
    tasksCompleted: Number(referral.tasksCompleted ?? 0),
    tier: referral.tier || 'BASIC',
    email: referral.email || 'No email available',
  };
}

function formatTierLabel(tier: string) {
  return tier.replace(/_/g, ' ');
}

function getTierTheme(tier: string) {
  const key = tier.toUpperCase();

  if (['FOUNDER', 'ELITE', 'CROWN', 'DIAMOND', 'PLATINUM'].includes(key)) {
    return 'border-violet-500/30 bg-violet-500/10 text-violet-200';
  }

  if (key === 'GOLD') {
    return 'border-amber-500/30 bg-amber-500/10 text-amber-200';
  }

  if (key === 'SILVER') {
    return 'border-slate-400/30 bg-slate-400/10 text-slate-200';
  }

  if (['BRONZE', 'COPPER'].includes(key)) {
    return 'border-orange-500/30 bg-orange-500/10 text-orange-200';
  }

  return 'border-white/10 bg-white/[0.06] text-gray-200';
}
