'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Pencil, Trash2, Trophy, Loader2 } from 'lucide-react';
import Image from 'next/image';
import SuccessStoryForm from '@/components/admin/SuccessStoryForm';
import { SuccessStoryData } from '@/lib/types';

export default function ManageSuccessStoriesPage() {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [stories, setStories] = useState<SuccessStoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStoryData | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/success-stories');
      if (res.ok) setStories(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStories(); }, [fetchStories]);

  const handleSuccess = (story: SuccessStoryData) => {
    setStories((prev) => {
      const exists = prev.find((s) => s._id === story._id);
      if (exists) {
        return prev.map((s) => (s._id === story._id ? story : s));
      }
      return [story, ...prev];
    });
    setShowForm(false);
    setEditingStory(undefined);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirm_delete'))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/success-stories/${id}`, { method: 'DELETE' });
      if (res.ok) setStories((prev) => prev.filter((s) => s._id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{t('manage_success_stories')}</h1>
          <p className="text-gray-500 text-sm mt-1">{stories.length} stories published</p>
        </div>
        <button
          onClick={() => { setEditingStory(undefined); setShowForm(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          {t('add_story')}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No success stories yet. Add the first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stories.map((story) => (
            <div
              key={story._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group"
            >
              <div className="relative h-40 bg-gradient-to-br from-indigo-100 to-violet-100">
                {story.imageUrl ? (
                  <Image
                    src={story.imageUrl}
                    alt={story.studentNameEn}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-indigo-300" />
                  </div>
                )}
                {/* Action buttons overlay */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => { setEditingStory(story); setShowForm(true); }}
                    className="p-1.5 bg-white/90 rounded-lg text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
                    title={tCommon('edit')}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(story._id)}
                    disabled={deletingId === story._id}
                    className="p-1.5 bg-white/90 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    title={tCommon('delete')}
                  >
                    {deletingId === story._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="font-bold text-gray-900">{story.studentNameEn}</p>
                <p className="text-gray-400 text-xs mb-2">{story.studentNameBn}</p>
                <p className="text-gray-600 text-sm line-clamp-2">{story.achievementEn}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <SuccessStoryForm
          initial={editingStory}
          mode={editingStory ? 'edit' : 'add'}
          onSuccess={handleSuccess}
          onCancel={() => { setShowForm(false); setEditingStory(undefined); }}
        />
      )}
    </div>
  );
}
