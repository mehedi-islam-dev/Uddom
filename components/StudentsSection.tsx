'use client';

import { useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { StudentProfileData } from '@/lib/types';

interface StudentsSectionProps {
  students: StudentProfileData[];
}

export default function StudentsSection({ students }: StudentsSectionProps) {
  const t = useTranslations('students');
  const locale = useLocale();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  return (
    <section id="students" className="py-20 lg:py-28 bg-indigo-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-14 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-800 rounded-2xl mb-5">
              <Users className="w-7 h-7 text-indigo-300" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              {t('title')}
            </h2>
            <p className="text-indigo-300 text-base sm:text-lg leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          {/* Controls */}
          {students.length > 0 && (
            <div className="flex items-center justify-center gap-3 shrink-0 mt-8 md:absolute md:right-0 md:bottom-0 md:mt-0">
              <button
                onClick={scrollLeft}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-900 border border-indigo-700 text-indigo-300 hover:text-white hover:border-indigo-400 hover:bg-indigo-800 transition-colors shadow-sm"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={scrollRight}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-900 border border-indigo-700 text-indigo-300 hover:text-white hover:border-indigo-400 hover:bg-indigo-800 transition-colors shadow-sm"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Students Horizontal Slider */}
        {students.length > 0 ? (
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-5 hide-scrollbar pb-8 pt-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {students.map((student) => {
                const name = locale === 'bn' ? student.nameBn : student.nameEn;
                const batch = locale === 'bn' ? student.batchBn : student.batchEn;

                return (
                  <div
                    key={student._id}
                    className="min-w-[220px] md:min-w-[240px] snap-center shrink-0 group flex flex-col items-center text-center p-4 bg-indigo-900/50 backdrop-blur-sm rounded-2xl border border-indigo-800/50 hover:bg-indigo-800/60 hover:border-indigo-600/50 hover:-translate-y-1 transition-all duration-200"
                  >
                    {/* Avatar */}
                    {student.imageUrl ? (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-indigo-700 group-hover:ring-indigo-400 transition-all shrink-0">
                        <Image
                          src={student.imageUrl}
                          alt={name}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-indigo-800 flex items-center justify-center mb-3 ring-2 ring-indigo-700 group-hover:ring-indigo-400 transition-all shrink-0">
                        <Users className="w-7 h-7 text-indigo-400" />
                      </div>
                    )}

                    <h3 className="font-semibold text-white text-sm leading-snug mb-1">
                      {name}
                    </h3>
                    {batch && (
                      <span className="text-xs text-indigo-400">
                        {t('batch')}: {batch}
                      </span>
                    )}
                    {student.rollNumber && (
                      <span className="text-xs text-indigo-500 mt-0.5">
                        {t('roll')}: {student.rollNumber}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-indigo-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-indigo-400">{t('no_students')}</p>
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
