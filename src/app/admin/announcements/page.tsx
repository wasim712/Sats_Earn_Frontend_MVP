'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllAnnouncements, toggleAnnouncementStatus, deleteAnnouncement, Announcement } from '@/features/admin/adminAnnouncementsSlice';
import { AnnouncementCard } from '@/components/admin/AnnouncementCard';
import { EditAnnouncementModal } from '@/components/admin/EditAnnouncementModal'; // <-- Implemented the Modal!
import { Plus, Loader2, AlertCircle, Megaphone } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const dispatch = useAppDispatch();
  const { announcements, isLoading, error } = useAppSelector((state) => state.adminAnnouncements);

  // State to track which announcement is currently being edited
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    dispatch(fetchAllAnnouncements());
  }, [dispatch]);

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    dispatch(toggleAnnouncementStatus({ id, isActive: !currentStatus }));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteAnnouncement(id));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Edit Modal: Only renders when editingAnnouncement exists! */}
      {editingAnnouncement && (
        <EditAnnouncementModal 
          isOpen={true} 
          announcement={editingAnnouncement} 
          onClose={() => setEditingAnnouncement(null)} 
        />
      )}
      {/* Edit Modal (Hidden until triggered by clicking Edit on a card)
      <EditAnnouncementModal 
        isOpen={!!editingAnnouncement} 
        announcement={editingAnnouncement} 
        onClose={() => setEditingAnnouncement(null)} 
      /> */}
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-sats-orange-500" />
            Announcements
          </h1>
          <p className="text-gray-400 mt-2">Broadcast messages, promotions, and updates to all users.</p>
        </div>
        
        <Link 
          href="/admin/addannouncement"
          className="flex items-center justify-center gap-2 bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-bold py-3 px-6 rounded-xl transition-colors shadow-[0_0_20px_rgba(249,115,22,0.2)]"
        >
          <Plus className="w-5 h-5" />
          Create Announcement
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && announcements.length === 0 ? (
        <div className="h-[40vh] flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-sats-orange-500 animate-spin mb-4" />
          <p className="text-gray-400 font-medium">Loading broadcasts...</p>
        </div>
      ) : (
        /* Announcements Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <AnnouncementCard 
                key={announcement.id || `fallback-${index}`} // Safe fallback key
                announcement={announcement} 
                onDelete={handleDelete}
                onToggleActive={handleToggleStatus}
                onEdit={setEditingAnnouncement} // Passes the announcement to the modal state!
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-sats-black-800 rounded-3xl bg-sats-black-900/50">
              <Megaphone className="w-10 h-10 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 font-medium text-lg">No announcements found.</p>
              <p className="text-gray-500 text-sm mt-1">Create one to notify your users!</p>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
}