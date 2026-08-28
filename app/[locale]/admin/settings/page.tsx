'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Settings, Loader2 } from 'lucide-react';
import SettingsForm from '@/components/admin/SettingsForm';
import { SiteSettingsData } from '@/lib/types';

export default function SiteSettingsPage() {
  const t = useTranslations('admin');
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => { setSettings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">{t('site_settings')}</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Update global site information used throughout the website and SEO metadata.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : settings ? (
          <SettingsForm initial={settings} onSuccess={setSettings} />
        ) : (
          <p className="text-red-500 text-sm">Failed to load settings.</p>
        )}
      </div>
    </div>
  );
}
