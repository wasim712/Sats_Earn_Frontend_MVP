import type { AdminPremiumRequest } from '@/features/admin/adminPremiumRequestsSlice';

export type PremiumRequestFilter = 'ALL' | 'AVAILABLE' | 'CONTACTED' | 'COMPLETED' | 'CANCELLED';

export const premiumRequestFilterOptions: Array<{ key: PremiumRequestFilter; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: 'AVAILABLE', label: 'Available' },
  { key: 'CONTACTED', label: 'Contacted' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Canceled' },
];

const statusPriority: Record<AdminPremiumRequest['status'], number> = {
  OPEN: 0,
  CONTACTED: 1,
  COMPLETED: 2,
  CANCELLED: 3,
};

export function sortPremiumRequests(requests: AdminPremiumRequest[]) {
  return [...requests].sort((left, right) => {
    const statusDiff = statusPriority[left.status] - statusPriority[right.status];
    if (statusDiff !== 0) return statusDiff;
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

export function filterPremiumRequests(requests: AdminPremiumRequest[], filter: PremiumRequestFilter) {
  if (filter === 'ALL') return requests;
  if (filter === 'AVAILABLE') return requests.filter((request) => request.status === 'OPEN');
  return requests.filter((request) => request.status === filter);
}

export function getPremiumRequestCounts(requests: AdminPremiumRequest[]) {
  return {
    ALL: requests.length,
    AVAILABLE: requests.filter((request) => request.status === 'OPEN').length,
    CONTACTED: requests.filter((request) => request.status === 'CONTACTED').length,
    COMPLETED: requests.filter((request) => request.status === 'COMPLETED').length,
    CANCELLED: requests.filter((request) => request.status === 'CANCELLED').length,
  } as const;
}

export function getPremiumRequestStatusUi(status: AdminPremiumRequest['status']) {
  switch (status) {
    case 'CONTACTED':
      return {
        card: 'border-blue-500/25 bg-[linear-gradient(180deg,rgba(11,20,36,0.98),rgba(5,10,18,0.98))] shadow-[0_18px_50px_rgba(59,130,246,0.08)]',
        badge: 'border-blue-400/25 bg-blue-500/12 text-blue-300',
        accent: 'text-blue-300',
        label: 'Contacted',
      };
    case 'COMPLETED':
      return {
        card: 'border-green-500/25 bg-[linear-gradient(180deg,rgba(10,28,18,0.98),rgba(4,15,10,0.98))] shadow-[0_18px_50px_rgba(34,197,94,0.08)]',
        badge: 'border-green-400/25 bg-green-500/12 text-green-300',
        accent: 'text-green-300',
        label: 'Completed',
      };
    case 'CANCELLED':
      return {
        card: 'border-red-500/25 bg-[linear-gradient(180deg,rgba(34,11,11,0.98),rgba(20,6,6,0.98))] shadow-[0_18px_50px_rgba(239,68,68,0.08)]',
        badge: 'border-red-400/25 bg-red-500/12 text-red-300',
        accent: 'text-red-300',
        label: 'Canceled',
      };
    default:
      return {
        card: 'border-[#1a1a1a] bg-[#050505]',
        badge: 'border-[#2a2a2a] bg-[#111] text-gray-300',
        accent: 'text-gray-300',
        label: 'Open',
      };
  }
}

export function isPremiumRequestTerminal(status: AdminPremiumRequest['status']) {
  return status === 'COMPLETED' || status === 'CANCELLED';
}
