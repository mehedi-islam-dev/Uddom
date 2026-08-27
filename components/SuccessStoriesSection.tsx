import { useTranslations, useLocale } from 'next-intl';
import { Trophy } from 'lucide-react';
import { SuccessStoryData } from '@/lib/types';

interface SuccessStoriesSectionProps {
  stories: SuccessStoryData[];
}

export default function SuccessStoriesSection({ stories }: SuccessStoriesSectionProps) {
  const t = useTranslations('successStories');
  const locale = useLocale();

  return (
    <section id="success-stories" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-2xl mb-5">
            <Trophy className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Stories Grid */}
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {stories.map((story) => {
              const name =
                locale === 'bn' ? story.studentNameBn : story.studentNameEn;
              const achievement =
                locale === 'bn' ? story.achievementBn : story.achievementEn;

              return (
                <div
                  key={story._id}
                  className="group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Photo */}
                  <div className="flex items-center gap-4 mb-4">
                    {story.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={story.imageUrl}
                        alt={name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-emerald-200 flex items-center justify-center shrink-0">
                        <Trophy className="w-6 h-6 text-emerald-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                        {name}
                      </h3>
                    </div>
                  </div>

                  {/* Achievement */}
                  <p className="text-gray-600 text-sm leading-relaxed border-t border-emerald-100/60 pt-4">
                    {achievement}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">{t('no_stories')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
