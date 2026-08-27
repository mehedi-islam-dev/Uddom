'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { FounderData } from '@/lib/types';

interface FounderFormProps {
  initial: FounderData;
  onSuccess: (founder: FounderData) => void;
}

export default function FounderForm({ initial, onSuccess }: FounderFormProps) {
  const t = useTranslations('admin');
  const [data, setData] = useState<FounderData>(initial);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof FounderData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/founder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || 'Failed');
      }
      const updated = await res.json();
      onSuccess(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fields: { key: keyof FounderData; label: string; multiline?: boolean }[] = [
    { key: 'nameEn', label: t('founder_name_en') },
    { key: 'nameBn', label: t('founder_name_bn') },
    { key: 'photoUrl', label: t('founder_photo') },
    { key: 'bioEn', label: t('founder_bio_en'), multiline: true },
    { key: 'bioBn', label: t('founder_bio_bn'), multiline: true },
    { key: 'messageEn', label: t('founder_message_en'), multiline: true },
    { key: 'messageBn', label: t('founder_message_bn'), multiline: true },
  ];

  const inputClass =
    'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Photo Preview */}
      {data.photoUrl && (
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-gray-200">
          <Image src={data.photoUrl} alt="Founder preview" fill className="object-cover" sizes="112px" />
        </div>
      )}

      {fields.map(({ key, label, multiline }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor={`founder-${key}`}>
            {label}
          </label>
          {multiline ? (
            <textarea
              id={`founder-${key}`}
              rows={3}
              value={(data[key] as string) || ''}
              onChange={(e) => set(key, e.target.value)}
              className={`${inputClass} resize-none`}
            />
          ) : (
            <input
              id={`founder-${key}`}
              type="text"
              value={(data[key] as string) || ''}
              onChange={(e) => set(key, e.target.value)}
              className={inputClass}
            />
          )}
        </div>
      ))}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-60 w-full sm:w-auto"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : saved ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {saved ? 'Saved!' : t('save')}
      </button>
    </form>
  );
}
