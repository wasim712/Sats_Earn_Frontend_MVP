'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Loader2, Plus, Save } from 'lucide-react';
import type { FaqItem } from '../content/content.types';
import { FaqList } from './FaqList';
import { createAdminFaq, deleteAdminFaq, fetchAdminFaqs, updateAdminFaq } from '@/features/admin/adminFaqsSlice';

function parseWholeNumber(value: string) {
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly === '') return '';

  const parsed = Number.parseInt(digitsOnly, 10);
  return Number.isNaN(parsed) ? '' : parsed;
}

export default function AdminFaqsPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [sortOrder, setSortOrder] = useState<number | ''>('');
  const [isActive, setIsActive] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { items, isLoading, isSaving, error } = useAppSelector((state) => state.adminFaqs);

  useEffect(() => {
    dispatch(fetchAdminFaqs());
  }, [dispatch]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(null);
    try {
      await dispatch(createAdminFaq({ question, answer, category, sortOrder: typeof sortOrder === 'number' ? sortOrder : 0, isActive })).unwrap();

      setQuestion('');
      setAnswer('');
      setCategory('');
      setSortOrder('');
      setIsActive(true);
      setSuccess('FAQ item created successfully.');
    } catch (err: any) {
      setLocalError(err.message || 'Failed to create FAQ item.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteAdminFaq(id)).unwrap();
    } catch (err: any) {
      setLocalError(err.message || 'Failed to delete FAQ item.');
    }
  };

  const handleToggleStatus = async (item: FaqItem) => {
    try {
      await dispatch(updateAdminFaq({ id: item.id, isActive: !item.isActive })).unwrap();
      setSuccess(`FAQ ${item.isActive ? 'paused' : 'activated'} successfully.`);
      setLocalError(null);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to update FAQ item.');
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white">FAQ Manager</h1>
          <p className="text-sm text-gray-400 mt-1">Create and manage FAQ blocks for the user help section. Lower order values appear first.</p>
        </div>

        {(localError || error) && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{localError || error}</div>}
        {success && <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">{success}</div>}

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
          <form onSubmit={handleCreate} className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Plus className="w-5 h-5 text-sats-orange-500" />
              <h2 className="text-xl font-black text-white">Create FAQ Item</h2>
            </div>

            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question" className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" required />
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Answer" className="w-full min-h-36 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" required />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" />
              <input type="text" inputMode="numeric" pattern="[0-9]*" value={sortOrder} onChange={(e) => setSortOrder(parseWholeNumber(e.target.value))} placeholder="Order" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" />
              <label className="inline-flex items-center gap-3 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-sm text-gray-300">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                Active
              </label>
            </div>

            <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-xl bg-sats-orange-500 px-5 py-3 font-black text-black disabled:opacity-50">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save FAQ
            </button>
          </form>

          <FaqList items={items} isLoading={isLoading} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
        </div>
      </div>
    </div>
  );
}
