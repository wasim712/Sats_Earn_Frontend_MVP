'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Heading1, Heading2, ImageIcon, Link2, List, ListOrdered, Loader2, Quote, Save, Send, Type, Undo2 } from 'lucide-react';
import { API_URL, EMPTY_BLOG_HTML, getStoredToken, slugify } from '../content/content.helpers';
import type { BlogPost, EditorButton } from '../content/content.types';
import { BlogEditorToolbar } from './BlogEditorToolbar';
import { BlogPostList } from './BlogPostList';

export default function AdminBlogsPage() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [content, setContent] = useState(EMPTY_BLOG_HTML);
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = getStoredToken();

  const syncEditor = (html?: string) => {
    const value = html ?? content;
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setCoverImageUrl('');
    setContent(EMPTY_BLOG_HTML);
    setIsPublished(false);
    setIsPreview(false);
    setTimeout(() => syncEditor(EMPTY_BLOG_HTML), 0);
  };

  const loadPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/blogs`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load blog posts.');
      setPosts(data);
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
    syncEditor();
  }, [content]);

  useEffect(() => {
    if (!slug && title) {
      setSlug(slugify(title));
    }
  }, [title, slug]);

  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    setContent(editorRef.current?.innerHTML || '');
  };

  const insertLink = () => {
    const url = window.prompt('Enter the URL');
    if (!url) return;
    exec('createLink', url);
  };

  const insertImage = () => {
    const url = window.prompt('Enter the image URL');
    if (!url) return;
    exec('insertImage', url);
  };

  const toolbar: EditorButton[] = [
    { label: 'Paragraph', icon: Type, action: () => exec('formatBlock', 'p') },
    { label: 'H1', icon: Heading1, action: () => exec('formatBlock', 'h1') },
    { label: 'H2', icon: Heading2, action: () => exec('formatBlock', 'h2') },
    { label: 'Quote', icon: Quote, action: () => exec('formatBlock', 'blockquote') },
    { label: 'Bullets', icon: List, action: () => exec('insertUnorderedList') },
    { label: 'Numbers', icon: ListOrdered, action: () => exec('insertOrderedList') },
    { label: 'Link', icon: Link2, action: insertLink },
    { label: 'Image', icon: ImageIcon, action: insertImage },
    { label: 'Undo', icon: Undo2, action: () => exec('undo') },
  ];

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const url = editingId ? `${API_URL}/admin/blogs/${editingId}` : `${API_URL}/admin/blogs`;
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, slug, excerpt, content, coverImageUrl, isPublished }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save blog post.');

      setSuccess(editingId ? 'Blog post updated successfully.' : isPublished ? 'Blog published successfully.' : 'Draft saved successfully.');
      resetForm();
      await loadPosts();
    } catch (err: any) {
      setError(err.message || 'Failed to save blog post.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || '');
    setCoverImageUrl(post.coverImageUrl || '');
    setContent(post.content);
    setIsPublished(post.isPublished);
    setIsPreview(false);
    setTimeout(() => syncEditor(post.content), 0);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete blog post.');
      if (editingId === id) resetForm();
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
          <p className="text-sm text-gray-400 mt-1">Create polished blogs with a better toolbar, preview, and editing support.</p>
        </div>

        {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
        {success && <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">{success}</div>}

        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-6">
          <div className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-black text-white">{editingId ? 'Edit Blog Post' : 'Create Blog Post'}</h2>
              {editingId && (
                <button onClick={resetForm} className="rounded-xl border border-[#2a2a2a] px-4 py-2 text-xs font-bold text-white hover:border-sats-orange-500 hover:text-sats-orange-400">
                  New Post
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blog title" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" />
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="blog-slug" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" />
            </div>

            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short excerpt" className="w-full min-h-24 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" />
            <input value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="Cover image URL" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white w-full" />

            <BlogEditorToolbar buttons={toolbar} isPreview={isPreview} onTogglePreview={() => setIsPreview((prev) => !prev)} />

            {isPreview ? (
              <div className="min-h-[420px] rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-5 text-white prose prose-invert max-w-none overflow-auto" dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
                className="min-h-[420px] rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-5 text-white focus:outline-none overflow-auto"
              />
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="inline-flex items-center gap-3 text-sm text-gray-300">
                <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-4 w-4 rounded border-[#2a2a2a] bg-[#0a0a0a]" />
                Publish immediately
              </label>
              <button onClick={handleSave} disabled={isSaving} className="inline-flex items-center gap-2 rounded-xl bg-sats-orange-500 px-5 py-3 font-black text-black disabled:opacity-50">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : isPublished ? <Send className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {editingId ? 'Update Post' : isPublished ? 'Publish Blog' : 'Save Draft'}
              </button>
            </div>
          </div>

          <BlogPostList posts={posts} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
