'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the max selectable Date (today minus minAge years) */
function getMaxDate(minAge: number): Date {
  const d = new Date();
  d.setFullYear(d.getFullYear() - minAge);
  d.setHours(23, 59, 59, 999);
  return d;
}

/** Parse DD/MM/YYYY → Date | null */
function parseDMY(value: string): Date | null {
  if (!value || value.length !== 10) return null;
  const [d, m, y] = value.split('/').map(Number);
  if (!d || !m || !y || y < 1900) return null;
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) return null;
  return date;
}

/** Format Date → DD/MM/YYYY */
function formatDMY(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

/** Check whether a given Date is disabled (after maxDate) */
function isDisabled(date: Date, maxDate: Date): boolean {
  return date > maxDate;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DatePickerInputProps {
  value: string;               // DD/MM/YYYY
  onChange: (value: string) => void;
  minAge?: number;             // default 13
  required?: boolean;
  error?: boolean;
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export default function DatePickerInput({
  value,
  onChange,
  minAge = 13,
  required = false,
  error = false,
}: DatePickerInputProps) {
  const maxDate = getMaxDate(minAge);
  const parsed = parseDMY(value);

  // ── Calendar view state ───────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<number>(
    parsed ? parsed.getMonth() : maxDate.getMonth()
  );
  const [viewYear, setViewYear] = useState<number>(
    parsed ? parsed.getFullYear() : maxDate.getFullYear()
  );
  const [showYearPicker, setShowYearPicker] = useState(false);

  // ── Text input state (allows manual typing) ───────────────────────────────
  const [textValue, setTextValue] = useState(value);

  const containerRef = useRef<HTMLDivElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);

  // Sync text input when external value changes
  useEffect(() => {
    setTextValue(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowYearPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Scroll selected year into view when year picker opens
  useEffect(() => {
    if (showYearPicker && yearListRef.current) {
      const selected = yearListRef.current.querySelector('[data-selected="true"]');
      selected?.scrollIntoView({ block: 'center' });
    }
  }, [showYearPicker]);

  // ── Calendar grid computation ─────────────────────────────────────────────

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Year range: 1930 → maxDate year
  const minYear = 1930;
  const maxYear = maxDate.getFullYear();
  const yearRange = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i  // descending: newest first
  );

  // ── Navigation ────────────────────────────────────────────────────────────

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    // Don't allow navigating past the month containing maxDate
    const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
    if (nextY > maxDate.getFullYear()) return;
    if (nextY === maxDate.getFullYear() && nextM > maxDate.getMonth()) return;
    setViewMonth(nextM);
    setViewYear(nextY);
  };

  const canGoNext =
    viewYear < maxDate.getFullYear() ||
    (viewYear === maxDate.getFullYear() && viewMonth < maxDate.getMonth());

  // ── Date selection ────────────────────────────────────────────────────────

  const selectDate = useCallback((day: number) => {
    const selected = new Date(viewYear, viewMonth, day);
    if (isDisabled(selected, maxDate)) return;
    const formatted = formatDMY(selected);
    onChange(formatted);
    setTextValue(formatted);
    setIsOpen(false);
    setShowYearPicker(false);
  }, [viewYear, viewMonth, maxDate, onChange]);

  // ── Text input handler (DD/MM/YYYY auto-format) ───────────────────────────

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 8) raw = raw.slice(0, 8);

    let formatted = raw;
    if (raw.length > 4) formatted = `${raw.slice(0, 2)}/${raw.slice(2, 4)}/${raw.slice(4)}`;
    else if (raw.length > 2) formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;

    setTextValue(formatted);
    onChange(formatted);

    // If complete and valid, jump calendar view to that month
    if (formatted.length === 10) {
      const p = parseDMY(formatted);
      if (p && !isDisabled(p, maxDate)) {
        setViewMonth(p.getMonth());
        setViewYear(p.getFullYear());
      }
    }
  };

  // ── Render helpers ────────────────────────────────────────────────────────

  const isSelected = (day: number) => {
    if (!parsed) return false;
    return (
      parsed.getDate() === day &&
      parsed.getMonth() === viewMonth &&
      parsed.getFullYear() === viewYear
    );
  };

  const isToday = (day: number) => {
    const t = new Date();
    return t.getDate() === day && t.getMonth() === viewMonth && t.getFullYear() === viewYear;
  };

  const isDayDisabled = (day: number) =>
    isDisabled(new Date(viewYear, viewMonth, day), maxDate);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="relative">

      {/* ── Text input ── */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={textValue}
          onChange={handleTextChange}
          onFocus={() => setIsOpen(true)}
          placeholder="DD/MM/YYYY"
          required={required}
          maxLength={10}
          autoComplete="off"
          className={`w-full bg-[#050505] border ${
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30'
              : 'border-[#1a1a1a] focus:border-sats-orange-500 focus:ring-sats-orange-500/20'
          } focus:ring-2 rounded-xl py-3.5 pl-10 pr-12 outline-none transition-all text-white placeholder-gray-600 text-sm`}
        />
        {/* Calendar toggle icon */}
        <button
          type="button"
          onClick={() => { setIsOpen(o => !o); setShowYearPicker(false); }}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-sats-orange-500 transition-colors"
          tabIndex={-1}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-sats-orange-500' : ''}`}
          />
        </button>
      </div>

      {/* ── Calendar dropdown ── */}
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-[100] w-[296px] bg-[#080808] border border-[#1e1e1e] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden">

          {/* Top highlight */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
            <button
              type="button"
              onClick={prevMonth}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Month + Year selector */}
            <button
              type="button"
              onClick={() => setShowYearPicker(y => !y)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all"
            >
              <span className="text-sm font-bold text-white">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${showYearPicker ? 'rotate-180' : ''}`}
              />
            </button>

            <button
              type="button"
              onClick={nextMonth}
              disabled={!canGoNext}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ── Year picker overlay ── */}
          {showYearPicker ? (
            <div
              ref={yearListRef}
              className="h-[232px] overflow-y-auto py-2 px-2 grid grid-cols-3 gap-1 content-start"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}
            >
              {yearRange.map(yr => {
                const isSel = yr === viewYear;
                return (
                  <button
                    key={yr}
                    type="button"
                    data-selected={isSel}
                    onClick={() => {
                      setViewYear(yr);
                      // If selected month would exceed maxDate, clamp it
                      if (yr === maxDate.getFullYear() && viewMonth > maxDate.getMonth()) {
                        setViewMonth(maxDate.getMonth());
                      }
                      setShowYearPicker(false);
                    }}
                    className={`py-2 rounded-xl text-sm font-semibold transition-all ${
                      isSel
                        ? 'bg-sats-orange-500 text-black font-black'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              {/* ── Day labels ── */}
              <div className="grid grid-cols-7 px-3 pt-3 pb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-bold text-white/20 py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* ── Day grid ── */}
              <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
                {/* Leading empty cells */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`e-${i}`} />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const sel = isSelected(day);
                  const disabled = isDayDisabled(day);
                  const today = isToday(day);

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => selectDate(day)}
                      disabled={disabled}
                      className={`
                        relative h-9 w-full rounded-xl text-sm font-semibold
                        transition-all duration-100 flex items-center justify-center
                        ${sel
                          ? 'bg-sats-orange-500 text-black font-black shadow-[0_0_12px_rgba(238,139,18,0.4)]'
                          : disabled
                          ? 'text-white/10 cursor-not-allowed'
                          : today
                          ? 'text-sats-orange-500 hover:bg-sats-orange-500/10'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {day}
                      {/* Today dot */}
                      {today && !sel && (
                        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sats-orange-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ── Footer: age notice ── */}
          <div className="px-4 py-2.5 border-t border-[#1a1a1a] flex items-center justify-between">
            <span className="text-[10px] text-white/20">
              Min. age {minAge} years required
            </span>
            {parsed && !isDisabled(parsed, maxDate) && (
              <span className="text-[10px] font-semibold text-sats-orange-500/70">
                {formatDMY(parsed)}
              </span>
            )}
          </div>

        </div>
      )}
    </div>
  );
}