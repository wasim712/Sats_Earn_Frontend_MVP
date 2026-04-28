'use client';

import React, { useEffect, useState } from 'react';
import { Megaphone, AlertTriangle, CheckCircle2, Zap, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'PROMOTION';
}

export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = sessionStorage.getItem('dismissed_announcements');
    if (stored) {
      setDismissedIds(new Set(JSON.parse(stored)));
    }

    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(`${API_URL}/public/announcements/active`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data?.data;
          if (Array.isArray(list)) setAnnouncements(list);
        }
      } catch (err) {
        console.error('Failed to fetch announcements', err);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleDismiss = (id: string) => {
    const newDismissed = new Set(dismissedIds);
    newDismissed.add(id);
    setDismissedIds(newDismissed);
    sessionStorage.setItem('dismissed_announcements', JSON.stringify(Array.from(newDismissed)));
  };

  const visibleAnnouncements = announcements.filter(a => !dismissedIds.has(a.id));

  if (visibleAnnouncements.length === 0) return null;

  const getUIConfig = (type: string) => {
    switch (type) {
      case 'WARNING': 
        return { icon: <AlertTriangle className="w-4 h-4 text-yellow-900" />, bg: 'bg-yellow-500', text: 'text-yellow-950' };
      case 'SUCCESS': 
        return { icon: <CheckCircle2 className="w-4 h-4 text-green-900" />, bg: 'bg-green-500', text: 'text-green-950' };
      case 'PROMOTION': 
        return { icon: <Zap className="w-4 h-4 text-black" />, bg: 'bg-orange-500', text: 'text-black' };
      default: 
        return { icon: <Megaphone className="w-4 h-4 text-blue-900" />, bg: 'bg-blue-500', text: 'text-blue-950' };
    }
  };

  return (
    <>
      <style>{`
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-reverse {
          display: flex;
          width: max-content;
          animation: marquee-reverse 30s linear infinite;
        }
        .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Main Container */}
      <div className="sticky top-15 z-[100] w-full overflow-hidden bg-transparent  shadow-2xl">
        <div className="relative flex items-center">
          
          {/* The Scrolling Track */}
          <div className="animate-marquee-reverse whitespace-nowrap flex py-2">
            {/* Render items twice for a seamless loop */}
            {[...visibleAnnouncements, ...visibleAnnouncements].map((announcement, idx) => {
              const ui = getUIConfig(announcement.type);
              return (
                <div 
                  key={`${announcement.id}-${idx}`} 
                  className={`inline-flex items-center gap-3 px-8 py-1 mx-2 rounded-full ${ui.bg} ${ui.text}`}
                >
                  <span className="shrink-0">{ui.icon}</span>
                  <span className="font-black text-xs uppercase tracking-tighter">
                    {announcement.title}
                  </span>
                  <span className="opacity-30 font-black">|</span>
                  <span className="text-sm font-bold">
                    {announcement.content}
                  </span>
                  {/* Optional: Individual dismiss button inside marquee is tricky for UX, 
                      usually better to have one global "Close Bar" button on the right. */}
                </div>
              );
            })}
          </div>

          {/* Close Button - Fixed to the right so it doesn't scroll away */}
          <div className="absolute right-0 top-0 bottom-0 flex items-center bg-gradient-to-l from-black via-black/80 to-transparent pl-10 pr-4">
            <button 
              onClick={() => {
                // Logic to dismiss all current visible ones
                visibleAnnouncements.forEach(a => handleDismiss(a.id));
              }}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              title="Close all announcements"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}