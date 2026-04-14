// 'use client';

// import { useState, useEffect } from 'react';
// import { X, CheckCircle2 } from 'lucide-react';
// import { useAppDispatch } from '@/store/hooks';
// import { addQuestion, updateQuestion } from '@/features/admin/adminQuizSlice';
// import type { Question } from '@/features/admin/adminQuizSlice';

// // ─── Constants ────────────────────────────────────────────────────────────────

// const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;
// const MAX_OPTIONS = 4;

// // ─── Props ────────────────────────────────────────────────────────────────────

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   quizId: string;
//   /** Pass a Question for edit mode. Omit/null for add mode. */
//   question?: Question | null;
//   /** The `order` value to assign when adding a new question. */
//   nextOrder: number;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function AddEditQuestionModal({
//   isOpen,
//   onClose,
//   quizId,
//   question,
//   nextOrder,
// }: Props) {
//   const dispatch = useAppDispatch();
//   const isEditMode = !!question;

//   const [questionText, setQuestionText] = useState('');
//   // Always track 4 slots; blank slots are filtered out before submission
//   const [options, setOptions] = useState<string[]>(['', '', '', '']);
//   const [correctAnswer, setCorrectAnswer] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // ── Sync form on open / question change ────────────────────────────────────

//   useEffect(() => {
//     if (!isOpen) return;

//     if (question) {
//       setQuestionText(question.questionText);
//       // Pad to MAX_OPTIONS slots so the UI always shows 4 rows
//       const padded = [...question.options];
//       while (padded.length < MAX_OPTIONS) padded.push('');
//       setOptions(padded);
//       setCorrectAnswer(question.correctAnswer);
//     } else {
//       setQuestionText('');
//       setOptions(['', '', '', '']);
//       setCorrectAnswer('');
//     }
//     setError(null);
//   }, [isOpen, question]);

//   if (!isOpen) return null;

//   // ── Handlers ───────────────────────────────────────────────────────────────

//   const handleOptionChange = (index: number, value: string) => {
//     const updated = [...options];
//     // If the user edits the option that is currently the correct answer,
//     // keep correctAnswer in sync so the highlight follows the text.
//     if (correctAnswer === updated[index]) setCorrectAnswer(value);
//     updated[index] = value;
//     setOptions(updated);
//   };

//   const handleMarkCorrect = (opt: string) => {
//     if (opt.trim()) setCorrectAnswer(opt);
//   };

//   // ── Validation ─────────────────────────────────────────────────────────────

//   const validate = (): string | null => {
//     if (!questionText.trim()) return 'Question text is required.';

//     const filled = options.filter((o) => o.trim());
//     if (filled.length < 2) return 'At least 2 options are required.';

//     const lower = filled.map((o) => o.trim().toLowerCase());
//     if (new Set(lower).size !== lower.length) return 'All options must be unique.';

//     if (!correctAnswer.trim()) return 'Please mark one option as the correct answer.';
//     if (!options.includes(correctAnswer))
//       return 'The correct answer must match one of the options above.';

//     return null;
//   };

//   // ── Submit ─────────────────────────────────────────────────────────────────

//   const handleSubmit = async () => {
//     const validationError = validate();
//     if (validationError) { setError(validationError); return; }

//     const filledOptions = options.filter((o) => o.trim());

//     setIsSubmitting(true);
//     setError(null);

//     try {
//       if (isEditMode && question) {
//         await dispatch(
//           updateQuestion({
//             quizId,
//             questionId: question.id,
//             data: {
//               questionText: questionText.trim(),
//               options: filledOptions,
//               correctAnswer,
//             },
//           })
//         ).unwrap();
//       } else {
//         await dispatch(
//           addQuestion({
//             quizId,
//             data: {
//               questionText: questionText.trim(),
//               options: filledOptions,
//               correctAnswer,
//               order: nextOrder,
//             },
//           })
//         ).unwrap();
//       }
//       onClose();
//     } catch (err: any) {
//       setError(typeof err === 'string' ? err : 'Something went wrong. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ── Derived ────────────────────────────────────────────────────────────────

//   const correctIsValid =
//     correctAnswer.trim() !== '' && options.includes(correctAnswer);

//   // ── Render ─────────────────────────────────────────────────────────────────

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="w-full max-w-lg bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl relative overflow-hidden shadow-2xl shadow-black/60 max-h-[92vh] flex flex-col">
//         {/* Ambient glow */}
//         <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-32 bg-sats-orange-500/8 rounded-full blur-3xl pointer-events-none" />

