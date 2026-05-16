'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTodayQuiz, submitTodayQuiz, clearQuizState } from '@/features/user/userQuizSlice';
import { Zap, CheckCircle2, ChevronRight, ArrowLeft, Calendar, Sparkles } from 'lucide-react';

export default function UserDailyQuizPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { quiz, result, isLoading, isSubmitting, error } = useAppSelector((state) => state.userQuiz);

  // Local state to track user's selected answers map: { questionId: selectedOption }
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const quizQuestions = Array.isArray(quiz?.questions) ? quiz.questions : [];
  const alreadyCompleted = Boolean(
    error &&
      (error.toLowerCase().includes('already completed') ||
        error.toLowerCase().includes('already submitted'))
  );

  useEffect(() => {
    dispatch(fetchTodayQuiz());
    return () => { dispatch(clearQuizState()); };
  }, [dispatch]);

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    
    // Format answers for the backend schema
    const payload = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    await dispatch(submitTodayQuiz(payload));
  };

  // Check if every question has an answer
  const isAllAnswered = quizQuestions.length > 0 && Object.keys(answers).length === quizQuestions.length;

  // ─── Loading Skeleton State ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto w-full mt-4 md:mt-8 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex flex-col items-center md:items-start mb-10">
            <div className="h-6 w-24 bg-[#1a1a1a] rounded-full mb-5" />
            <div className="h-10 w-3/4 max-w-md bg-[#1a1a1a] rounded-xl mb-4" />
            <div className="h-5 w-40 bg-[#1a1a1a] rounded-md" />
          </div>

          {/* Questions Skeleton */}
          <div className="space-y-6 md:space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#080808] border border-[#1a1a1a] rounded-3xl p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-8 h-8 bg-[#1a1a1a] rounded-xl shrink-0" />
                  <div className="h-6 bg-[#1a1a1a] rounded-lg w-full mt-1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-0 md:pl-12">
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

  if (alreadyCompleted && !quiz && !result) {
    return (
      <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto w-full mt-4 md:mt-8">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="bg-[#080808] border border-green-500/20 rounded-3xl p-8 md:p-10 text-center shadow-[0_0_40px_rgba(34,197,94,0.08)]">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-3">Quiz Already Completed</h1>
            <p className="text-gray-400 font-medium">You have already completed today&apos;s quiz. Come back tomorrow for the next one.</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error / Empty State (Friendly UI) ────────────────────────────────────
  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-[#020202] p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="bg-[#080808] border border-[#1a1a1a] rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-sats-orange-500/10 blur-3xl rounded-full" />
          
          <div className="w-20 h-20 bg-[#111] border border-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-inner">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-black text-white mb-3">All Caught Up!</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed px-4">
            There is no active quiz right now. Come back tomorrow for a new chance to earn Sats!
          </p>
          
          <button onClick={() => router.push('/user/dashboard')} className="w-full py-4 rounded-xl bg-[#111] border border-[#2a2a2a] text-white font-bold hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4 text-gray-500" /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ─── Result State (Friendly Completed UI) ─────────────────────────────────
  if (result) {
    return (
      <div className="min-h-screen bg-[#020202] p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-sats-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="bg-[#080808] border border-[#1a1a1a] rounded-3xl p-8 max-w-md w-full text-center relative z-10 shadow-2xl">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-sats-orange-500/20 rounded-full animate-pulse blur-xl" />
            <div className="relative flex items-center justify-center w-full h-full bg-[#111] border border-sats-orange-500/30 rounded-full shadow-inner">
              <Sparkles className="w-10 h-10 text-sats-orange-500" />
            </div>
          </div>

          <p className="text-sats-orange-500 font-bold uppercase tracking-widest text-xs mb-2">Daily Task Complete</p>
          <h1 className="text-3xl font-black text-white mb-3">Awesome Job!</h1>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed px-2">
            Today&apos;s quiz is successfully completed. Come back tomorrow for another chance to stack Sats!
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-sats-black-900 border border-[#1a1a1a] rounded-2xl p-5 flex flex-col items-center justify-center">
               <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1.5">Your Score</p>
               <p className="text-3xl font-black text-white">{result.score}<span className="text-sm text-gray-500 font-medium ml-1">/ {quiz.questions.length}</span></p>
            </div>
            <div className="bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-2xl p-5 flex flex-col items-center justify-center">
               <p className="text-[10px] text-sats-orange-500/80 uppercase tracking-widest font-bold mb-1.5">Earned</p>
               <p className="text-3xl font-black text-sats-orange-500">~ {result.rewardEarned}</p>
            </div>
          </div>

          <button onClick={() => router.push('/user/dashboard')} className="w-full py-4 rounded-xl bg-sats-orange-500 text-black font-black hover:bg-sats-orange-400 transition-all flex items-center justify-center gap-2">
            Return to Dashboard <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // ─── Active Quiz State ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#020202] pb-40 relative">
      <div className="max-w-3xl mx-auto w-full">
        
        {/* Header - Centered on Mobile, Left aligned on Desktop */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-4 md:mt-8 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/20 text-sats-orange-500 text-xs font-bold uppercase tracking-widest mb-4">
              <Calendar className="w-3.5 h-3.5" /> Daily Quiz
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">{quiz.title}</h1>
            <p className="text-sm md:text-base text-gray-400 font-medium flex items-center justify-center md:justify-start gap-2">
              <Zap className="w-4 h-4 text-sats-orange-500 shrink-0" />
              Reward Pool: <span className="text-sats-orange-500 font-bold">~ {quiz.rewardSats} Sats</span>
            </p>
          </div>
          
          <button onClick={() => router.back()} className="hidden md:flex items-center justify-center gap-2 px-5 py-2.5 bg-sats-black-900 border border-[#1a1a1a] rounded-xl text-gray-400 hover:text-white hover:bg-[#111] transition-all text-sm font-semibold shrink-0">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>

        {/* Questions List */}
        <div className="space-y-6 md:space-y-8 p-2">
          {[...quiz.questions].sort((a, b) => a.order - b.order).map((question, index) => (
            <div key={question.id} className="bg-[#080808] border border-[#1a1a1a] rounded-3xl p-6 md:p-8 transition-colors duration-300 hover:border-[#2a2a2a]">
              <div className="flex flex-col md:flex-row items-start gap-4 md:gap-5 mb-6 md:mb-8 text-center md:text-left">
                
                <div className="shrink-0 w-10 h-10 mx-auto md:mx-0 rounded-xl bg-[#111] border border-[#2a2a2a] flex items-center justify-center shadow-inner mt-1">
                  <span className="text-base font-black text-gray-400">{index + 1}</span>
                </div>
                
                <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                  {question.questionText}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pl-0 md:pl-15">
                 {question.options.map((opt, i) => {
                   const isSelected = answers[question.id] === opt;
                   return (
                     <button
                       key={i}
                       onClick={() => handleSelectOption(question.id, opt)}
                       className={`relative flex items-center w-full p-4 md:p-5 rounded-2xl border text-left transition-all duration-200 group outline-none ${
                         isSelected 
                           ? 'bg-sats-orange-500/10 border-sats-orange-500/40 shadow-[0_0_20px_rgba(238,139,18,0.1)]' 
                           : 'bg-[#111] border-[#1a1a1a] hover:border-[#333] hover:bg-[#151515]'
                       }`}
                     >
                       <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
                         isSelected ? 'border-sats-orange-500 bg-sats-orange-500' : 'border-[#444] group-hover:border-gray-500'
                       }`}>
                         {isSelected && <div className="w-2 h-2 bg-black rounded-full" />}
                       </div>
                       
                       <span className={`text-sm md:text-base font-medium flex-1 wrap-break-word ${isSelected ? 'text-sats-orange-400 font-bold' : 'text-gray-300'}`}>
                         {opt}
                       </span>
                     </button>
                   );
                 })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Action Bar - Centered Content */}
      <div className=" bottom-0 left-0 right-0 p-4 md:p-6 bg-linear-to-t from-[#020202] via-[#020202]/90 to-transparent pointer-events-none z-50">
        <div className="max-w-3xl mx-auto flex justify-center pointer-events-auto relative group">
           
           {/* Tooltip */}
           {!isAllAnswered && (
             <div className="absolute -top-14 bg-[#111] border border-[#2a2a2a] text-gray-300 text-xs font-bold px-4 py-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-2xl whitespace-nowrap pointer-events-none">
               Please answer all questions to submit.
             </div>
           )}

           {/* Submit Button */}
           <button
             onClick={handleSubmit}
             disabled={!isAllAnswered || isSubmitting}
             className={`py-4 px-8 md:px-12 rounded-2xl font-black tracking-wide flex items-center justify-center gap-3 transition-all duration-300 w-full sm:w-auto min-w-70 ${
               isAllAnswered 
                 ? 'bg-sats-orange-500 text-black hover:bg-sats-orange-400 active:scale-[0.98] shadow-[0_0_40px_rgba(238,139,18,0.3)]' 
                 : 'bg-sats-orange-500/10 text-sats-orange-500/50 border border-sats-orange-500/20 cursor-not-allowed'
             }`}
           >
             {isSubmitting ? (
               <>
                 <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                 Submitting...
               </>
             ) : (
               <>
                 Submit Quiz <CheckCircle2 className={`w-5 h-5 ${isAllAnswered ? 'text-black' : 'text-sats-orange-500/50'}`} />
               </>
             )}
           </button>
        </div>
      </div>
    </div>
  );
}
