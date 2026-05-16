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

function normalizeAnnouncements(data: unknown): Announcement[] {
  if (Array.isArray(data)) return data as Announcement[];

  if (data && typeof data === 'object') {
    const payload = data as { data?: unknown; announcements?: unknown; items?: unknown };
    if (Array.isArray(payload.data)) return payload.data as Announcement[];
    if (Array.isArray(payload.announcements)) return payload.announcements as Announcement[];
    if (Array.isArray(payload.items)) return payload.items as Announcement[];
  }

  return [];
}

// ─── Type Config ──────────────────────────────────────────────────────────────
const getUIConfig = (type: string) => {
  switch (type) {
    case 'WARNING':
      return {
        icon: <AlertTriangle className="w-3 h-3" />,
        label: 'Warning',
        trackColor: 'bg-yellow-500',
        labelColor: 'text-yellow-400',
        iconColor: 'text-yellow-400',
        bgGlow: 'bg-yellow-500/5',
      };
    case 'SUCCESS':
      return {
        icon: <CheckCircle2 className="w-3 h-3" />,
        label: 'Update',
        trackColor: 'bg-green-500',
        labelColor: 'text-green-400',
        iconColor: 'text-green-400',
        bgGlow: 'bg-green-500/5',
      };
    case 'PROMOTION':
      return {
        icon: <Zap className="w-3 h-3" />,
        label: 'Promo',
        trackColor: 'bg-sats-orange-500',
        labelColor: 'text-sats-orange-500',
        iconColor: 'text-sats-orange-500',
        bgGlow: 'bg-sats-orange-500/5',
      };
    default:
      return {
        icon: <Megaphone className="w-3 h-3" />,
        label: 'Info',
        trackColor: 'bg-blue-400',
        labelColor: 'text-blue-400',
        iconColor: 'text-blue-400',
        bgGlow: 'bg-blue-500/5',
      };
  }
};

// ─── Component ────────────────────────────────────────────────────────────────
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
        const res = await fetch(`${API_URL}/public/announcements/active`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          setAnnouncements(normalizeAnnouncements(data));
        } else {
          console.error('Failed to fetch announcements', res.status, res.statusText);
        }
      } catch (err) {
        console.error('Failed to fetch announcements', err);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleDismissAll = () => {
    const newDismissed = new Set(dismissedIds);
    visibleAnnouncements.forEach((a) => newDismissed.add(a.id));
    setDismissedIds(newDismissed);
    sessionStorage.setItem(
      'dismissed_announcements',
      JSON.stringify(Array.from(newDismissed))
    );
  };

  const visibleAnnouncements = announcements.filter((a) => !dismissedIds.has(a.id));

  if (visibleAnnouncements.length === 0) return null;

  // Duplicate items for seamless infinite loop
  const ticker = [...visibleAnnouncements, ...visibleAnnouncements];

  return (
    <>
      <style>{`
        @keyframes ticker-slide {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-slide 50s linear infinite;
          will-change: transform;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* <div className="sticky top-16 lg:top-0 z-40 w-full overflow-hidden"> */}
      <div className="w-full overflow-hidden">

        {/* ── Glass base ── */}
        <div className="relative flex items-stretch h-11 bg-sats-black-950/80 backdrop-blur-2xl border-b border-white/[0.06]">

          {/* Subtle top highlight line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/[0.07] to-transparent pointer-events-none" />

          {/* ── LEFT: Source Label ── */}
          <div className="shrink-0 flex items-center gap-2.5 px-4 border-r border-white/[0.06] relative z-10">
            {/* Live pulse dot */}
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sats-orange-500 opacity-50" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sats-orange-500" />
            </span>

            {/* Label */}
            <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/30 whitespace-nowrap select-none hidden sm:block">
              Announcements
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/30 whitespace-nowrap select-none sm:hidden">
              Live
            </span>
          </div>

          {/* ── CENTER: Scrolling ticker ── */}
          <div className="relative flex-1 overflow-hidden">

            {/* Left edge fade */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />

            {/* Ticker */}
            <div className="ticker-track h-full">
              {ticker.map((announcement, idx) => {
                const ui = getUIConfig(announcement.type);

                return (
                  <React.Fragment key={`${announcement.id}-${idx}`}>
                    {/* Item */}
                    <div className="inline-flex items-center gap-3 h-full px-6">

                      {/* Type badge */}
                      <div className={`inline-flex items-center gap-1.5 ${ui.iconColor}`}>
                        {ui.icon}
                        <span className={`text-[9px] font-black uppercase tracking-widest ${ui.labelColor} hidden md:block`}>
                          {ui.label}
                        </span>
                      </div>

                      {/* Thin accent divider */}
                      <div className={`w-px h-3 ${ui.trackColor} opacity-40 shrink-0`} />

                      {/* Title */}
                      <span className="text-xs font-bold text-white/80 whitespace-nowrap">
                        {announcement.title}
                      </span>

                      {/* Dot separator */}
                      <span className="w-1 h-1 rounded-full bg-white/10 shrink-0" />

                      {/* Content */}
                      <span className="text-xs text-white/40 whitespace-nowrap font-medium">
                        {announcement.content}
                      </span>
                    </div>

                    {/* Between-item separator */}
                    <div className="inline-flex items-center self-center">
                      <div className="w-px h-4 bg-white/[0.06]" />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Right edge fade */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
          </div>

          {/* ── RIGHT: Dismiss ── */}
          <div className="shrink-0 flex items-center px-3 border-l border-white/[0.06] relative z-10">
            <button
              onClick={handleDismissAll}
              title="Dismiss all announcements"
              className="
                group flex items-center justify-center
                w-6 h-6 rounded-lg
                border border-white/[0.07]
                text-white/20
                hover:text-white/70
                hover:border-white/15
                hover:bg-white/[0.04]
                transition-all duration-200
                active:scale-90
              "
            >
              <X className="w-3 h-3 transition-transform duration-200 group-hover:rotate-90" />
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
