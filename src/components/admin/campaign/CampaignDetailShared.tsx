'use client';

import React from 'react';
import { CalendarDays, Clock3 } from 'lucide-react';

export const inputCls = "w-full bg-[#111] border border-[#2a2a2a] text-white text-sm font-medium px-4 py-2.5 rounded-xl outline-none focus:border-sats-orange-500/50 focus:bg-[#151515] transition-all";

export function Field({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</span>
      <div>{children}</div>
    </div>
  );
}

export function AnalyticStatCard({
  title,
  value,
  icon,
  color,
  suffix,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
}) {
  return (
    <div className={`p-4 rounded-2xl border ${color} flex flex-col gap-3 shadow-inner transition-transform hover:-translate-y-0.5`}>
      <div className="flex justify-between items-center opacity-80">
        <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
        {icon}
      </div>
      <span className="text-2xl md:text-3xl font-black">
        {value.toLocaleString()}
        {suffix ? <span className="ml-1 text-xs font-bold uppercase tracking-widest opacity-70">{suffix}</span> : null}
      </span>
    </div>
  );
}

function toLocalDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTodayDateValue() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return toLocalDateValue(today);
}

function parseDateTimeValue(value: string) {
  if (!value) {
    return { date: '', hour: '12', minute: '00', period: 'AM' as 'AM' | 'PM' };
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { date: '', hour: '12', minute: '00', period: 'AM' as 'AM' | 'PM' };
  }
  const hours24 = parsed.getHours();
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hour12 = hours24 % 12 || 12;
  return {
    date: toLocalDateValue(parsed),
    hour: String(hour12).padStart(2, '0'),
    minute: String(parsed.getMinutes()).padStart(2, '0'),
    period,
  };
}

function buildDateTimeIso(date: string, hour: string, minute: string, period: 'AM' | 'PM') {
  if (!date) return '';
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return '';
  let hours24 = Number(hour) % 12;
  if (period === 'PM') hours24 += 12;
  if (period === 'AM' && Number(hour) === 12) hours24 = 0;
  return new Date(year, month - 1, day, hours24, Number(minute), 0, 0).toISOString();
}

function getDatePart(value?: string | null) {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return toLocalDateValue(parsed);
}

export function DateTimePickerInput({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const today = getTodayDateValue();
  const parts = parseDateTimeValue(value);

  const updateValue = (next: Partial<typeof parts>) => {
    const merged = { ...parts, ...next };
    onChange(buildDateTimeIso(merged.date, merged.hour, merged.minute, merged.period as 'AM' | 'PM'));
  };

  return (
    <div className={`rounded-xl border border-[#2a2a2a] bg-[#111] p-3.5 shadow-inner ${disabled ? 'opacity-60' : ''}`}>
      <div className="flex flex-col gap-2.5">
        <div className="relative">
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sats-orange-400 z-10" />
          <input
            type="date"
            min={value ? getDatePart(value) || today : today}
            value={parts.date}
            disabled={disabled}
            onChange={(e) => updateValue({ date: e.target.value })}
            className="w-full appearance-none rounded-xl border border-[#2a2a2a] bg-[#050505] py-3 pl-10 pr-3 text-sm font-medium text-white outline-none transition-all hover:border-[#3a3a3a] focus:border-sats-orange-500/50 [color-scheme:dark]"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="relative">
            <Clock3 className="pointer-events-none absolut  text-sky-400 z-10 md:hidden" />
            <select
              value={parts.hour}
              disabled={disabled}
              onChange={(e) => updateValue({ hour: e.target.value })}
              className="w-full appearance-none rounded-xl border border-[#2a2a2a] bg-[#050505] py-3 pl-8 pr-2 text-sm font-bold text-white outline-none focus:border-sats-orange-500/50 cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const h = String(i + 1).padStart(2, '0');
                return <option key={h} value={h}>{h}</option>;
              })}
            </select>
          </div>
          <select
            value={parts.minute}
            disabled={disabled}
            onChange={(e) => updateValue({ minute: e.target.value })}
            className="w-full appearance-none rounded-xl border border-[#2a2a2a] bg-[#050505] px-3 py-3 text-sm font-bold text-white text-center outline-none focus:border-sats-orange-500/50 cursor-pointer"
          >
            {['00','05','10','15','20','25','30','35','40','45','50','55'].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={parts.period}
            disabled={disabled}
            onChange={(e) => updateValue({ period: e.target.value as 'AM' | 'PM' })}
            className="w-full appearance-none rounded-xl border border-[#2a2a2a] bg-[#050505] px-3 py-3 text-sm font-black text-white text-center outline-none focus:border-sats-orange-500/50 cursor-pointer"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>

        <p className="text-[10px] text-gray-500 font-medium px-1">
          Choose the date first, then set the exact time for the 2x rewards window.
        </p>

        {parts.date && (
          <p className="text-[10px] text-white/25 font-medium px-1">
            {new Date(buildDateTimeIso(parts.date, parts.hour, parts.minute, parts.period as 'AM' | 'PM'))
              .toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}
