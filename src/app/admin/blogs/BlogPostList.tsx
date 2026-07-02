'use client';

import React from 'react';
import { BookOpen, Pencil, Trash2 } from 'lucide-react';
import type { BlogPost } from '../content/content.types';

export function BlogPostList({
  posts,
  isLoading,
  onEdit,
  onDelete,
}: {
  posts: BlogPost[];
  isLoading: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-sats-orange-500" />
        <h2 className="text-xl font-black text-white">Existing Posts</h2>
      </div>
      <div className="space-y-3 overflow-y-scroll max-h-[115dvh]">
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
                  <p className="text-xs text-gray-400 mt-1">/{post.slug}</p>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${post.isPublished ? 'bg-green-500/10 text-green-300' : 'bg-yellow-500/10 text-yellow-300'}`}>
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              {post.excerpt && <p className="text-xs text-gray-400 mt-3">{post.excerpt}</p>}
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[12px] text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => onEdit(post)} className="inline-flex items-center gap-2 rounded-lg border border-sats-orange-500/20 bg-sats-orange-500/10 px-3 py-2 text-xs font-bold text-sats-orange-300 hover:bg-sats-orange-500/20">
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button type="button" onClick={() => onDelete(post.id)} className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/20">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
