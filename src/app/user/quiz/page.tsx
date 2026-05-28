'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTodayQuiz, submitQuizAnswer, clearQuizState } from '@/features/user/userQuizSlice';
import type { QuizResult, TodayQuiz } from '@/types/user';
import {
  Zap,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  CircleCheckBig,
  CircleX,
  Coins,
  Trophy,
  Brain,
  Clock3,
} from 'lucide-react';

function normalizePageQuiz(quiz: TodayQuiz | null): TodayQuiz | null {
  if (!quiz) return null;

  const quizUnknown = quiz as unknown;
  const candidate =
    typeof quizUnknown === 'object' && quizUnknown !== null && 'quiz' in (quizUnknown as Record<string, unknown>)
      ? (quizUnknown as { quiz?: unknown }).quiz
      : quizUnknown;

  if (!candidate || typeof candidate !== 'object') return null;

  const resolvedQuiz = candidate as Partial<TodayQuiz>;

  return {
    ...resolvedQuiz,
    id: resolvedQuiz.id || '',
    title: resolvedQuiz.title || 'Daily Quiz',
    description:
      resolvedQuiz.description ||
      'Answer all questions to earn today\'s reward. Your payout is based on how many answers you get correct.',
    rewardSats: typeof resolvedQuiz.rewardSats === 'number' ? resolvedQuiz.rewardSats : 0,
    xpReward: typeof resolvedQuiz.xpReward === 'number' ? resolvedQuiz.xpReward : 0,
    questions: Array.isArray(resolvedQuiz.questions) ? resolvedQuiz.questions : [],
  };
}

