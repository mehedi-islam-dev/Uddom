'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Pencil, Trash2, UserCircle, Loader2 } from 'lucide-react';
import FounderForm from '@/components/admin/FounderForm';
import Image from 'next/image';
import { FounderData } from '@/lib/types';

export default function ManageFounderPage() {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [founders, setFounders] = useState<FounderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFounder, setEditingFounder] = useState<FounderData | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchFounders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/founder', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setFounders(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFounders();
  }, [fetchFounders]);

  const handleSuccess = (founder: FounderData) => {
    setFounders((prev) => {
      const exists = prev.find((f) => f._id === founder._id);
      if (exists) {
        return prev.map((f) => (f._id === founder._id ? founder : f));
      }
      return [...prev, founder];
    });
    setShowForm(false);
    setEditingFounder(undefined);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirm_delete'))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/founder/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFounders((prev) => prev.filter((f) => f._id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{t('manage_founder')}</h1>
          <p className="text-gray-500 text-sm mt-1">{founders.length} founders registered</p>
        </div>
        <button
          onClick={() => { setEditingFounder(undefined); setShowForm(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Founder
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : founders.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No founders yet. Add your first founder!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Founder</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 hidden lg:table-cell">Bio Snippet</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600">{tCommon('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {founders.map((founder) => (
                <tr key={founder._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-violet-100 shrink-0">
                        {founder.photoUrl ? (
                          <Image
                            src={founder.photoUrl}
                            alt={founder.nameEn}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                            {founder.nameEn.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 leading-tight">{founder.nameEn}</p>
                        <p className="text-gray-400 text-xs">{founder.nameBn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 hidden lg:table-cell">
                    <p className="truncate max-w-xs">{founder.bioEn}</p>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingFounder(founder); setShowForm(true); }}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title={tCommon('edit')}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(founder._id!)}
                        disabled={deletingId === founder._id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title={tCommon('delete')}
                      >
                        {deletingId === founder._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <FounderForm
          initial={editingFounder}
          mode={editingFounder ? 'edit' : 'add'}
          onSuccess={handleSuccess}
          onCancel={() => { setShowForm(false); setEditingFounder(undefined); }}
        />
      )}
    </div>
  );
}
