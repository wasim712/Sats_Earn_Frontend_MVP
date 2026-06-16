'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Zap,
  Calendar,
  Users,
  Pencil,
  Trash2,
  CheckCircle2,
  LayoutGrid,
  Loader2,
} from 'lucide-react';
import type { Quiz, Question } from '@/features/admin/adminQuizSlice';

function formatQuizDateUtc(dateValue: string) {
  const dateKey = dateValue.slice(0, 10);
  const [year, month, day] = dateKey.split('-').map(Number);

  if (!year || !month || !day) {
    return dateValue;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

// ─── QuizCard ─────────────────────────────────────────────────────────────────

interface QuizCardProps {
  quiz: Quiz;
  onToggle: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}

export function QuizCard({ quiz, onToggle, onDelete }: QuizCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsToggling(true);
    await onToggle(quiz.id, !quiz.isActive);
    setIsToggling(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this quiz? This action cannot be undone.')) return;
    setIsDeleting(true);
    await onDelete(quiz.id);
  };

  const formattedDate = formatQuizDateUtc(quiz.date);

  return (
    <Link href={`/admin/quiz/${quiz.id}`} className="block group h-full">
      <div
        className={`
          relative bg-[#080808] border rounded-2xl p-6 md:p-7 h-full flex flex-col
          transition-all duration-300 overflow-hidden
          hover:border-white/10 hover:bg-[#0c0c0c] hover:shadow-2xl hover:shadow-black/50
          ${isDeleting ? 'opacity-50 pointer-events-none scale-95' : 'scale-100'}
          border-[#1a1a1a]
        `}
      >
        {/* Premium left-accent bar on hover */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-sats-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative flex flex-col h-full z-10">
          
          {/* Top Row: Title & Badge */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <h3 className="text-white font-bold text-xl leading-snug line-clamp-2 group-hover:text-sats-orange-500 transition-colors">
              {quiz.title}
            </h3>
            <span
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                quiz.isActive
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  quiz.isActive ? 'bg-green-400 animate-pulse' : 'bg-white/30'
                }`}
              />
              {quiz.isActive ? 'Active' : 'Draft'}
            </span>
          </div>

          {/* Middle: Grid Stats */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-auto">
            <div>
              <p className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" /> Date
              </p>
              <p className="text-gray-300 text-sm font-medium">{formattedDate}</p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" /> Reward
              </p>
              <p className="text-sm font-bold tracking-tight flex items-center gap-1.5 truncate">
                <span className="text-sats-orange-500 shrink-0">~ {quiz.rewardSats} Sats</span>
                {Boolean(quiz.xpReward) && (
                  <>
                    <span className="text-[#333] font-normal">/</span>
                    <span className="text-purple-400 shrink-0">{quiz.xpReward} XP</span>
                  </>
                )}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
                <LayoutGrid className="w-3.5 h-3.5" /> Questions
              </p>
              <p className="text-gray-300 text-sm font-medium">{quiz._count?.questions || 0}</p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" /> Plays
              </p>
              <p className="text-gray-300 text-sm font-medium">{quiz._count?.attempts || 0}</p>
            </div>
          </div>

          {/* Bottom Row: Actions */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#1a1a1a]">
            
            {/* Left: Active/Pause Slider */}
            <div className="flex items-center gap-3" onClick={(e) => e.preventDefault()}>
              <span className={`text-xs font-bold transition-colors ${quiz.isActive ? 'text-green-400' : 'text-gray-500'}`}>
                {isToggling ? (quiz.isActive ? 'Pausing...' : 'Going live...') : quiz.isActive ? 'Live' : 'Paused'}
              </span>
              <button
                type="button"
                onClick={handleToggle}
                disabled={isToggling}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none ${
                  quiz.isActive ? 'bg-green-500' : 'bg-[#1a1a1a] border border-[#2a2a2a]'
                } ${isToggling ? 'opacity-50 pointer-events-none' : ''}`}
                title={isToggling ? (quiz.isActive ? 'Pausing quiz...' : 'Activating quiz...') : quiz.isActive ? 'Pause quiz' : 'Activate quiz'}
              >
                {isToggling ? (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-4.5 h-4.5 text-white animate-spin" />
                  </span>
                ) : null}
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    quiz.isActive ? 'translate-x-[22px]' : 'translate-x-1'
                  } ${isToggling ? 'opacity-0' : 'opacity-100'}`}
                />
              </button>
            </div>

            {/* Right: Edit & Delete Buttons */}
            <div className="flex items-center gap-2">
              <div 
                className="p-2.5 rounded-xl border border-[#1a1a1a] bg-[#111] hover:bg-white/10 text-gray-400 hover:text-white transition-all shadow-sm"
                title="Edit Quiz"
              >
                <Pencil className="w-4 h-4" />
              </div>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                title="Delete Quiz"
                className="p-2.5 rounded-xl border border-red-500/10 bg-red-500/5 hover:bg-red-500/15 text-red-400 transition-all shadow-sm disabled:opacity-40"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── QuizCardSkeleton ─────────────────────────────────────────────────────────

export function QuizCardSkeleton() {
  return (
    <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-6 md:p-7 h-[310px] flex flex-col animate-pulse">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="h-7 w-3/4 bg-[#1a1a1a] rounded-lg" />
        <div className="h-6 w-16 bg-[#1a1a1a] rounded-full shrink-0" />
      </div>
      
      <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-auto">
        <div>
          <div className="h-3 w-12 bg-[#1a1a1a] rounded mb-2" />
          <div className="h-4 w-20 bg-[#1a1a1a] rounded" />
        </div>
        <div>
          <div className="h-3 w-14 bg-[#1a1a1a] rounded mb-2" />
          <div className="h-4 w-24 bg-[#1a1a1a] rounded" />
        </div>
        <div>
          <div className="h-3 w-16 bg-[#1a1a1a] rounded mb-2" />
          <div className="h-4 w-12 bg-[#1a1a1a] rounded" />
        </div>
        <div>
          <div className="h-3 w-10 bg-[#1a1a1a] rounded mb-2" />
          <div className="h-4 w-12 bg-[#1a1a1a] rounded" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#1a1a1a]">
        <div className="flex gap-3 items-center">
           <div className="h-4 w-10 bg-[#1a1a1a] rounded" />
           <div className="h-6 w-11 bg-[#1a1a1a] rounded-full" />
        </div>
        <div className="flex gap-2">
           <div className="h-9 w-9 bg-[#1a1a1a] rounded-xl" />
           <div className="h-9 w-9 bg-[#1a1a1a] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── QuestionCard ─────────────────────────────────────────────────────────────

interface QuestionCardProps {
  question: Question;
  index: number;
}

export function QuestionCard({ question, index }: QuestionCardProps) {
  return (
    <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-[#333] hover:shadow-2xl hover:shadow-black">
      <div className="flex items-start gap-5 md:gap-6">
        
        {/* Order badge */}
        <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-sats-orange-500/20 to-sats-orange-500/5 border border-sats-orange-500/30 flex items-center justify-center shadow-inner">
          <span className="text-base font-black text-sats-orange-500">{index}</span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Question text */}
          <h4 className="text-white font-bold text-lg leading-relaxed mb-6">
            {question.questionText}
          </h4>

          {/* Options grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {question.options.map((opt, i) => {
              const isCorrect = opt === question.correctAnswer;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-300 ${
                    isCorrect
                      ? 'bg-green-500/10 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.05)]'
                      : 'bg-[#111] border-[#1a1a1a] hover:bg-[#151515] hover:border-[#2a2a2a]'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-md font-black text-xs shrink-0 ${
                      isCorrect ? 'bg-green-500 text-black' : 'bg-[#222] text-gray-500'
                    }`}
                  >
                    {['A', 'B', 'C', 'D'][i]}
                  </span>
                  
                  <span className={`flex-1 text-sm md:text-base break-words ${isCorrect ? 'font-bold text-green-400' : 'font-medium text-gray-300'}`}>
                    {opt}
                  </span>
                  
                  {isCorrect && (
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-green-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SingleQuizSkeleton ───────────────────────────────────────────────────────

export function SingleQuizSkeleton() {
  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 animate-pulse">
      <div className="max-w-4xl mx-auto">
        <div className="h-4 w-28 bg-[#1a1a1a] rounded-lg mb-6" />

        <div className="bg-[#080808] border border-[#1a1a1a] rounded-3xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-6 w-20 bg-[#1a1a1a] rounded-full" />
                <div className="h-5 w-32 bg-[#1a1a1a] rounded" />
              </div>
              <div className="h-10 bg-[#1a1a1a] rounded-lg mb-6 w-3/4" />
              <div className="flex gap-6">
                <div className="h-6 w-28 bg-[#1a1a1a] rounded" />
                <div className="h-6 w-24 bg-[#1a1a1a] rounded" />
                <div className="h-6 w-28 bg-[#1a1a1a] rounded" />
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              <div className="h-11 w-32 bg-[#1a1a1a] rounded-xl" />
              <div className="h-11 w-24 bg-[#1a1a1a] rounded-xl" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-7 w-40 bg-[#1a1a1a] rounded-lg mb-2" />
            <div className="h-4 w-28 bg-[#1a1a1a] rounded" />
          </div>
        </div>

        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-8 flex flex-col gap-6">
              <div className="flex gap-5">
                <div className="h-10 w-10 bg-[#1a1a1a] rounded-xl shrink-0" />
                <div className="h-7 bg-[#1a1a1a] rounded w-full mt-1" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pl-15">
                <div className="h-14 bg-[#1a1a1a] rounded-xl" />
                <div className="h-14 bg-[#1a1a1a] rounded-xl" />
                <div className="h-14 bg-[#1a1a1a] rounded-xl" />
                <div className="h-14 bg-[#1a1a1a] rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
