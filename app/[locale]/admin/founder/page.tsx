'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { UserCircle, Loader2 } from 'lucide-react';
import FounderForm from '@/components/admin/FounderForm';
import { FounderData } from '@/lib/types';

export default function ManageFounderPage() {
  const t = useTranslations('admin');
  const [founder, setFounder] = useState<FounderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/founder', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => { setFounder(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">{t('manage_founder')}</h1>
        </div>
        <p className="text-gray-500 text-sm ml-13">
          Update the founder's profile information displayed on the homepage.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : founder ? (
          <FounderForm initial={founder} onSuccess={setFounder} />
        ) : (
          <p className="text-red-500 text-sm">Failed to load founder data.</p>
        )}
      </div>
    </div>
  );
}
