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
            <span className="rounded-full border border-sats-orange-400/30 bg-gradient-to-r from-sats-orange-500/18 to-amber-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-sats-orange-200 shadow-[0_0_20px_rgba(249,115,22,0.12)]">
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
    <div className="overflow-hidden rounded-[22px] border border-[#2a2a2a] bg-[#0b0b0b] shadow-[0_18px_60px_rgba(0,0,0,0.28)] ring-1 ring-sats-orange-500/6">
      <div className="flex items-center justify-between gap-3 border-b border-[#2a2a2a] bg-[linear-gradient(180deg,rgba(249,115,22,0.14),rgba(245,158,11,0.06))] px-4 py-3 sm:px-5">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-sats-orange-300">
          Network Overview
        </p>
        <p className="text-[11px] font-semibold text-gray-400 sm:text-xs inline lg:hidden">
          Swipe sideways to view all columns
        </p>
      </div>

      <div className="overflow-x-auto overscroll-x-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2a2a2a]">
        <table className="min-w-[1040px] w-full border-collapse">
          <thead>
            <tr className="border-b border-[#2a2a2a] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
              {['Username', 'Country', 'DOJ', 'Active Days', 'Tasks', 'Status', 'Tier', 'Email'].map((heading) => (
                <th
                  key={heading}
                  className="px-4 xl:px-5 py-3 text-left text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 whitespace-nowrap"
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
                <tr key={referral.id} className="group border-b border-[#1f1f1f] last:border-b-0 transition-all duration-200 hover:bg-[linear-gradient(90deg,rgba(249,115,22,0.10),rgba(255,255,255,0.03),rgba(234,179,8,0.06))]">
                  <td className="px-4 xl:px-5 py-4 text-sm font-semibold text-white whitespace-nowrap transition-colors group-hover:text-sats-orange-100">{data.username}</td>
                  <td className="px-4 xl:px-5 py-4 text-sm text-gray-300 whitespace-nowrap transition-colors group-hover:text-white">{data.country}</td>
                  <td className="px-4 xl:px-5 py-4 text-sm text-gray-300 whitespace-nowrap transition-colors group-hover:text-white">{data.joinedAt}</td>
                  <td className="px-4 xl:px-5 py-4 text-sm font-semibold text-sky-200 whitespace-nowrap transition-colors group-hover:text-sky-100">{data.activeDays}</td>
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
          ? 'border-emerald-400/30 bg-gradient-to-r from-emerald-500/18 to-green-400/10 text-emerald-200 shadow-[0_0_14px_rgba(52,211,153,0.12)]'
          : 'border-rose-400/18 bg-gradient-to-r from-white/[0.08] to-rose-500/[0.06] text-rose-200/90'
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
    country: formatCountryName(referral.country),
    joinedAt: referral.joinedAt
      ? new Date(referral.joinedAt).toLocaleDateString('en-GB')
      : 'N/A',
    activeDays: `${Number(referral.daysActiveLast30 ?? 0)}/30`,
    tasksCompleted: Number(referral.tasksCompleted ?? 0),
    tier: referral.tier || 'BASIC',
    email: referral.email || 'No email available',
  };
}

function formatCountryName(country?: string | null) {
  const value = country?.trim();

  if (!value) return 'N/A';

  const normalized = value.toLowerCase();

  if (
    normalized === 'united states of america' ||
    normalized === 'united states' ||
    normalized === 'usa' ||
    normalized === 'us'
  ) {
    return 'USA';
  }

  if (normalized === 'united kingdom') return 'UK';
  if (normalized === 'south korea') return 'S. Korea';
  if (normalized === 'united arab emirates') return 'UAE';

  return value.length > 18 ? `${value.slice(0, 15)}...` : value;
}

function formatTierLabel(tier: string) {
  return tier.replace(/_/g, ' ');
}

function getTierTheme(tier: string) {
  const key = tier.toUpperCase();

  if (key === 'FOUNDER') {
    return 'border-red-500/30 bg-gradient-to-r from-red-500/14 to-orange-500/10 text-red-200 shadow-[0_0_18px_rgba(239,68,68,0.12)]';
  }

  if (key === 'ELITE') {
    return 'border-fuchsia-500/30 bg-gradient-to-r from-fuchsia-500/14 to-violet-500/10 text-fuchsia-200 shadow-[0_0_18px_rgba(217,70,239,0.12)]';
  }

  if (key === 'CROWN') {
    return 'border-amber-500/30 bg-gradient-to-r from-amber-500/14 to-orange-500/10 text-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.12)]';
  }

  if (key === 'DIAMOND') {
    return 'border-cyan-400/30 bg-gradient-to-r from-cyan-400/14 to-sky-400/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]';
  }

  if (key === 'PLATINUM') {
    return 'border-indigo-400/30 bg-gradient-to-r from-indigo-400/14 to-violet-400/10 text-indigo-100 shadow-[0_0_18px_rgba(129,140,248,0.12)]';
  }

  if (key === 'GOLD') {
    return 'border-amber-500/30 bg-gradient-to-r from-amber-500/14 to-yellow-400/10 text-amber-100 shadow-[0_0_18px_rgba(245,158,11,0.12)]';
  }

  if (key === 'SILVER') {
    return 'border-slate-400/30 bg-gradient-to-r from-slate-400/14 to-zinc-300/10 text-slate-100';
  }

  if (['BRONZE', 'COPPER'].includes(key)) {
    return key === 'BRONZE'
      ? 'border-orange-500/30 bg-gradient-to-r from-orange-500/14 to-amber-700/10 text-orange-100'
      : 'border-orange-400/30 bg-gradient-to-r from-orange-400/14 to-yellow-700/10 text-orange-100';
  }

  return 'border-white/12 bg-gradient-to-r from-white/[0.08] to-white/[0.04] text-gray-100';
}
