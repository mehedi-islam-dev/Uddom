'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, Save, Loader2 } from 'lucide-react';
import { StudentProfileData } from '@/lib/types';

interface StudentProfileFormProps {
  initial?: Partial<StudentProfileData>;
  mode: 'add' | 'edit';
  onSuccess: (student: StudentProfileData) => void;
  onCancel: () => void;
}

const EMPTY = {
  nameEn: '',
  nameBn: '',
  batchEn: '',
  batchBn: '',
  rollNumber: '',
  imageUrl: '',
};

export default function StudentProfileForm({ initial, mode, onSuccess, onCancel }: StudentProfileFormProps) {
  const t = useTranslations('admin');
  const [data, setData] = useState({ ...EMPTY, ...initial });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setData({ ...EMPTY, ...initial });
  }, [initial]);

  const set = (field: string, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = mode === 'edit' ? `/api/students/${initial!._id}` : '/api/students';
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || 'Failed');
      }
      const student = await res.json();
      onSuccess(student);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fields: { key: string; label: string; half?: boolean }[] = [
    { key: 'nameEn', label: t('student_name_en'), half: true },
    { key: 'nameBn', label: t('student_name_bn'), half: true },
    { key: 'batchEn', label: t('student_batch_en'), half: true },
    { key: 'batchBn', label: t('student_batch_bn'), half: true },
    { key: 'rollNumber', label: t('student_roll'), half: true },
    { key: 'imageUrl', label: t('student_photo'), half: true },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'add' ? t('add_student') : t('edit_student')}
          </h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ key, label, half }) => (
              <div key={key} className={half ? '' : 'sm:col-span-2'}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor={`student-${key}`}>
                  {label}
                </label>
                <input
                  id={`student-${key}`}
                  type="text"
                  value={data[key as keyof typeof data]}
                  onChange={(e) => set(key, e.target.value)}
                  required={key !== 'imageUrl'}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
