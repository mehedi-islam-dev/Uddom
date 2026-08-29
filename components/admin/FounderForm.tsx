'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Save, Loader2, Upload, ImageOff, X } from 'lucide-react';
import { FounderData } from '@/lib/types';

interface FounderFormProps {
  initial?: Partial<FounderData>;
  onSuccess: (founder: FounderData) => void;
  onCancel: () => void;
  mode: 'add' | 'edit';
}

const EMPTY: Partial<FounderData> = {
  nameEn: '',
  nameBn: '',
  bioEn: '',
  bioBn: '',
  messageEn: '',
  messageBn: '',
  photoUrl: '',
  order: 0,
};

/** ImgBB te chobi upload korar function */
async function uploadToImgBB(file: File): Promise<string> {
  const form = new FormData();
  form.append('image', file);

  // YOUR_IMGBB_API_KEY er jaygay ImgBB theke pawa apnar API key din
  const res = await fetch(`https://api.imgbb.com/1/upload?key=ef0b7a853f62d4c531024ccc09c81fe6`, {
    method: 'POST',
    body: form,
  });

  const json = await res.json();

  if (json.success) {
    return json.data.url;
  } else {
    throw new Error(json.error?.message || 'Image upload failed to ImgBB.');
  }
}

export default function FounderForm({ initial, onSuccess, onCancel, mode }: FounderFormProps) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [data, setData] = useState<Partial<FounderData>>({ ...EMPTY, ...initial });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setData({ ...EMPTY, ...initial });
  }, [initial]);

  const set = (field: keyof FounderData, value: string | number) =>
    setData((prev) => ({ ...prev, [field]: value }));

  /** Handle file selection → upload ImgBB → set photoUrl */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image must be smaller than 10 MB.');
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
    try {
      const url = mode === 'edit' ? `/api/founder/${initial!._id}` : '/api/founder';
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
      const founder = await res.json();
      if (mode === 'add') {
        setData({ ...EMPTY });
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
      router.refresh();
      onSuccess(founder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const textFields: { key: keyof FounderData; label: string; multiline?: boolean; type?: string; half?: boolean }[] = [
    { key: 'nameEn', label: t('founder_name_en'), half: true },
    { key: 'nameBn', label: t('founder_name_bn'), half: true },
    { key: 'bioEn', label: t('founder_bio_en'), multiline: true },
    { key: 'bioBn', label: t('founder_bio_bn'), multiline: true },
    { key: 'messageEn', label: t('founder_message_en'), multiline: true },
    { key: 'messageBn', label: t('founder_message_bn'), multiline: true },
    { key: 'order', label: 'Order', type: 'number', half: true },
  ];

  const inputClass =
    'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'add' ? 'Add Founder' : 'Edit Founder'}
          </h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Photo Upload Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">{t('founder_photo')}</label>
            
            {/* Preview Image */}
            {data.photoUrl && (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <img
                  src={data.photoUrl}
                  alt="Founder preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => set('photoUrl', '')}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-500 transition-colors"
                  title="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Standard File Upload Button */}
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
                className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed text-sm font-medium cursor-pointer transition-all duration-200 ${
                  uploading
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-400 cursor-not-allowed'
                    : 'border-indigo-200 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300'
                }`}
              >
                {uploading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading to ImgBB…</>
                ) : (
                  <><Upload className="w-4 h-4" /> Click to Browse Image</>
                )}
              </label>
            </div>

            {uploadError && (
              <p className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                <ImageOff className="w-3.5 h-3.5 shrink-0" />
                {uploadError}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {textFields.map(({ key, label, multiline, type, half }) => (
              <div key={key} className={half ? '' : 'sm:col-span-2'}>
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
                    type={type || 'text'}
                    value={data[key] as string}
                    onChange={(e) => set(key, type === 'number' ? +e.target.value : e.target.value)}
                    className={inputClass}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}