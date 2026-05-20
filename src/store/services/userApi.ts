import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';
import type { UserNotification } from '@/features/user/userNotificationsSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function getToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['UserNotifications', 'MiniGameReward'],
  endpoints: (builder) => ({
    getUserNotifications: builder.query<UserNotification[], void>({
      async queryFn() {
        try {
          const token = getToken();
          const response = await obfuscatedFetch(`${API_URL}/users/notifications`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await parseObfuscatedJson<UserNotification[]>(response);

          if (!response.ok) {
            return { error: { status: response.status, data } };
          }

          return { data: Array.isArray(data) ? data : [] };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', data: error instanceof Error ? error.message : 'Failed to fetch notifications.' } };
        }
      },
      providesTags: ['UserNotifications'],
    }),
    claimSatWormReward: builder.mutation<
      { message?: string; reward?: { satsEarned: number; xpEarned: number } },
      Record<string, unknown>
    >({
      async queryFn(payload) {
        try {
          const token = getToken();
          const response = await obfuscatedFetch(`${API_URL}/users/minigames/sat-worm/claim`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          const data = await parseObfuscatedJson<{ message?: string; reward?: { satsEarned: number; xpEarned: number } }>(response);

          if (!response.ok) {
            return { error: { status: response.status, data } };
          }

          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', data: error instanceof Error ? error.message : 'Failed to claim SAT-WORM reward.' } };
        }
      },
      invalidatesTags: ['UserNotifications', 'MiniGameReward'],
    }),
  }),
});

export const { useGetUserNotificationsQuery, useClaimSatWormRewardMutation } = userApi;
