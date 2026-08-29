'use client';

import { useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { SuccessStoryData } from '@/lib/types';

interface SuccessStoriesSectionProps {
  stories: SuccessStoryData[];
}

export default function SuccessStoriesSection({ stories }: SuccessStoriesSectionProps) {
  const t = useTranslations('successStories');
  const locale = useLocale();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <section id="success-stories" className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-14 relative">
          <div className="max-w-2xl">
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

          {/* Controls */}
          {stories.length > 0 && (
            <div className="flex items-center justify-center gap-3 shrink-0 mt-8 md:absolute md:right-0 md:bottom-0 md:mt-0">
              <button
                onClick={scrollLeft}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-colors shadow-sm"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={scrollRight}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-colors shadow-sm"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Stories Horizontal Slider */}
        {stories.length > 0 ? (
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-6 hide-scrollbar pb-8 pt-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {stories.map((story) => {
                const name =
                  locale === 'bn' ? story.studentNameBn : story.studentNameEn;
                const achievement =
                  locale === 'bn' ? story.achievementBn : story.achievementEn;

                return (
                  <div
                    key={story._id}
                    className="min-w-[280px] md:min-w-[350px] snap-center shrink-0 group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Photo */}
                    <div className="flex items-center gap-4 mb-4">
                      {story.imageUrl ? (
                        <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-white shadow-sm shrink-0">
                          <Image
                            src={story.imageUrl}
                            alt={name}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-emerald-200 flex items-center justify-center shrink-0 ring-2 ring-white shadow-sm">
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

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
