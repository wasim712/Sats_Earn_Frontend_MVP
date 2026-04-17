'use client';

import { useEffect, useState } from 'react';
import { Plus, Zap, LayoutGrid, CheckCircle2, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAllQuizzes,
  deleteQuiz,
  toggleQuizStatus,
} from '@/features/admin/adminQuizSlice';
import { QuizCard, QuizCardSkeleton } from '@/components/admin/quiz/QuizComponents';
import CreateEditQuizModal from '@/components/admin/quiz/CreateEditQuizModal';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminQuizPage() {
  const dispatch = useAppDispatch();
  const { quizzes, isLoading, error } = useAppSelector((state) => state.adminQuiz);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllQuizzes());
  }, [dispatch]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const activeCount = quizzes.filter((q) => q.isActive).length;
  const totalQuestions = quizzes.reduce((acc, q) => acc + (q._count?.questions ?? 0), 0);
  const totalAttempts = quizzes.reduce((acc, q) => acc + (q._count?.attempts ?? 0), 0);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8">
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-sats-orange-500/4 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-1/3 right-0 w-80 h-80 bg-sats-orange-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Daily Quizzes
            </h1>
            <p className="text-sm text-white/40 mt-1">
              Publish and manage daily earning quizzes for users.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sats-orange-500 text-black text-sm font-bold hover:bg-sats-orange-500/90 active:scale-95 transition-all self-start sm:self-auto shadow-lg shadow-sats-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            Create Quiz
          </button>
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            {
              label: 'Total Quizzes',
              value: quizzes.length,
              icon: LayoutGrid,
              accent: false,
            },
            {
              label: 'Active Now',
              value: activeCount,
              icon: CheckCircle2,
              accent: true,
            },
            {
              label: 'Total Questions',
              value: totalQuestions,
              icon: Zap,
              accent: false,
            },
            {
              label: 'Total Attempts',
              value: totalAttempts,
              icon: Users,
              accent: false,
            },
          ].map(({ label, value, icon: Icon, accent }) => (
            <div
              key={label}
              className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  className={`w-3.5 h-3.5 ${accent ? 'text-sats-orange-500' : 'text-white/25'}`}
                />
                <span className="text-xs text-white/35 truncate">{label}</span>
              </div>
              {isLoading ? (
                <div className="h-7 w-10 bg-white/5 rounded-lg animate-pulse" />
              ) : (
                <p
                  className={`text-2xl font-bold ${accent ? 'text-sats-orange-500' : 'text-white'}`}
                >
                  {value}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ── Content ── */}
        {isLoading ? (
          // Skeleton grid — mirrors exact card shape
          <div className="grid grid-cols-1 md:grid-cols-2  gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <QuizCardSkeleton key={i} />
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-white/8" />
            </div>
            <h3 className="text-white/60 font-semibold mb-1.5">No Quizzes Yet</h3>
            <p className="text-sm text-white/30 mb-6 max-w-xs leading-relaxed">
              Create your first daily quiz to start rewarding users with Sats.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/25 text-sats-orange-500 text-sm font-medium hover:bg-sats-orange-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create First Quiz
            </button>
          </div>
        ) : (
          // Quiz grid
          <div className="grid grid-cols-1 md:grid-cols-2  gap-6 lg:gap-8">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onToggle={(id, isActive) =>
                  dispatch(toggleQuizStatus({ id, isActive }))
                }
                onDelete={(id) => dispatch(deleteQuiz(id))}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Quiz Modal */}
      <CreateEditQuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}