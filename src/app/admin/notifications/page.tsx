'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  Bell, CheckSquare, Wallet, Loader2, CheckCheck, 
  RefreshCw, AlertTriangle, ArrowRight, Activity
} from 'lucide-react';
import { fetchAdminNotifications, markAdminNotificationRead, markAllAdminNotificationsRead } from '@/features/admin/adminNotificationsSlice';
import type { AdminNotification } from '@/types/admin';

export default function AdminNotificationsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { notifications, isLoading, error } = useAppSelector((state) => state.adminNotifications);

  const fetchNotifications = async () => {
    await dispatch(fetchAdminNotifications());
  };

  useEffect(() => {
    fetchNotifications();
  }, [dispatch]);

const handleMarkAllRead = async () => {
  try {
    await dispatch(markAllAdminNotificationsRead()).unwrap();
    window.dispatchEvent(new Event('notifications-updated'));
    
  } catch (err) {
    console.error("Failed to mark all as read", err);
  }
};
const handleMarkAsRead = async (id: string) => {
  try {
    await dispatch(markAdminNotificationRead(id)).unwrap();
    window.dispatchEvent(new Event('notifications-updated'));

  } catch (err) {
    console.error("Failed to mark as read", err);
  }
};

  const handleNotificationClick = (notification: AdminNotification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    // Route to the specific queue based on the notification type
    if (notification.type === 'NEW_SUBMISSION') {
      router.push('/admin/submissions');
    } else if (notification.type === 'NEW_WITHDRAWAL') {
      router.push('/admin/payments');
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'NEW_SUBMISSION': return <CheckSquare className="w-5 h-5 text-blue-400" />;
      case 'NEW_WITHDRAWAL': return <Wallet className="w-5 h-5 text-sats-orange-500" />;
      default: return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading && notifications.length === 0) {
    return <div className="min-h-screen bg-[#020202] flex items-center justify-center"><Loader2 className="w-10 h-10 text-sats-orange-500 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 md:gap-8">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#111] border border-[#2a2a2a] rounded-lg shadow-inner">
                <Bell className="w-5 h-5 text-sats-orange-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">System Alerts</h1>
            </div>
            <p className="text-gray-400 text-sm">Monitor incoming task submissions and withdrawal requests.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchNotifications}
              className="flex items-center justify-center p-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl text-gray-400 hover:text-white hover:bg-[#111] transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[#111] border border-[#2a2a2a] rounded-xl text-white font-bold hover:bg-[#1a1a1a] transition-all disabled:opacity-50"
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

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        {/* NOTIFICATIONS FEED */}
        <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-bold text-white">All caught up!</p>
              <p className="text-sm text-gray-500 mt-1">There are no system alerts at this time.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#141414]">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`cursor-pointer w-full text-left p-5 transition-all group ${
                    notification.isRead 
                      ? 'bg-transparent hover:bg-[#0b0b0b]' 
                      : 'bg-[#111] hover:bg-[#161616] border-l-2 border-l-sats-orange-500'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    
                    {/* Icon */}
                    <div className={`mt-1 flex items-center justify-center w-10 h-10 rounded-full shrink-0 border ${
                      notification.isRead ? 'bg-[#0a0a0a] border-[#2a2a2a]' : 'bg-[#1a1a1a] border-[#333]'
                    }`}>
                      {getIconForType(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-1">
                        <h3 className={`text-base truncate ${notification.isRead ? 'text-gray-300 font-semibold' : 'text-white font-black'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest shrink-0">
                          {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${notification.isRead ? 'text-gray-500' : 'text-gray-300'}`}>
                        {notification.message}
                      </p>
                    </div>

                    {/* Action Arrow */}
                    <div className="shrink-0 flex items-center self-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-sats-orange-500" />
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
