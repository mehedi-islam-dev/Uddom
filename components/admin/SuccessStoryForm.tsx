'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { X, Save, Loader2, Upload, ImageOff } from 'lucide-react';
import Image from 'next/image';
import { SuccessStoryData } from '@/lib/types';

interface SuccessStoryFormProps {
  initial?: Partial<SuccessStoryData>;
  mode: 'add' | 'edit';
  onSuccess: (story: SuccessStoryData) => void;
  onCancel: () => void;
}

const EMPTY = {
  studentNameEn: '',
  studentNameBn: '',
  achievementEn: '',
  achievementBn: '',
  imageUrl: '',
};

/** Upload a File to the local /api/upload endpoint and return the public URL */
async function uploadToLocal(file: File): Promise<string> {
  const form = new FormData();
  form.append('image', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Image upload failed.');
  }

  const json = await res.json();
  return json.url as string;
}

export default function SuccessStoryForm({ initial, mode, onSuccess, onCancel }: SuccessStoryFormProps) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [data, setData] = useState({ ...EMPTY, ...initial });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setData({ ...EMPTY, ...initial });
  }, [initial]);

  const set = (field: string, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setUploadError('Please select a valid image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { setUploadError('Image must be smaller than 10 MB.'); return; }
    setUploading(true); setUploadError('');
    try {
      const url = await uploadToLocal(file);
      set('imageUrl', url);
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
    try {
      const url = mode === 'edit' ? `/api/success-stories/${initial!._id}` : '/api/success-stories';
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
      const result = await res.json();
      if (mode === 'add') {
        setData({ ...EMPTY });
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
      router.refresh();
      onSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'add' ? t('add_story') : t('edit_story')}
          </h2>
          <button onClick={onCancel} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'studentNameEn', label: t('story_name_en'), half: true },
              { key: 'studentNameBn', label: t('story_name_bn'), half: true },
            ].map(({ key, label, half }) => (
              <div key={key} className={half ? '' : 'sm:col-span-2'}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor={`story-${key}`}>{label}</label>
                <input id={`story-${key}`} type="text" value={data[key as keyof typeof data]} onChange={(e) => set(key, e.target.value)} required className={inputClass} />
              </div>
            ))}
            {[
              { key: 'achievementEn', label: t('story_achievement_en') },
              { key: 'achievementBn', label: t('story_achievement_bn') },
            ].map(({ key, label }) => (
              <div key={key} className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor={`story-${key}`}>{label}</label>
                <textarea id={`story-${key}`} rows={3} value={data[key as keyof typeof data]} onChange={(e) => set(key, e.target.value)} required className={`${inputClass} resize-none`} />
              </div>
            ))}
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{t('story_photo')}</label>
            {data.imageUrl && (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <Image
                  src={data.imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized={data.imageUrl.startsWith('/uploads/')}
                />
                <button type="button" onClick={() => set('imageUrl', '')} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="story-image-upload" disabled={uploading} />
              <label htmlFor="story-image-upload" className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all duration-200 ${uploading ? 'border-indigo-200 bg-indigo-50 text-indigo-400 cursor-not-allowed' : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300'}`}>
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4" /> Upload Image</>}
              </label>
              {!data.imageUrl && !uploading && (
                <input type="url" placeholder="…or paste image URL" value={data.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              )}
            </div>
            {uploadError && (
              <p className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                <ImageOff className="w-3.5 h-3.5 shrink-0" />{uploadError}
              </p>
            )}
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">{t('cancel')}</button>
            <button type="submit" disabled={loading || uploading} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