//         {/* ── Fixed Header ── */}
//         <div className="relative flex items-start justify-between px-6 pt-6 pb-5 shrink-0 border-b border-[#1a1a1a]">
//           <div>
//             <h2 className="text-xl font-bold text-white tracking-tight">
//               {isEditMode ? 'Edit Question' : 'Add Question'}
//             </h2>
//             <p className="text-sm text-white/40 mt-0.5">
//               {isEditMode
//                 ? 'Update the question details below.'
//                 : 'Fill in the question and mark the correct answer.'}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             aria-label="Close modal"
//             className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all -mt-0.5 -mr-0.5"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* ── Scrollable Body ── */}
//         <div className="relative overflow-y-auto flex-1 px-6 py-5">
//           <div className="space-y-5">
//             {/* Question Text */}
//             <div>
//               <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
//                 Question <span className="text-red-400">*</span>
//               </label>
//               <textarea
//                 value={questionText}
//                 onChange={(e) => setQuestionText(e.target.value)}
//                 placeholder="e.g. What is the maximum supply of Bitcoin?"
//                 rows={3}
//                 className="w-full bg-[#111] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-sats-orange-500/40 hover:border-white/10 transition-colors resize-none"
//               />
//             </div>

//             {/* Options */}
//             <div>
//               <div className="flex items-center justify-between mb-2.5">
//                 <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
//                   Options <span className="text-red-400">*</span>
//                 </label>
//                 <span className="text-[10px] text-white/25 select-none">
//                   Click ○ to mark correct answer
//                 </span>
//               </div>

//               <div className="space-y-2.5">
//                 {options.map((opt, i) => {
//                   const isCorrect = correctAnswer === opt && opt.trim() !== '';
//                   const isFilled = opt.trim() !== '';

//                   return (
//                     <div
//                       key={i}
//                       className={`flex items-center gap-3 border rounded-xl px-3.5 py-3 transition-all duration-150 ${
//                         isCorrect
//                           ? 'border-green-500/35 bg-green-500/5'
//                           : 'border-[#1a1a1a] bg-[#111] hover:border-white/8'
//                       }`}
//                     >
//                       {/* Label */}
//                       <span
//                         className={`text-xs font-bold w-4 text-center shrink-0 transition-colors ${
//                           isCorrect ? 'text-green-400' : 'text-white/20'
//                         }`}
//                       >
//                         {OPTION_LABELS[i]}
//                       </span>

//                       {/* Text input */}
//                       <input
//                         type="text"
//                         value={opt}
//                         onChange={(e) => handleOptionChange(i, e.target.value)}
//                         placeholder={`Option ${OPTION_LABELS[i]}${i < 2 ? ' (required)' : ''}`}
//                         className="flex-1 bg-transparent text-white text-sm placeholder:text-white/15 focus:outline-none"
//                       />

//                       {/* Correct-answer toggle */}
//                       <button
//                         onClick={() => handleMarkCorrect(opt)}
//                         title={
//                           isFilled
//                             ? 'Mark as correct answer'
//                             : 'Enter an option first'
//                         }
//                         className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
//                           isCorrect
//                             ? 'border-green-500 bg-green-500'
//                             : isFilled
//                               ? 'border-white/20 hover:border-sats-orange-500/70 cursor-pointer'
//                               : 'border-white/8 cursor-not-allowed opacity-30'
//                         }`}
//                       >
//                         {isCorrect && (
//                           <svg
//                             className="w-2.5 h-2.5 text-white"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                             strokeWidth={3.5}
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               d="M5 13l4 4L19 7"
//                             />
//                           </svg>
//                         )}
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Correct answer status line */}
//               <div className="mt-2.5 h-5">
//                 {correctIsValid ? (
//                   <p className="flex items-center gap-1.5 text-xs text-green-400">
//                     <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
//                     Correct answer:&nbsp;
//                     <span className="font-semibold truncate max-w-[200px]">
//                       "{correctAnswer}"
//                     </span>
//                   </p>
//                 ) : (
//                   <p className="text-xs text-white/20">
//                     No correct answer selected yet.
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Error */}
//           {error && (
//             <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
//               {error}
//             </div>
//           )}

//           {/* Actions */}
//           <div className="flex gap-3 mt-6">
//             <button
//               onClick={onClose}
//               className="flex-1 py-3 rounded-xl border border-[#1a1a1a] text-white/50 text-sm font-medium hover:border-white/20 hover:text-white/80 transition-all"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//               className="flex-1 py-3 rounded-xl bg-sats-orange-500 text-black text-sm font-bold hover:bg-sats-orange-500/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting
//                 ? isEditMode
//                   ? 'Saving...'
//                   : 'Adding...'
//                 : isEditMode
//                   ? 'Save Changes'
//                   : 'Add Question'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }