'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckSquare, Plus, ShieldAlert } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStandaloneTasks } from '@/features/admin/adminTasksSlice';

export default function AdminStandaloneTasksPage() {
  const dispatch = useAppDispatch();
  const { tasks, isLoading, error } = useAppSelector((state) => state.adminTasks);

  useEffect(() => {
    dispatch(fetchStandaloneTasks());
  }, [dispatch]);

  if (isLoading) return <div className="min-h-screen bg-sats-black-950 p-8 text-white">Loading standalone tasks...</div>;
  if (error) return <div className="min-h-screen bg-sats-black-950 p-8 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-sats-black-950 p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 mt-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Standalone Tasks</h1>
            <p className="text-gray-400 text-sm mt-1">Manage one-off tasks from dedicated task pages.</p>
          </div>
          <Link href="/admin/addtask" className="flex items-center justify-center gap-2 bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-black py-3.5 px-6 rounded-xl transition-all shrink-0">
            <Plus className="w-5 h-5" /> Create Standalone Task
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {tasks.length > 0 ? tasks.map((task) => (
            <div key={task.id} className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-black">{task.title}</div>
                  <div className="mt-2 text-sm text-gray-400 line-clamp-3">{task.description}</div>
                </div>
                <CheckSquare className="w-5 h-5 text-sats-orange-400" />
              </div>
              <div className="mt-4 text-xs text-gray-500">Campaign ID: {task.campaignId}</div>
              <div className="mt-5 flex gap-3">
                <Link href={`/admin/tasks/${task.id}`} className="rounded-xl border border-[#2a2a2a] px-4 py-2 text-sm font-bold text-white hover:bg-white/5">View</Link>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center border border-dashed border-sats-black-800 rounded-3xl bg-sats-black-900">
              <ShieldAlert className="w-12 h-12 text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Standalone Tasks</h3>
              <p className="text-gray-500 text-sm max-w-md">Create standalone tasks from the dedicated task flow.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
