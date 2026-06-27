'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Heading1, Heading2, ImageIcon, Link2, List, ListOrdered, Loader2, Quote, Save, Send, Type, Undo2 } from 'lucide-react';
import { EMPTY_BLOG_HTML, slugify } from '../content/content.helpers';
import type { BlogPost, EditorButton } from '../content/content.types';
import { BlogEditorToolbar } from './BlogEditorToolbar';
import { BlogPostList } from './BlogPostList';
import { deleteAdminBlog, fetchAdminBlogs, saveAdminBlog } from '@/features/admin/adminBlogsSlice';

const BLOG_TITLE_MIN = 5;
const BLOG_TITLE_MAX = 120;
const BLOG_SLUG_MIN = 3;
const BLOG_SLUG_MAX = 150;
const BLOG_EXCERPT_MAX = 280;

export default function AdminBlogsPage() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [content, setContent] = useState(EMPTY_BLOG_HTML);
  const [isPublished, setIsPublished] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { posts, isLoading, isSaving, error } = useAppSelector((state) => state.adminBlogs);

  const plainContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const validateBlogForm = () => {
    const trimmedTitle = title.trim();
    const trimmedSlug = slug.trim();
    const trimmedExcerpt = excerpt.trim();
    const trimmedCoverImageUrl = coverImageUrl.trim();

    if (trimmedTitle.length < BLOG_TITLE_MIN) {
      return `Title must be at least ${BLOG_TITLE_MIN} characters.`;
    }

    if (trimmedTitle.length > BLOG_TITLE_MAX) {
      return `Title must be ${BLOG_TITLE_MAX} characters or less.`;
    }

    if (trimmedSlug.length < BLOG_SLUG_MIN) {
      return `Slug must be at least ${BLOG_SLUG_MIN} characters.`;
    }

    if (trimmedSlug.length > BLOG_SLUG_MAX) {
      return `Slug must be ${BLOG_SLUG_MAX} characters or less.`;
    }

    if (slugify(trimmedSlug) !== trimmedSlug) {
      return 'Slug should contain only lowercase letters, numbers, and hyphens.';
    }

    if (trimmedExcerpt.length > BLOG_EXCERPT_MAX) {
      return `Excerpt must be ${BLOG_EXCERPT_MAX} characters or less.`;
    }

    if (plainContent.length < 20) {
      return 'Blog content must be at least 20 characters.';
    }

    if (trimmedCoverImageUrl) {
      try {
        const parsedUrl = new URL(trimmedCoverImageUrl);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          return 'Cover image URL must start with http or https.';
        }
      } catch {
        return 'Please enter a valid cover image URL.';
      }
    }

    return null;
  };

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

  useEffect(() => {
    dispatch(fetchAdminBlogs());
  }, [dispatch]);

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
    setLocalError(null);
    setSuccess(null);

    const validationError = validateBlogForm();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      await dispatch(saveAdminBlog({
        id: editingId,
        data: {
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          content,
          coverImageUrl: coverImageUrl.trim(),
          isPublished,
        },
      })).unwrap();

      setSuccess(editingId ? 'Blog post updated successfully.' : isPublished ? 'Blog published successfully.' : 'Draft saved successfully.');
      resetForm();
    } catch (err: any) {
      setLocalError(err.message || 'Failed to save blog post.');
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
      await dispatch(deleteAdminBlog(id)).unwrap();
      if (editingId === id) resetForm();
    } catch (err: any) {
      setLocalError(err.message || 'Failed to delete blog post.');
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white">Blog Editor</h1>
          <p className="text-sm text-gray-400 mt-1">Create polished blogs with a better toolbar, preview, and editing support.</p>
        </div>

        {(localError || error) && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{localError || error}</div>}
        {success && <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">{success}</div>}

        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-6">
          <div className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-black text-white">{editingId ? 'Edit Blog Post' : 'Create Blog Post'}</h2>
              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-xl border border-[#2a2a2a] px-4 py-2 text-xs font-bold text-white hover:border-sats-orange-500 hover:text-sats-orange-400">
                  New Post
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <input value={title} maxLength={BLOG_TITLE_MAX} onChange={(e) => setTitle(e.target.value)} placeholder="Blog title" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white w-full" />
                <p className="text-[11px] text-gray-400">{title.trim().length}/{BLOG_TITLE_MAX} characters</p>
              </div>
              <div className="space-y-2">
                <input value={slug} maxLength={BLOG_SLUG_MAX} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="blog-slug" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white w-full lowercase" />
                <p className="text-[11px] text-gray-400">Use lowercase letters, numbers, and hyphens only.</p>
              </div>
            </div>

            <div className="space-y-2">
              <textarea value={excerpt} maxLength={BLOG_EXCERPT_MAX} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short excerpt" className="w-full min-h-24 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white" />
              <p className="text-[11px] text-gray-400">Optional excerpt · {excerpt.trim().length}/{BLOG_EXCERPT_MAX} characters</p>
            </div>
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
              <button type="button" onClick={handleSave} disabled={isSaving} className="inline-flex items-center gap-2 rounded-xl bg-sats-orange-500 px-5 py-3 font-black text-black disabled:opacity-50">
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
