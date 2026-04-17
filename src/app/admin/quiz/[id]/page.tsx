'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Zap,
  Calendar,
  Users,
  ToggleLeft,
  ToggleRight,
  Plus
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchSingleQuiz,
  deleteQuiz,
  toggleQuizStatus,
  clearQuizState,
} from '@/features/admin/adminQuizSlice';
import {
  QuestionCard,
  SingleQuizSkeleton,
} from '@/components/admin/quiz/QuizComponents';
import CreateEditQuizModal from '@/components/admin/quiz/CreateEditQuizModal';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SingleQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15+: params is a Promise — unwrap with React.use()
  const { id } = React.use(params);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { singleQuiz, isLoading, error } = useAppSelector(
    (state) => state.adminQuiz
  );

  // ── Modal state ────────────────────────────────────────────────────────────
  const [isEditQuizOpen, setIsEditQuizOpen] = useState(false);
  const [isDeletingQuiz, setIsDeletingQuiz] = useState(false);

  // ── Data fetch ─────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchSingleQuiz(id));
    return () => { dispatch(clearQuizState()); };
  }, [dispatch, id]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleDeleteQuiz = async () => {
    if (!confirm('Delete this quiz and all its questions? This cannot be undone.')) return;
    setIsDeletingQuiz(true);
    try {
       await dispatch(deleteQuiz(id)).unwrap();
       router.push('/admin/quiz');
    } catch (error) {
       console.error("Failed to delete quiz:", error);
       setIsDeletingQuiz(false);
    }
  };

  // ── Loading / Error ────────────────────────────────────────────────────────

  if (isLoading) return <SingleQuizSkeleton />;

  if (error || !singleQuiz) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 mb-4 text-sm">
            {error || 'Quiz not found.'}
          </p>
          <button
            onClick={() => router.back()}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Derived ────────────────────────────────────────────────────────────────

  const sortedQuestions = [...(singleQuiz.questions ?? [])].sort(
    (a, b) => a.order - b.order
  );

  const formattedDate = new Date(singleQuiz.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8">
      {/* Ambient glow */}
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-sats-orange-500/4 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">

        {/* ── Back Button ── */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quizzes
        </button>

        {/* ── Quiz Header Card ── */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">

            {/* Left: info */}
            <div className="flex-1 min-w-0">
              {/* Status + date */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    singleQuiz.isActive
                      ? 'bg-green-500/10 border-green-500/20 text-green-400'
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      singleQuiz.isActive
                        ? 'bg-green-400 animate-pulse'
                        : 'bg-white/30'
                    }`}
                  />
                  {singleQuiz.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-white/30">
                  <Calendar className="w-3 h-3" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-white leading-snug mb-3">
                {singleQuiz.title}
              </h1>

              {/* Meta stats */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <Zap className="w-3.5 h-3.5 text-sats-orange-500" />
                  <span className="font-semibold text-white">{singleQuiz.rewardSats}</span>
                  <span className="text-white/40">Sats</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="font-semibold text-white">
                    {singleQuiz._count?.questions ?? sortedQuestions.length}
                  </span>
                  <span className="text-white/40">questions</span>
                </div>
                {singleQuiz._count?.attempts !== undefined && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Users className="w-3.5 h-3.5 text-white/25" />
                    <span className="font-semibold text-white">
                      {singleQuiz._count.attempts}
                    </span>
                    <span className="text-white/40">attempts</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: action buttons */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
              {/* Toggle active */}
              <button
                onClick={() =>
                  dispatch(
                    toggleQuizStatus({
                      id: singleQuiz.id,
                      isActive: !singleQuiz.isActive,
                    })
                  )
                }
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                  singleQuiz.isActive
                    ? 'border-red-500/20 text-red-400 hover:bg-red-500/10'
                    : 'border-green-500/20 text-green-400 hover:bg-green-500/10'
                }`}
              >
                {singleQuiz.isActive ? (
                  <ToggleRight className="w-4 h-4" />
                ) : (
                  <ToggleLeft className="w-4 h-4" />
                )}
                {singleQuiz.isActive ? 'Deactivate' : 'Activate'}
              </button>

              {/* Edit quiz */}
              <button
                onClick={() => setIsEditQuizOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#1a1a1a] text-white/50 text-xs font-medium hover:border-white/20 hover:text-white transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>

              {/* Delete quiz */}
              <button
                onClick={handleDeleteQuiz}
                disabled={isDeletingQuiz}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeletingQuiz ? (
                  <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                {isDeletingQuiz ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Questions Section ── */}
        <div>
          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Questions Content</h2>
              <p className="text-xs text-white/35 mt-0.5">
                {sortedQuestions.length} question
                {sortedQuestions.length !== 1 ? 's' : ''} in this quiz
              </p>
            </div>
          </div>

          {/* Empty state (Fallback) */}
          {sortedQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-[#0a0a0a] border border-[#1a1a1a] border-dashed rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#111] border border-[#1a1a1a] flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-white/10" />
              </div>
              <p className="text-white/40 text-sm font-medium mb-1">
                No Questions Found
              </p>
              <p className="text-xs text-white/20 mb-5 max-w-xs leading-relaxed">
                This quiz was created without questions or they failed to load.
              </p>
            </div>
          ) : (
            // Question list - Stripped of edit/delete props
            <div className="space-y-3">
              {sortedQuestions.map((q) => (
                <QuestionCard
                  index={q.order}
                  key={q.id}
                  question={q}
                  // Notice we no longer pass onEdit or onDelete
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <CreateEditQuizModal
        isOpen={isEditQuizOpen}
        onClose={() => setIsEditQuizOpen(false)}
        quiz={singleQuiz}
      />
    </div>
  );
}