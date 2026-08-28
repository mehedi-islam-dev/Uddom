'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Pencil, Trash2, Bell, Loader2 } from 'lucide-react';
import NoticeForm from '@/components/admin/NoticeForm';
import { NoticeData } from '@/lib/types';

export default function ManageNoticesPage() {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [notices, setNotices] = useState<NoticeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeData | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notices', { cache: 'no-store' });
      if (res.ok) setNotices(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  const handleSuccess = (notice: NoticeData) => {
    setNotices((prev) => {
      const exists = prev.find((n) => n._id === notice._id);
      if (exists) {
        return prev.map((n) => (n._id === notice._id ? notice : n));
      }
      return [notice, ...prev];
    });
    setShowForm(false);
    setEditingNotice(undefined);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirm_delete'))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' });
      if (res.ok) setNotices((prev) => prev.filter((n) => n._id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{t('manage_notices')}</h1>
          <p className="text-gray-500 text-sm mt-1">{notices.length} notices published</p>
        </div>
        <button
          onClick={() => { setEditingNotice(undefined); setShowForm(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          {t('add_notice')}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No notices yet. Add your first notice!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4"
            >
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900 leading-tight">{notice.titleEn}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{notice.titleBn}</p>
                  </div>
                  <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full shrink-0">
                    {new Date(notice.date).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{notice.descriptionEn}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => { setEditingNotice(notice); setShowForm(true); }}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title={tCommon('edit')}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(notice._id)}
                  disabled={deletingId === notice._id}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title={tCommon('delete')}
                >
                  {deletingId === notice._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <NoticeForm
          initial={editingNotice}
          mode={editingNotice ? 'edit' : 'add'}
          onSuccess={handleSuccess}
          onCancel={() => { setShowForm(false); setEditingNotice(undefined); }}
        />
      )}
    </div>
  );
}
