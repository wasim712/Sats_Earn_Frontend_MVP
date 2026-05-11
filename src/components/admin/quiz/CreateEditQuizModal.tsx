'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { X, Plus, Trash2, CheckCircle2, Circle, AlertTriangle, Info, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { createQuiz, updateQuiz } from '@/features/admin/adminQuizSlice';
import type { Quiz } from '@/features/admin/adminQuizSlice';

const CALENDAR_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CALENDAR_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function toLocalDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function parseDateInput(value: string) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

// ─── Types & Props ────────────────────────────────────────────────────────────

interface QuestionInput {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  quiz?: Quiz | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CreateEditQuizModal({ isOpen, onClose, quiz }: Props) {
  const dispatch = useAppDispatch();
  const isEditMode = !!quiz;
  const today = useMemo(() => startOfToday(), []);
  const tomorrow = useMemo(() => {
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  }, [today]);

  // Unified form state
  const [form, setForm] = useState({
    title: '',
    date: '',
    rewardSats: 15,
    xpReward: 0,
    isActive: false, // Added for Edit mode
  });
  
  // Questions state (Only used in Create mode)
  const [questions, setQuestions] = useState<QuestionInput[]>([
    { id: crypto.randomUUID(), questionText: '', options: ['', '', '', ''], correctAnswer: '' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<number>(today.getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(today.getFullYear());
  const calendarRef = useRef<HTMLDivElement>(null);

  // Sync state when modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    if (quiz) {
      // EDIT MODE: Populate only the editable fields
      setForm({
        title: quiz.title,
        date: '', // Uneditable in edit mode
        rewardSats: quiz.rewardSats,
        xpReward: quiz.xpReward || 0,
        isActive: quiz.isActive || false,
      });
      // We explicitly DO NOT load questions here since they aren't editable
    } else {
      // CREATE MODE: Reset everything
      setForm({ title: '', date: toLocalDateInputValue(today), rewardSats: 15, xpReward: 0, isActive: false });
      setQuestions([{ id: crypto.randomUUID(), questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
      setCalendarMonth(today.getMonth());
      setCalendarYear(today.getFullYear());
    }
    setIsCalendarOpen(false);
    setError(null);
  }, [isOpen, quiz, today]);

  useEffect(() => {
    if (!isCalendarOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCalendarOpen]);


  // ── Helpers & State Handlers ───────────────────────────────────────────────

  const setFormField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addQuestion = () => setQuestions([...questions, { id: crypto.randomUUID(), questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
  const removeQuestion = (id: string) => questions.length > 1 && setQuestions(questions.filter(q => q.id !== id));
  const updateQuestion = (id: string, field: keyof QuestionInput, value: string | string[]) => setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  
  const updateOption = (qId: string, optIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        const newCorrectAnswer = q.correctAnswer === q.options[optIndex] ? value : q.correctAnswer;
        return { ...q, options: newOptions, correctAnswer: newCorrectAnswer };
      }
      return q;
    }));
  };

  const setCorrectOption = (qId: string, optionValue: string) => updateQuestion(qId, 'correctAnswer', optionValue);

  const selectedQuizDate = parseDateInput(form.date);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const lastDay = new Date(calendarYear, calendarMonth + 1, 0);
    const leadingDays = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const cells: Array<{ key: string; date: Date | null }> = [];

    for (let index = 0; index < leadingDays; index += 1) {
      cells.push({ key: `empty-start-${index}`, date: null });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      cells.push({ key: `day-${day}`, date: new Date(calendarYear, calendarMonth, day) });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ key: `empty-end-${cells.length}`, date: null });
    }

    return cells;
  }, [calendarMonth, calendarYear]);

  const canGoPrevMonth = useMemo(() => {
    const startOfVisibleMonth = new Date(calendarYear, calendarMonth, 1);
    return startOfVisibleMonth > new Date(today.getFullYear(), today.getMonth(), 1);
  }, [calendarMonth, calendarYear, today]);

