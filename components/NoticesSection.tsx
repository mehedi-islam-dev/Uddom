import { useTranslations, useLocale } from 'next-intl';
import { Bell, Calendar } from 'lucide-react';
import { NoticeData } from '@/lib/types';

interface NoticesSectionProps {
  notices: NoticeData[];
}

export default function NoticesSection({ notices }: NoticesSectionProps) {
  const t = useTranslations('notices');
  const locale = useLocale();

  return (
    <section id="notices" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-100 rounded-2xl mb-5">
            <Bell className="w-7 h-7 text-amber-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Notice List */}
        {notices.length > 0 ? (
          <div className="space-y-4">
            {notices.map((notice, idx) => {
              const title = locale === 'bn' ? notice.titleBn : notice.titleEn;
              const description =
                locale === 'bn' ? notice.descriptionBn : notice.descriptionEn;
              const formattedDate = notice.date
                ? new Date(notice.date).toLocaleDateString(
                    locale === 'bn' ? 'bn-BD' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )
                : '';

              return (
                <div
                  key={notice._id}
                  className="group flex gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  {/* Date badge */}
                  <div className="shrink-0 w-12 h-12 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-amber-700 transition-colors">
                      {title}
                    </h3>
                    {description && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                        {description}
                      </p>
                    )}
                    {formattedDate && (
                      <p className="text-xs text-amber-600 font-medium mt-2">
                        {t('posted_on')}: {formattedDate}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">{t('no_notices')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
