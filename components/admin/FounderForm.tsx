'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Save, Loader2, CheckCircle, Upload, ImageOff, X } from 'lucide-react';
import Image from 'next/image';
import { FounderData } from '@/lib/types';

interface FounderFormProps {
  initial: FounderData;
  onSuccess: (founder: FounderData) => void;
}

/** Upload a File to ImgBB and return the direct image URL */
async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) throw new Error('ImgBB API key not configured.');

  const form = new FormData();
  form.append('image', file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Image upload failed.');
  }

  const json = await res.json();
  return json.data.display_url as string;
}

export default function FounderForm({ initial, onSuccess }: FounderFormProps) {
  const t = useTranslations('admin');
  const [data, setData] = useState<FounderData>(initial);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FounderData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  /** Handle file selection → upload to ImgBB → set photoUrl */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be smaller than 5 MB.');
      return;
    }

    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadToImgBB(file);
      set('photoUrl', url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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

  const textFields: { key: keyof FounderData; label: string; multiline?: boolean }[] = [
    { key: 'nameEn', label: t('founder_name_en') },
    { key: 'nameBn', label: t('founder_name_bn') },
    { key: 'bioEn', label: t('founder_bio_en'), multiline: true },
    { key: 'bioBn', label: t('founder_bio_bn'), multiline: true },
    { key: 'messageEn', label: t('founder_message_en'), multiline: true },
    { key: 'messageBn', label: t('founder_message_bn'), multiline: true },
  ];

  const inputClass =
    'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ── Photo Upload ── */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">{t('founder_photo')}</label>

        {/* Photo preview */}
        {data.photoUrl && (
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <Image
              src={data.photoUrl}
              alt="Founder preview"
              fill
              className="object-cover"
              sizes="112px"
            />
            {/* Remove button */}
            <button
              type="button"
              onClick={() => set('photoUrl', '')}
              className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-500 transition-colors"
              title="Remove photo"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* File upload button + URL fallback */}
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="founder-photo-upload"
            disabled={uploading}
          />
          <label
            htmlFor="founder-photo-upload"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all duration-200 shrink-0 ${
              uploading
                ? 'border-indigo-200 bg-indigo-50 text-indigo-400 cursor-not-allowed'
                : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300'
            }`}
          >
            {uploading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
            ) : (
              <><Upload className="w-4 h-4" /> Upload Photo</>
            )}
          </label>

          {/* Manual URL fallback — shown when no photo selected yet */}
          {!data.photoUrl && !uploading && (
            <input
              type="url"
              placeholder="…or paste image URL"
              value={data.photoUrl}
              onChange={(e) => set('photoUrl', e.target.value)}
              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          )}
        </div>

        {uploadError && (
          <p className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <ImageOff className="w-3.5 h-3.5 shrink-0" />
            {uploadError}
          </p>
        )}
      </div>

      {/* Text / textarea fields */}
      {textFields.map(({ key, label, multiline }) => (
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
        disabled={loading || uploading}
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
