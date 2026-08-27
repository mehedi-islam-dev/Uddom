'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import { SiteSettingsData } from '@/lib/types';

interface SettingsFormProps {
  initial: SiteSettingsData;
  onSuccess: (settings: SiteSettingsData) => void;
}

export default function SettingsForm({ initial, onSuccess }: SettingsFormProps) {
  const t = useTranslations('admin');
  const [data, setData] = useState<SiteSettingsData>(initial);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof SiteSettingsData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/settings', {
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

  const fields: { key: keyof SiteSettingsData; label: string; type?: string; multiline?: boolean }[] = [
    { key: 'coachingName', label: t('settings_name') },
    { key: 'logoUrl', label: t('settings_logo') },
    { key: 'address', label: t('settings_address'), multiline: true },
    { key: 'phone', label: t('settings_phone') },
    { key: 'email', label: t('settings_email'), type: 'email' },
    { key: 'mapEmbedUrl', label: t('settings_map') },
    { key: 'metaTitle', label: t('settings_meta_title') },
    { key: 'metaDescription', label: t('settings_meta_desc'), multiline: true },
  ];

  const inputClass =
    'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {fields.map(({ key, label, type, multiline }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor={`setting-${key}`}>
            {label}
          </label>
          {multiline ? (
            <textarea
              id={`setting-${key}`}
              rows={3}
              value={(data[key] as string) || ''}
              onChange={(e) => set(key, e.target.value)}
              className={`${inputClass} resize-none`}
            />
          ) : (
            <input
              id={`setting-${key}`}
              type={type || 'text'}
              value={(data[key] as string) || ''}
              onChange={(e) => set(key, e.target.value)}
              className={inputClass}
            />
          )}
        </div>
      ))}

      {/* Map Preview */}
      {data.mapEmbedUrl && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1.5">Map Preview</p>
          <div className="h-48 rounded-xl overflow-hidden border border-gray-200">
            <iframe
              src={data.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map preview"
            />
          </div>
        </div>
      )}

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
