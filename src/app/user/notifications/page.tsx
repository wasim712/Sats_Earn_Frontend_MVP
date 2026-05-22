'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  Bell, CheckSquare, Wallet, Loader2, CheckCheck, 
  RefreshCw, AlertTriangle, ArrowRight, Activity, XCircle, CheckCircle2
} from 'lucide-react';
import {
  fetchUserNotifications,
  markAllUserNotificationsRead,
  markUserNotificationRead,
  type UserNotification,
} from '@/features/user/userNotificationsSlice';

export default function UserNotificationsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { notifications, isLoading, error } = useAppSelector((state) => state.userNotifications);
  const [refreshCooldownUntil, setRefreshCooldownUntil] = useState<number>(0);
  const [refreshNow, setRefreshNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRefreshNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(fetchUserNotifications());
  }, [dispatch]);

  const handleMarkAsRead = async (id: string) => {
    await dispatch(markUserNotificationRead(id));
    window.dispatchEvent(new Event('user-notifications-updated'));
  };

  const handleMarkAllRead = async () => {
    await dispatch(markAllUserNotificationsRead());
    window.dispatchEvent(new Event('user-notifications-updated'));
  };

  const refreshSecondsLeft = useMemo(() => {
    const remainingMs = refreshCooldownUntil - refreshNow;
    return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
  }, [refreshCooldownUntil, refreshNow]);

  const handleManualRefresh = async () => {
    if (refreshSecondsLeft > 0) {
      return;
    }

    setRefreshCooldownUntil(Date.now() + 30_000);
    await dispatch(fetchUserNotifications());
  };

  const handleNotificationClick = (notification: UserNotification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    const title = notification.title.toLowerCase();
    const message = notification.message.toLowerCase();

    if (notification.type.includes('SUBMISSION')) {
      router.push('/user/submissions');
    } else if (notification.type.includes('WITHDRAWAL')) {
      router.push('/user/wallet');
    } else if (title.includes('bug report') || title.includes('bug bounty') || message.includes('bug report') || message.includes('bug bounty')) {
      router.push('/user/bug-bounty');
    } else if (title.includes('quiz') || message.includes('quiz')) {
      router.push('/user/quiz');
    } else {
      router.push('/user/dashboard');
    }
  };

  const getNotificationUI = (type: string) => {
    switch (type) {
      case 'SUBMISSION_APPROVED': 
        return { icon: <CheckCircle2 className="w-5 h-5 text-green-400" />, border: 'border-green-500' };
      case 'SUBMISSION_REJECTED': 
        return { icon: <XCircle className="w-5 h-5 text-red-500" />, border: 'border-red-500' };
      case 'WITHDRAWAL_PAID': 
        return { icon: <Wallet className="w-5 h-5 text-sats-orange-500" />, border: 'border-sats-orange-500' };
      case 'WITHDRAWAL_REJECTED': 
        return { icon: <XCircle className="w-5 h-5 text-red-500" />, border: 'border-red-500' };
      default: 
        return { icon: <Activity className="w-5 h-5 text-blue-400" />, border: 'border-blue-500' };
    }
  };
   function NotificationsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse pb-20 p-4 md:p-6 lg:p-8 w-full">
      
      {/* ─── HEADER SKELETON ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-4 w-full">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {/* Header Icon */}
            <div className="w-[38px] h-[38px] bg-[#111] border border-[#2a2a2a] rounded-xl shrink-0" />
            {/* Header Title */}
            <div className="h-[36px] md:h-[40px] w-48 md:w-64 bg-white/5 rounded-xl" />
          </div>
          {/* Header Subtitle */}
          <div className="h-[20px] w-64 sm:w-80 bg-white/[0.03] rounded-lg mt-1" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <div className="w-[46px] h-[46px] bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl shrink-0" />
          {/* Mark All Read Button */}
          <div className="h-[46px] w-[144px] bg-[#111] border border-[#2a2a2a] rounded-xl shrink-0" />
        </div>
      </div>

      {/* ─── NOTIFICATIONS FEED SKELETON ─── */}
      <div className="bg-black border border-[#1a1a1a] rounded-[28px] overflow-hidden shadow-xl w-full">
        <div className="divide-y divide-[#141414] w-full">
          {/* Generating 5 skeleton rows to fill the screen nicely */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-full p-5 md:p-6 bg-[#0a0a0a]">
              <div className="flex items-start gap-4 md:gap-5 w-full">
                
                {/* Notification Icon */}
                <div className="mt-1 w-10 h-10 rounded-full bg-[#111] border border-[#2a2a2a] shrink-0" />
                
                {/* Notification Content */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-2">
                    {/* Title */}
                    <div className="h-[20px] w-48 sm:w-64 bg-white/10 rounded" />
                    {/* Timestamp */}
                    <div className="h-[14px] w-24 sm:w-32 bg-white/5 rounded shrink-0" />
                  </div>
                  
                  {/* Message body (2 lines) */}
                  <div className="flex flex-col gap-2 mt-2.5">
                    <div className="h-[14px] w-full bg-white/[0.03] rounded" />
                    <div className="h-[14px] w-3/4 sm:w-2/3 bg-white/[0.03] rounded" />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading && notifications.length === 0) {
    return <NotificationsSkeleton/>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 p-4 md:p-6 lg:p-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#111] border border-[#2a2a2a] rounded-xl shadow-inner">
              <Bell className="w-5 h-5 text-sats-orange-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Your Alerts</h1>
          </div>
          <p className="text-gray-400 text-sm">Updates on your task approvals and withdrawal payouts.</p>
        </div>

        <div className="flex items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={refreshSecondsLeft > 0}
              className="flex items-center justify-center p-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl text-gray-400 hover:text-white hover:bg-[#111] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title={refreshSecondsLeft > 0 ? `Next refresh after ${refreshSecondsLeft} seconds` : 'Refresh'}
            >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-[#111] border border-[#2a2a2a] rounded-xl text-white font-bold hover:bg-[#1a1a1a] transition-all disabled:opacity-50 active:scale-95"
          >
            <CheckCheck className="w-4 h-4 text-green-500" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* UNREAD PILL */}
      {unreadCount > 0 && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-full w-fit">
          <span className="w-2 h-2 rounded-full bg-sats-orange-500 animate-pulse"></span>
          <span className="text-xs font-black text-sats-orange-400 uppercase tracking-widest">{unreadCount} Unread Alerts</span>
        </div>
      )}

      {refreshSecondsLeft > 0 ? (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full w-fit text-xs font-black text-blue-300 uppercase tracking-widest">
          <RefreshCw className="w-3.5 h-3.5" />
          Next refresh after {refreshSecondsLeft} seconds
        </div>
      ) : null}

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}

      {/* NOTIFICATIONS FEED */}
      <div className="bg-black border border-[#1a1a1a] rounded-[28px] overflow-hidden shadow-xl">
        {notifications.length === 0 ? (
          <div className="p-16 text-center">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-bold text-white">No notifications yet</p>
            <p className="text-sm text-gray-500 mt-1">Complete tasks to start receiving updates on your earnings.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#141414]">
            {notifications.map((notification) => {
              const ui = getNotificationUI(notification.type);

              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`cursor-pointer w-full text-left p-5 md:p-6 transition-all group ${
                    notification.isRead 
                      ? 'bg-transparent hover:bg-[#050505]' 
                      : `bg-[#0a0a0a] hover:bg-[#111] border-l-2 ${ui.border}`
                  }`}
                >
                  <div className="flex items-start gap-4 md:gap-5">
                    
                    {/* Icon */}
                    <div className={`mt-1 flex items-center justify-center w-10 h-10 rounded-full shrink-0 border ${
                      notification.isRead ? 'bg-[#050505] border-[#1a1a1a] opacity-50' : 'bg-[#111] border-[#2a2a2a]'
                    }`}>
                      {ui.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-1">
                        <h3 className={`text-base truncate ${notification.isRead ? 'text-gray-400 font-semibold' : 'text-white font-black'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest shrink-0">
                          {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${notification.isRead ? 'text-gray-500' : 'text-gray-300'}`}>
                        {notification.message}
                      </p>
                    </div>

                    {/* Action Arrow */}
                    <div className="shrink-0 flex items-center self-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-gray-500" />
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
