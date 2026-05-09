'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Eye, Loader2, Save, Send, Trash2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImageUrl?: string | null;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
};

const toolbarActions = [
  { label: 'B', command: 'bold' },
  { label: 'I', command: 'italic' },
  { label: 'U', command: 'underline' },
  { label: 'H2', command: 'formatBlock', value: 'h2' },
  { label: 'H3', command: 'formatBlock', value: 'h3' },
  { label: '• List', command: 'insertUnorderedList' },
  { label: '1. List', command: 'insertOrderedList' },
];

export default function AdminBlogsPage() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [content, setContent] = useState('<p>Start writing your blog post...</p>');
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = useMemo(
    () => (typeof window !== 'undefined' ? sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token') : null),
    [],
  );

  const loadPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/blogs`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to load blog posts.');
      setPosts(await res.json());
    } catch (err: any) {
      setError(err.message || 'Failed to load blog posts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  useEffect(() => {
    if (!slug && title) {
      setSlug(
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-'),
      );
    }
  }, [title, slug]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    setContent(editorRef.current?.innerHTML || '');
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/admin/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          coverImageUrl,
          isPublished,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save blog post.');
      setSuccess(isPublished ? 'Blog published successfully.' : 'Draft saved successfully.');
      setTitle('');
      setSlug('');
      setExcerpt('');
      setCoverImageUrl('');
      setContent('<p>Start writing your blog post...</p>');
      setIsPublished(false);
      if (editorRef.current) editorRef.current.innerHTML = '<p>Start writing your blog post...</p>';
      await loadPosts();
    } catch (err: any) {
      setError(err.message || 'Failed to save blog post.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete blog post.');
      await loadPosts();
    } catch (err: any) {
      setError(err.message || 'Failed to delete blog post.');
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white">Blog Editor</h1>
          <p className="text-sm text-gray-400 mt-1">Create formatted blog posts for your admin-managed content hub.</p>
        </div>

        {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
        {success && <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">{success}</div>}

        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-6">
          <div className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blog title" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" />
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="blog-slug" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" />
            </div>

            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short excerpt" className="w-full min-h-24 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" />
            <input value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="Cover image URL" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white w-full" />

            <div className="flex flex-wrap gap-2 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-3">
              {toolbarActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => execCommand(action.command, action.value)}
                  className="rounded-lg border border-[#2a2a2a] px-3 py-2 text-xs font-bold text-white hover:border-sats-orange-500 hover:text-sats-orange-400"
                >
                  {action.label}
                </button>
              ))}
              <button type="button" onClick={() => setIsPreview((prev) => !prev)} className="ml-auto inline-flex items-center gap-2 rounded-lg border border-[#2a2a2a] px-3 py-2 text-xs font-bold text-white hover:border-sats-orange-500 hover:text-sats-orange-400">
                <Eye className="w-4 h-4" />
                {isPreview ? 'Edit' : 'Preview'}
              </button>
            </div>

            {isPreview ? (
              <div className="min-h-[360px] rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-5 text-white prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
                className="min-h-[360px] rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-5 text-white focus:outline-none"
              />
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="inline-flex items-center gap-3 text-sm text-gray-300">
                <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-4 w-4 rounded border-[#2a2a2a] bg-[#0a0a0a]" />
                Publish immediately
              </label>
              <button onClick={handleSave} disabled={isSaving} className="inline-flex items-center gap-2 rounded-xl bg-sats-orange-500 px-5 py-3 font-black text-black disabled:opacity-50">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : isPublished ? <Send className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {isPublished ? 'Publish Blog' : 'Save Draft'}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-sats-orange-500" />
              <h2 className="text-xl font-black text-white">Existing Posts</h2>
            </div>
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-sm text-gray-400">Loading blog posts...</div>
              ) : posts.length === 0 ? (
                <div className="text-sm text-gray-400">No blog posts yet.</div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-black text-white">{post.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">/{post.slug}</p>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${post.isPublished ? 'bg-green-500/10 text-green-300' : 'bg-yellow-500/10 text-yellow-300'}`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    {post.excerpt && <p className="text-xs text-gray-400 mt-3">{post.excerpt}</p>}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">{new Date(post.createdAt).toLocaleString()}</span>
                      <button onClick={() => handleDelete(post.id)} className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/20">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
