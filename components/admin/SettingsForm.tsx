'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Save, Loader2, CheckCircle, UploadCloud } from 'lucide-react';
import { SiteSettingsData } from '@/lib/types';

interface SettingsFormProps {
  initial: SiteSettingsData;
  onSuccess: (settings: SiteSettingsData) => void;
}

export default function SettingsForm({ initial, onSuccess }: SettingsFormProps) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [data, setData] = useState<SiteSettingsData>(initial);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // ImgBB Upload er jonno notun state
  const [uploadingImage, setUploadingImage] = useState(false);

  const set = (field: keyof SiteSettingsData, value: string | boolean) =>
    setData((prev) => ({ ...prev, [field]: value }));

  // ImgBB te chobi upload korar function
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      // YOUR_IMGBB_API_KEY er jaygay apnar asol ImgBB API key dite hobe
      const res = await fetch(`https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY`, {
        method: 'POST',
        body: formData,
      });

      const imgData = await res.json();

      if (imgData.success) {
        // Upload successful hole ImgBB theke pawa link state-e save hobe
        set('logoUrl', imgData.data.url);
      } else {
        setError('Image upload failed to ImgBB.');
      }
    } catch (err) {
      setError('Error uploading image. Please check your connection.');
    } finally {
      setUploadingImage(false);
    }
  };

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
      router.refresh();
      onSuccess(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

  const renderInput = (key: keyof SiteSettingsData, label: string, type: string = 'text', multiline: boolean = false) => (
    <div key={key as string}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor={`setting-${key as string}`}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={`setting-${key as string}`}
          rows={3}
          value={(data[key] as string) || ''}
          onChange={(e) => set(key, e.target.value)}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          id={`setting-${key as string}`}
          type={type}
          value={(data[key] as string) || ''}
          onChange={(e) => set(key, e.target.value)}
          className={inputClass}
        />
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-10">

      {/* 1. General Settings */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">General Settings</h3>
        {renderInput('coachingName', t('settings_name'))}

        {/* Custom Image Upload Field for Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('settings_logo')} (Upload Image)
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors">
              {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              <span className="text-sm font-medium">{uploadingImage ? 'Uploading...' : 'Choose File'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
            </label>
            {data.logoUrl && (
              <img src={data.logoUrl} alt="Logo Preview" className="h-10 w-auto rounded border" />
            )}
          </div>
          {/* Hidden input to keep track of the url for submission if needed */}
          <input type="hidden" value={data.logoUrl || ''} />
        </div>

        {renderInput('address', t('settings_address'), 'text', true)}
        {renderInput('phone', t('settings_phone'))}
        {renderInput('email', t('settings_email'), 'email')}
        {renderInput('mapEmbedUrl', t('settings_map'))}
        {renderInput('metaTitle', t('settings_meta_title'))}
        {renderInput('metaDescription', t('settings_meta_desc'), 'text', true)}
      </div>

      {/* 2. Hero Section Stats */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Hero Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {renderInput('totalStudents', 'Total Students (e.g. 200+)')}
          {renderInput('totalTeachers', 'Total Teachers (e.g. 25+)')}
          {renderInput('totalYears', 'Total Years (e.g. 12+)')}
        </div>
      </div>

      {/* 3. Hero Content */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Hero Content</h3>
        {renderInput('heroTitle', 'Main Headline (Title)')}
        {renderInput('heroSubtitle', 'Subheadline (Subtitle)', 'text', true)}
      </div>

      {/* 4. Special Offer Banner */}
      <div className="space-y-5 bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
        <h3 className="text-lg font-bold text-indigo-900">Special Offer Banner</h3>

        <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-indigo-200">
          <input
            type="checkbox"
            id="offerActive"
            checked={!!data.isSpecialOfferActive}
            onChange={(e) => set('isSpecialOfferActive', e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
          />
          <label htmlFor="offerActive" className="text-sm font-bold text-indigo-900 cursor-pointer">
            Show Special Offer Banner on Home Page
          </label>
        </div>

        {data.isSpecialOfferActive && (
          <div className="space-y-5 pt-3 animate-in fade-in slide-in-from-top-2 duration-300">
            {renderInput('specialOfferText', 'Offer Text')}
            {renderInput('specialOfferLink', 'Offer Link (e.g. /admission)')}
          </div>
        )}
      </div>

      {/* Map Preview */}
      {data.mapEmbedUrl && (
        <div className="mt-8">
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

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || uploadingImage}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-60 w-full sm:w-auto mt-8"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : saved ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <Save className="w-5 h-5" />
        )}
        {saved ? 'Settings Saved Successfully!' : t('save')}
      </button>
    </form>
  );
}