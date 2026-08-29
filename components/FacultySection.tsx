'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import { TeacherData } from '@/lib/types';
import TeacherCard from './TeacherCard';

interface FacultySectionProps {
  teachers: TeacherData[];
}

export default function FacultySection({ teachers }: FacultySectionProps) {
  const t = useTranslations('faculty');
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
    <section id="faculty" className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-14 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-2xl mb-5">
              <GraduationCap className="w-7 h-7 text-indigo-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              {t('title')}
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
          
          {/* Controls */}
          {teachers.length > 0 && (
            <div className="flex items-center justify-center gap-3 shrink-0 mt-8 md:absolute md:right-0 md:bottom-0 md:mt-0">
              <button
                onClick={scrollLeft}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={scrollRight}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Horizontal Slider */}
        {teachers.length > 0 ? (
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-6 hide-scrollbar pb-8 pt-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {teachers.map((teacher) => (
                <div key={teacher._id} className="min-w-[280px] md:min-w-[320px] snap-center shrink-0">
                  <TeacherCard teacher={teacher} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">{t('no_teachers')}</p>
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