export default function UserDailyQuizPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { quiz, result, isLoading, isSubmitting, error } = useAppSelector((state) => state.userQuiz);

  const normalizedQuiz = useMemo(() => normalizePageQuiz(quiz), [quiz]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({});
  const [solvedQuestions, setSolvedQuestions] = useState<Record<string, string>>({});
  const [wrongOptionsByQuestion, setWrongOptionsByQuestion] = useState<Record<string, string[]>>({});
  const [feedbackByQuestion, setFeedbackByQuestion] = useState<Record<string, { correct: boolean; message: string }>>({});
  const [submittingQuestionId, setSubmittingQuestionId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTodayQuiz());

    return () => {
      dispatch(clearQuizState());
    };
  }, [dispatch]);

  const sortedQuestions = useMemo(
    () => ([...(normalizedQuiz?.questions ?? [])].sort((a, b) => a.order - b.order)),
    [normalizedQuiz?.questions],
  );

  useEffect(() => {
    if (!result?.review?.length) {
      setAnswers({});
      setAttemptCounts({});
      setSolvedQuestions({});
      setWrongOptionsByQuestion({});
      setFeedbackByQuestion({});
      return;
    }

    const restoredAnswers = result.review.reduce<Record<string, string>>((accumulator, item) => {
      if (item.isCorrect && item.selectedAnswer) {
        accumulator[item.questionId] = item.selectedAnswer;
      }
      return accumulator;
    }, {});

    const restoredAttempts = result.review.reduce<Record<string, number>>((accumulator, item) => {
      accumulator[item.questionId] = item.attemptCount || Math.max((item.wrongAnswers || []).length, 1);
      return accumulator;
    }, {});

    const restoredSolved = result.review.reduce<Record<string, string>>((accumulator, item) => {
      if (item.isCorrect) accumulator[item.questionId] = item.selectedAnswer;
      return accumulator;
    }, {});

    const restoredWrongOptions = result.review.reduce<Record<string, string[]>>((accumulator, item) => {
      accumulator[item.questionId] = item.wrongAnswers || [];
      return accumulator;
    }, {});

    const restoredFeedback = result.review.reduce<Record<string, { correct: boolean; message: string }>>((accumulator, item) => {
      const wrongCount = (item.wrongAnswers || []).length;
      if (item.isCorrect) {
        accumulator[item.questionId] = {
          correct: true,
          message: `Correct on try ${item.attemptCount || 1}. ${result.passed ? 'Quiz submitted automatically.' : 'Progress saved.'}`,
        };
      } else if (wrongCount > 0) {
        accumulator[item.questionId] = {
          correct: false,
          message: `Wrong answer saved. Choose a different option. ${wrongCount} ${wrongCount === 1 ? 'attempt' : 'attempts'} used.`,
        };
      }
      return accumulator;
    }, {});

    setAnswers(restoredAnswers);
    setAttemptCounts(restoredAttempts);
    setSolvedQuestions(restoredSolved);
    setWrongOptionsByQuestion(restoredWrongOptions);
    setFeedbackByQuestion(restoredFeedback);
  }, [result]);

  const handleSelectOption = async (questionId: string, option: string) => {
    if (submittingQuestionId || solvedQuestions[questionId]) return;
    if ((wrongOptionsByQuestion[questionId] || []).includes(option)) return;

    setSubmittingQuestionId(questionId);
    const response = await dispatch(submitQuizAnswer({ questionId, answer: option }));

    if (submitQuizAnswer.fulfilled.match(response)) {
      const payload = response.payload;
      const reviewItem = payload.result.review?.find((item) => item.questionId === questionId);
      const nextAttemptCount = reviewItem?.attemptCount || payload.attemptCount || 1;
      const wrongAnswers = reviewItem?.wrongAnswers || payload.wrongAnswers || [];
      const solvedAnswer = reviewItem?.isCorrect ? reviewItem.selectedAnswer : '';

      setAttemptCounts((prev) => ({ ...prev, [questionId]: nextAttemptCount }));
      setWrongOptionsByQuestion((prev) => ({ ...prev, [questionId]: wrongAnswers }));

      if (payload.isCorrect && solvedAnswer) {
        setAnswers((prev) => ({ ...prev, [questionId]: solvedAnswer }));
        setSolvedQuestions((prev) => ({ ...prev, [questionId]: solvedAnswer }));
        setFeedbackByQuestion((prev) => ({
          ...prev,
          [questionId]: {
            correct: true,
            message: `Correct on try ${nextAttemptCount}. ${payload.status === 'submitted' ? 'Quiz submitted automatically.' : 'Progress saved.'}`,
          },
        }));
      } else {
        setFeedbackByQuestion((prev) => ({
          ...prev,
          [questionId]: {
            correct: false,
            message: payload.message || `Wrong answer. Try a different option. Attempt ${nextAttemptCount} saved.`,
          },
        }));
      }
    }

    setSubmittingQuestionId(null);
  };

  const totalQuestions = sortedQuestions.length;
  const answeredCount = Object.keys(solvedQuestions ?? {}).length;
  const isReviewMode = Boolean(result?.passed);

  if (isLoading) return <QuizPageSkeleton />;

  if (!normalizedQuiz) {
    return (
      <QuizEmptyState
        title="No Quiz Live Right Now"
        message="There isn't an active daily quiz at the moment. Please check again after some time for the next earning opportunity."
        tone="neutral"
        onBack={() => router.push('/user/dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] pb-10 md:pb-12 relative">
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-5 md:px-6 lg:px-8 py-5 md:py-8">
        <div className={`grid grid-cols-1 gap-6 items-start mb-8 ${isReviewMode ? 'hidden' : ''}`}>
          <div className="min-w-0">
            <div className="rounded-[30px] border border-[#1a1a1a] bg-[#080808] p-5 sm:p-6 md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-sats-orange-500 mb-3">Today's Quiz</p>
              <h2 className="text-2xl md:text-3xl xl:text-[2rem] leading-tight font-black text-white tracking-tight mb-3">
                {normalizedQuiz.title}
              </h2>
              <p className="text-sm md:text-base text-gray-400 font-medium leading-7 max-w-3xl">
                {normalizedQuiz.description}
              </p>
            </div>
          </div>

          <div className="w-full grid-cols-3 sm:grid-cols-3 xl:grid-cols-3 gap-3 grid">
            <InfoCard icon={<Coins className="w-5 h-5 text-sats-orange-500" />} label="Sats Reward" value={`~ ${normalizedQuiz.rewardSats}`} accent="orange" />
            <InfoCard icon={<Sparkles className="w-5 h-5 text-sky-400" />} label="XP Reward" value={`${normalizedQuiz.xpReward || 0} XP`} accent="blue" />
            <InfoCard icon={<Brain className="w-5 h-5 text-[#4ade80]" />} label="Questions" value={`${totalQuestions}`} accent="green" />
          </div>
        </div>

        {result && (
          <div className="mb-6 rounded-[28px] border border-[#1a1a1a] bg-[#080808] p-5 md:p-6 lg:p-7">
            <div className="flex flex-col lg:flex-col lg:items-start lg:justify-evenly gap-5">
              <div className="min-w-0">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${result.passed ? 'bg-[#052e1a] border border-[#22c55e]/35 text-[#86efac]' : 'bg-sky-500/10 border border-sky-500/20 text-sky-300'}`}>
                  <Trophy className="w-3.5 h-3.5" /> {result.passed ? 'Submitted Result' : 'Saved Progress'}
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                  {result.quizTitle || normalizedQuiz.title}
                </h3>
                <p className="text-sm md:text-base text-gray-400 font-medium leading-7 max-w-3xl mb-3">
                  {result.quizDescription || normalizedQuiz.description || 'Your quiz progress has been saved.'}
                </p>
                <p className="text-sm text-gray-500 font-medium">{result.message}</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:min-w-[220px]">
                <ResultStatCard icon={<CheckCircle2 className="w-5 h-5 text-[#4ade80]" />} label="Score" value={`${result.score}/${result.totalQuestions || totalQuestions || result.score}`} />
                <ResultStatCard icon={<Coins className="w-5 h-5 text-sats-orange-500" />} label="Sats Earned" value={`${(result.rewardEarned || 0) + (result.streakBonusSats || 0)} / ${result.maxRewardSats || normalizedQuiz.rewardSats}`} />
                <ResultStatCard icon={<Sparkles className="w-5 h-5 text-sky-400" />} label="XP Earned" value={`${result.xpEarned || 0}`} />
                <ResultStatCard icon={<Zap className="w-5 h-5 text-yellow-400" />} label="Attempts" value={`${result.totalAttempts || 0}`} />
              </div>
            </div>
          </div>
        )}

        {error && !isReviewMode && (
          <div className="mb-6 rounded-2xl border border-[#f43f5e]/25 bg-[#2a0710] px-5 py-4 flex items-start gap-3 text-[#fda4af]">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {!isReviewMode && (
            <div className="flex items-center justify-between gap-3 px-1">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-gray-500 mb-1">Question Section</p>
                <h3 className="text-lg md:text-xl font-black text-white">Keep guessing until each answer is right</h3>
              </div>
              <div className="hidden md:flex items-center gap-2 rounded-full border border-[#1a1a1a] bg-[#080808] px-4 py-2 text-xs font-bold text-gray-400">
                <Zap className="w-4 h-4 text-sats-orange-500" /> Wrong tries reduce reward
              </div>
            </div>
          )}

          {sortedQuestions.map((question, index) => {
            const reviewItem = getReviewItem(result, question.id);
            return (
              <div key={question.id} className="bg-[#080808] border border-[#1a1a1a] rounded-[28px] p-5 sm:p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`shrink-0 w-11 h-11 rounded-2xl border flex items-center justify-center ${isReviewMode ? (reviewItem?.isCorrect ? 'bg-[#052e1a] border-[#22c55e]/35' : 'bg-[#2a0710] border-[#f43f5e]/35') : 'bg-sats-orange-500/10 border-sats-orange-500/20'}`}>
                    {isReviewMode ? (
                      reviewItem?.isCorrect ? <CircleCheckBig className="w-5 h-5 text-[#4ade80]" /> : <CircleX className="w-5 h-5 text-[#fb7185]" />
                    ) : (
                      <span className="text-sm font-black text-sats-orange-500">{index + 1}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">Question {index + 1}</p>
                    <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">{question.questionText}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 md:pl-[3.75rem]">
                  {question.options.map((opt, optionIndex) => {
                    const solvedAnswer = solvedQuestions[question.id];
                    const reviewWrongOptions = reviewItem?.wrongAnswers || [];
                    const storedWrongOptions = wrongOptionsByQuestion[question.id] || [];
                    const wrongOptions = reviewWrongOptions.length ? reviewWrongOptions : storedWrongOptions;
                    const isPreviouslyWrong = wrongOptions.includes(opt);
                    const isSelected = answers[question.id] === opt;
                    const isCorrectOption = isReviewMode
                      ? isCorrectReviewOption(result, question.id, opt)
                      : Boolean(solvedAnswer) && getInstantCorrectAnswer(normalizedQuiz, question.id) === opt;
                    const isWrongOption = !isCorrectOption && isPreviouslyWrong;
                    const isQuestionSubmitting = submittingQuestionId === question.id;
                    const isOptionDisabled = isReviewMode || Boolean(solvedAnswer) || isPreviouslyWrong || isQuestionSubmitting;

                    const optionClass = isReviewMode
                      ? isCorrectOption
                        ? 'bg-[#052e1a] border-[#22c55e]/45 text-[#86efac] shadow-[0_0_24px_rgba(34,197,94,0.18)]'
                        : isWrongOption
                          ? 'bg-[#2a0710] border-[#f43f5e]/45 text-[#fda4af] shadow-[0_0_24px_rgba(244,63,94,0.16)]'
                          : 'bg-[#111] border-[#1a1a1a] text-gray-300'
                      : isCorrectOption
                        ? 'bg-[#052e1a] border-[#22c55e]/45 text-[#86efac] shadow-[0_0_24px_rgba(34,197,94,0.18)]'
                        : isWrongOption
                          ? 'bg-[#2a0710] border-[#f43f5e]/45 text-[#fda4af] shadow-[0_0_24px_rgba(244,63,94,0.16)]'
                          : 'bg-[#111] border-[#1a1a1a] text-gray-300 hover:border-[#333] hover:bg-[#151515]';

                    const dotClass = isCorrectOption
                      ? 'border-[#4ade80] bg-[#4ade80]'
                      : isWrongOption
                        ? 'border-[#fb7185] bg-[#fb7185]'
                        : isSelected
                          ? 'border-sats-orange-500 bg-sats-orange-500'
                          : 'border-[#444] group-hover:border-gray-500';

                    return (
                      <button
                        key={optionIndex}
                        onClick={() => handleSelectOption(question.id, opt)}
                        disabled={isOptionDisabled}
                        className={`relative flex items-center w-full p-4 md:p-5 rounded-2xl border text-left transition-all duration-200 group outline-none ${optionClass} ${isOptionDisabled ? 'cursor-default' : ''}`}
                      >
                        <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${dotClass}`}>
                          {(isCorrectOption || isWrongOption || isSelected) && <div className="w-2 h-2 bg-black rounded-full" />}
                        </div>

                        <span className={`text-sm md:text-base font-medium flex-1 break-words ${isCorrectOption ? 'text-[#86efac] font-bold' : isWrongOption ? 'text-[#fda4af] font-bold' : isSelected ? 'text-sats-orange-400 font-bold' : 'text-gray-300'}`}>
                          {opt}
                        </span>

                        {(isReviewMode || isCorrectOption || isWrongOption || isQuestionSubmitting) && (
                          <div className="ml-3 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest">
                            {isCorrectOption && <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">Correct</span>}
                            {isWrongOption && <span className="px-2 py-1 rounded-full bg-[#2a0710] border border-[#f43f5e]/35 text-[#fecdd3]">Locked</span>}
                            {isQuestionSubmitting && !isCorrectOption && !isWrongOption && <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">Checking...</span>}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {(isReviewMode || Boolean(solvedQuestions[question.id])) && (reviewItem?.explanation || question.explanation) && (
                  <div className="mt-4 rounded-2xl border border-sky-500/15 bg-sky-500/10 px-5 py-4 flex items-start gap-3">
                    <Brain className="w-5 h-5 text-sky-300 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-sky-200/90 mb-1">Why this answer is right</p>
                      <p className="text-sm text-sky-100/85 leading-relaxed">{reviewItem?.explanation || question.explanation}</p>
                    </div>
                  </div>
                )}

                {!isReviewMode && Boolean(feedbackByQuestion[question.id]) && (
                  <div className={`mt-4 rounded-2xl px-5 py-4 flex items-start gap-3 border ${feedbackByQuestion[question.id]?.correct ? 'border-[#22c55e]/35 bg-[#052e1a]' : 'border-[#f43f5e]/35 bg-[#2a0710]'}`}>
                    {feedbackByQuestion[question.id]?.correct ? (
                      <CircleCheckBig className="w-5 h-5 text-[#4ade80] shrink-0 mt-0.5" />
                    ) : (
                      <CircleX className="w-5 h-5 text-[#fb7185] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`text-xs font-black uppercase tracking-widest mb-1 ${feedbackByQuestion[question.id]?.correct ? 'text-[#bbf7d0]' : 'text-[#fecdd3]'}`}>
                        {feedbackByQuestion[question.id]?.correct ? 'Correct answer' : 'Wrong answer saved'}
                      </p>
                      <p className={`text-sm leading-relaxed ${feedbackByQuestion[question.id]?.correct ? 'text-[#dcfce7]' : 'text-[#ffe4e6]'}`}>
                        {feedbackByQuestion[question.id]?.message}
                      </p>
                      {!feedbackByQuestion[question.id]?.correct && (
                        <p className="text-xs text-[#fecdd3] mt-2">Current try count: {attemptCounts[question.id] || 0}</p>
                      )}
                      {feedbackByQuestion[question.id]?.correct && (
                        <p className="text-xs text-[#bbf7d0] mt-2">Solved in {attemptCounts[question.id] || 1} attempt{(attemptCounts[question.id] || 1) > 1 ? 's' : ''}.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {!isReviewMode && (
            <div className="pt-2 md:pt-4 flex justify-center">
              <div className="w-full max-w-3xl rounded-[28px] border border-[#1a1a1a] bg-[#080808] px-4 sm:px-5 md:px-6 py-4 md:py-5 shadow-[0_0_30px_rgba(0,0,0,0.18)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Progress</p>
                        <p className="text-sm md:text-base text-white/70 font-semibold mt-1">{answeredCount} / {totalQuestions} solved</p>
                      </div>
                      <div className="sm:hidden flex items-center gap-1.5">
                        {Array.from({ length: totalQuestions }).map((_, progressIndex) => (
                          <div key={progressIndex} className={`h-1.5 rounded-full transition-all duration-300 ${progressIndex < answeredCount ? 'bg-sats-orange-500 w-4' : 'bg-white/10 w-2'}`} />
                        ))}
                      </div>
                    </div>

                    <div className="hidden sm:block">
                      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full bg-sats-orange-500 rounded-full transition-all duration-500" style={{ width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto sm:min-w-[220px] flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide bg-[#111] text-white/75 border border-[#1a1a1a]">
                    {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-sats-orange-500" />}
                    <span>{submittingQuestionId ? 'Saving answer...' : 'Auto-submit on correct answer'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getReviewItem(result: QuizResult | null, questionId: string) {
  return result?.review?.find((item) => item.questionId === questionId);
}

function isCorrectReviewOption(result: QuizResult | null, questionId: string, option: string) {
  return getReviewItem(result, questionId)?.correctAnswer === option;
}

function getInstantCorrectAnswer(quiz: TodayQuiz | null, questionId: string) {
  return quiz?.questions.find((item) => item.id === questionId)?.correctAnswer || null;
}

function QuizPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#020202] px-4 md:px-6 lg:px-8 py-6 md:py-8 animate-pulse">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="rounded-[28px] border border-[#1a1a1a] bg-[#080808] px-6 py-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-[#111]" />
          <div className="space-y-2 flex-1">
            <div className="h-3 w-16 rounded-full bg-[#111]" />
            <div className="h-8 w-40 rounded-xl bg-[#111]" />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 xl:gap-8">
          <div className="rounded-[30px] bg-[#080808] border border-[#1a1a1a] p-6 md:p-8 space-y-4">
            <div className="h-4 w-24 rounded-full bg-[#111]" />
            <div className="h-10 w-3/4 rounded-2xl bg-[#111]" />
            <div className="h-5 w-2/3 rounded-xl bg-[#111]" />
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-28 rounded-[24px] bg-[#0a0a0a] border border-[#1a1a1a]" />
            ))}
          </div>
        </div>

        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-[28px] bg-[#080808] border border-[#1a1a1a] p-6 md:p-8">
            <div className="flex gap-4 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-[#111]" />
              <div className="flex-1 space-y-3">
                <div className="h-6 rounded-xl bg-[#111] w-4/5" />
                <div className="h-4 rounded-xl bg-[#0f0f0f] w-2/5" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 md:pl-[3.75rem]">
              {[1, 2, 3, 4].map((option) => (
                <div key={option} className="h-16 rounded-2xl bg-[#111] border border-[#1a1a1a]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuizEmptyState({
  title,
  message,
  tone,
  onBack,
}: {
  title: string;
  message: string;
  tone: 'success' | 'neutral';
  onBack: () => void;
}) {
  const toneClasses = tone === 'success' ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-sky-500/20 bg-sky-500/10';

  return (
    <div className="min-h-screen bg-[#020202] px-4 md:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className={`rounded-[32px] border ${toneClasses} p-8 md:p-10 text-center shadow-[0_0_40px_rgba(14,165,233,0.08)]`}>
          <div className="w-16 h-16 rounded-full bg-[#080808] border border-[#1a1a1a] flex items-center justify-center mx-auto mb-5">
            {tone === 'success' ? <CheckCircle2 className="w-8 h-8 text-emerald-400" /> : <Clock3 className="w-8 h-8 text-sky-300" />}
          </div>
          <h1 className="text-3xl font-black text-white mb-3">{title}</h1>
          <p className="text-gray-300 font-medium max-w-xl mx-auto">{message}</p>
          <button onClick={onBack} className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#080808] border border-[#1a1a1a] text-white font-bold hover:border-[#2a2a2a] transition-all">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: 'orange' | 'blue' | 'green';
}) {
  const accentBorder = accent === 'orange' ? 'border-sats-orange-500/20' : accent === 'blue' ? 'border-sky-500/20' : 'border-emerald-500/20';
  return (
    <div className={`rounded-[24px] border ${accentBorder} bg-[#080808] p-5`}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-[10px] font-black uppercase sm:tracking-widest text-gray-500">{label}</p>
        {icon}
      </div>
      <p className="text-xl sm:text-xl md:text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function ResultStatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-[#050505] px-4 py-4">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">{label}</p>
      </div>
      <p className="text-xl font-black text-white">{value}</p>
    </div>
  );
}
