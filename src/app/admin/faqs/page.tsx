'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Save } from 'lucide-react';
import { API_URL, getStoredToken } from '../content/content.helpers';
import type { FaqItem } from '../content/content.types';
import { FaqList } from './FaqList';

export default function AdminFaqsPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadFaqs = async () => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/admin/faqs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load FAQs.');
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load FAQs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/admin/faqs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question, answer, category, sortOrder, isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create FAQ item.');

      setQuestion('');
      setAnswer('');
      setCategory('');
      setSortOrder(0);
      setIsActive(true);
      setSuccess('FAQ item created successfully.');
      await loadFaqs();
    } catch (err: any) {
      setError(err.message || 'Failed to create FAQ item.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/admin/faqs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete FAQ item.');
      await loadFaqs();
    } catch (err: any) {
      setError(err.message || 'Failed to delete FAQ item.');
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white">FAQ Manager</h1>
          <p className="text-sm text-gray-400 mt-1">Create and manage FAQ blocks. Tell me later where you want them pasted.</p>
        </div>

        {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
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
              <input type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value) || 0)} placeholder="Sort order" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" />
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

          <FaqList items={items} isLoading={isLoading} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