  const setQuizDate = (date: Date) => {
    if (date < today) return;
    setFormField('date', toLocalDateInputValue(date));
    setCalendarMonth(date.getMonth());
    setCalendarYear(date.getFullYear());
    setIsCalendarOpen(false);
  };

  const moveMonth = (direction: 'prev' | 'next') => {
    const nextMonth = direction === 'next' ? calendarMonth + 1 : calendarMonth - 1;
    const nextDate = new Date(calendarYear, nextMonth, 1);
    if (direction === 'prev' && nextDate < new Date(today.getFullYear(), today.getMonth(), 1)) return;
    setCalendarMonth(nextDate.getMonth());
    setCalendarYear(nextDate.getFullYear());
  };

  if (!isOpen) return null;

  const validate = (): string | null => {
    if (!form.title.trim()) return 'Quiz title is required.';
    if (Number(form.rewardSats) < 1) return 'Reward must be at least 1 Sat.';
    if (Number(form.xpReward) < 0) return 'XP reward cannot be negative.';
    
    if (!isEditMode) {
      if (!form.date) return 'Quiz date is required.';
      if (questions.length === 0) return 'At least one question is required.';
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.questionText.trim()) return `Question ${i + 1} is missing text.`;
        if (q.options.some(opt => !opt.trim())) return `Question ${i + 1} has empty options.`;
        if (!q.correctAnswer) return `Please select a correct answer for Question ${i + 1}.`;
        if (!q.options.includes(q.correctAnswer)) return `Correct answer mismatch in Question ${i + 1}.`;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditMode && quiz) {
        // STRICT EDIT PAYLOAD: Only what the backend allows
        const editPayload = {
          title: form.title.trim(),
          rewardSats: Number(form.rewardSats),
          xpReward: Number(form.xpReward),
          isActive: form.isActive
        };
        await dispatch(updateQuiz({ id: quiz.id, data: editPayload })).unwrap();
      } else {
        // FULL CREATE PAYLOAD
        const createPayload = {
          title: form.title.trim(),
          date: new Date(form.date).toISOString(),
          rewardSats: Number(form.rewardSats),
          xpReward: Number(form.xpReward),
          questions: questions.map((q, index) => ({
            questionText: q.questionText.trim(),
            options: q.options.map(o => o.trim()),
            correctAnswer: q.correctAnswer.trim(),
            order: index + 1
          }))
        };
        await dispatch(createQuiz(createPayload)).unwrap();
      }
      onClose();
    } catch (err: unknown) {
      setError(typeof err === 'string' ? err : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  // Dynamic sizing: Compact for Edit, Wide for Create
  const modalWidthClass = isEditMode ? 'max-w-md' : 'max-w-4xl max-h-[90vh]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`w-full ${modalWidthClass} flex flex-col bg-[#050505] border border-[#1a1a1a] rounded-3xl relative shadow-2xl shadow-black transition-all duration-300`}>
        
        {/* Header - Fixed */}
        <div className="relative p-6 border-b border-[#1a1a1a] shrink-0 bg-[#0a0a0a] rounded-t-3xl">
           <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-sats-orange-500/50 to-transparent ${isEditMode ? 'w-3/4' : 'w-1/2'}`}></div>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {isEditMode ? 'Edit Quiz Settings' : 'Build Daily Quiz'}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {isEditMode ? 'Update the metadata for this campaign.' : 'Configure the metadata and questions.'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body - Scrollable conditionally */}
        <div className={`flex-1 ${!isEditMode ? 'overflow-y-auto custom-scrollbar' : ''} p-6`}>
          
          {/* Metadata Section - Changes layout based on mode */}
          <div className={isEditMode ? "flex flex-col gap-5" : "grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"}>
            
            <div className={!isEditMode ? "md:col-span-2" : ""}>
               <Field label="Quiz Title" required>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setFormField('title', e.target.value)}
                  placeholder="e.g. Bitcoin Basics"
                  className={inputCls}
                />
              </Field>
            </div>

            <div className={!isEditMode ? "md:col-span-3" : ""}>
              <Field label="Reward Pool (Sats per user)" required>
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    value={form.rewardSats||''}
                    onChange={(e) => setFormField('rewardSats', Number(e.target.value))}
                    min={1}
                    className={`${inputCls} pr-16 font-mono text-lg`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-sats-orange-500 select-none">
                    SATS
                  </span>
                </div>
              </Field>
            </div>
            
            <div className={!isEditMode ? "md:col-span-3" : ""}>
              <Field label="XP Reward" required>
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    value={form.xpReward ||''}
                    onChange={(e) => setFormField('xpReward', Number(e.target.value))}
                    min={0}
                    className={`${inputCls} pr-12 font-mono text-lg`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-green-400 select-none">
                    XP
                  </span>
                </div>
              </Field>
            </div>
            {/* Date is ONLY visible during creation */}
            {!isEditMode && (
              <Field label="Date" required>
                <div className="relative" ref={calendarRef}>
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen((prev) => !prev)}
                    className={`${inputCls} flex items-center justify-between text-left`}
                  >
                    <div>
                      <p className="text-white font-medium">{selectedQuizDate ? selectedQuizDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select a date'}</p>
                      <p className="mt-1 text-xs text-gray-500">Only today or future dates are allowed</p>
                    </div>
                    <CalendarDays className="h-5 w-5 text-sats-orange-400 shrink-0" />
                  </button>

                  {isCalendarOpen && (
                    <div className="absolute left-0 top-[calc(100%+12px)] z-30 w-full min-w-[280px] rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:w-[320px]">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuizDate(today)}
                          className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/15"
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuizDate(tomorrow)}
                          className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-xs font-bold text-sky-300 transition hover:bg-sky-500/15"
                        >
                          Tomorrow
                        </button>
                      </div>

                      <div className="mb-3 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => moveMonth('prev')}
                          disabled={!canGoPrevMonth}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1a1a1a] bg-[#111] text-gray-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <p className="text-sm font-black text-white">
                          {CALENDAR_MONTHS[calendarMonth]} {calendarYear}
                        </p>
                        <button
                          type="button"
                          onClick={() => moveMonth('next')}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1a1a1a] bg-[#111] text-gray-400 transition hover:text-white"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold uppercase tracking-wide text-gray-500">
                        {CALENDAR_DAYS.map((day) => (
                          <div key={day} className="py-1">{day}</div>
                        ))}
                      </div>

                      <div className="mt-2 grid grid-cols-7 gap-2">
                        {calendarDays.map((entry) => {
                          if (!entry.date) {
                            return <div key={entry.key} className="h-10" />;
                          }

                          const isPast = entry.date < today;
                          const isSelected = form.date === toLocalDateInputValue(entry.date);
                          const isToday = toLocalDateInputValue(entry.date) === toLocalDateInputValue(today);

                          return (
                            <button
                              key={entry.key}
                              type="button"
                              disabled={isPast}
                              onClick={() => setQuizDate(entry.date as Date)}
                              className={`h-10 rounded-xl text-sm font-bold transition-all ${
                                isSelected
                                  ? 'bg-sats-orange-500 text-black shadow-[0_0_18px_rgba(238,139,18,0.18)]'
                                  : isPast
                                    ? 'cursor-not-allowed bg-[#0e0e0e] text-gray-700'
                                    : isToday
                                      ? 'border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/15'
                                      : 'bg-[#111] text-gray-300 hover:bg-[#171717] hover:text-white'
                              }`}
                            >
                              {entry.date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </Field>
            )}
            {/* IsActive Toggle is ONLY visible during Editing */}
            {isEditMode && (
              <div className="mt-2 p-4 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">Active Status</p>
                  <p className="text-xs text-gray-500">Allow users to play this quiz.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormField('isActive', !form.isActive)}
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                    form.isActive ? 'bg-green-500' : 'bg-[#1a1a1a] border border-[#2a2a2a]'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                      form.isActive ? 'translate-x-6' : 'translate-x-[2px]'
                    }`}
                  />
                </button>
              </div>
            )}
          </div>

          {/* CREATE MODE ONLY: Questions Builder */}
          {!isEditMode && (
            <>
              <div className="h-px w-full bg-[#1a1a1a] mb-10"></div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-bold text-white">Quiz Questions</h3>
                   <span className="text-xs font-medium px-2.5 py-1 bg-[#111] border border-[#1a1a1a] rounded-lg text-gray-400">
                     Total: {questions.length}
                   </span>
                </div>

                {questions.map((q, qIndex) => (
                  <div key={q.id} className="p-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl relative group">
                    {questions.length > 1 && (
                      <button 
                        onClick={() => removeQuestion(q.id)}
                        className="absolute top-4 right-4 p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <div className="flex gap-4 mb-6">
                       <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-sats-orange-500/10 text-sats-orange-500 font-black text-sm border border-sats-orange-500/20">
                         {qIndex + 1}
                       </div>
                       <div className="flex-1 pr-8">
                         <input
                            type="text"
                            value={q.questionText}
                            onChange={(e) => updateQuestion(q.id, 'questionText', e.target.value)}
                            placeholder="Enter your question here..."
                            className="w-full bg-transparent border-b border-[#1a1a1a] focus:border-sats-orange-500 pb-2 text-white font-medium focus:outline-none transition-colors"
                         />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-12">
                       {q.options.map((opt, optIndex) => {
                         const isCorrect = q.correctAnswer === opt && opt !== '';
                         return (
                           <div key={optIndex} className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${isCorrect ? 'bg-green-500/10 border-green-500/40' : 'bg-[#111] border-[#1a1a1a] hover:border-gray-700'}`}>
                             <button
                               onClick={() => opt.trim() && setCorrectOption(q.id, opt)}
                               disabled={!opt.trim()}
                               className={`shrink-0 p-1 rounded-full transition-colors ${isCorrect ? 'text-green-500' : 'text-gray-600 hover:text-gray-400 disabled:opacity-30'}`}
                             >
                               {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                             </button>
                             <input
                               type="text"
                               value={opt}
                               onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                               placeholder={`Option ${optIndex + 1}`}
                               className="flex-1 bg-transparent text-sm text-white focus:outline-none"
                             />
                           </div>
                         );
                       })}
                    </div>
                  </div>
                ))}

                <button
                  onClick={addQuestion}
                  className="w-full py-4 border-2 border-dashed border-[#1a1a1a] hover:border-sats-orange-500/50 rounded-xl text-gray-400 hover:text-sats-orange-500 flex items-center justify-center gap-2 font-bold transition-all bg-[#0a0a0a] hover:bg-sats-orange-500/5"
                >
                  <Plus className="w-5 h-5" /> Add Another Question
                </button>
              </div>
            </>
          )}

          {/* Info Banner for Edit Mode */}
          {isEditMode && (
            <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-blue-400/80">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                Questions and scheduling are locked after creation to ensure fairness for active users. You may safely pause this campaign or adjust the reward pool.
              </p>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 border-t border-[#1a1a1a] bg-[#0a0a0a] rounded-b-3xl shrink-0">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          <div className="flex gap-4 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-[#1a1a1a] text-gray-400 text-sm font-bold hover:border-gray-600 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-sats-orange-500 text-black text-sm font-black hover:bg-sats-orange-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(238,139,18,0.2)]"
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Publish Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Styles & Components ──────────────────────────────────────────────

const inputCls =
  'w-full bg-[#111] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-sats-orange-500/40 focus:bg-[#151515] hover:border-white/10 transition-all';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode; }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
        {label}
        {required && <span className="text-sats-orange-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
