'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { FounderData } from '@/lib/types';

interface FounderSectionProps {
  founders: FounderData[];
}

export default function FounderSection({ founders }: FounderSectionProps) {
  const t = useTranslations('founder');
  const locale = useLocale();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  // If no founders exist, don't render the section
  if (!founders || founders.length === 0) {
    return null;
  }

  const founder = founders[currentIndex];
  const name = locale === 'bn' ? founder.nameBn : founder.nameEn;
  const bio = locale === 'bn' ? founder.bioBn : founder.bioEn;
  const message = locale === 'bn' ? founder.messageBn : founder.messageEn;

  const showImage = !!founder.photoUrl && !imgError;

  const nextFounder = () => {
    setImgError(false);
    setCurrentIndex((prev) => (prev + 1) % founders.length);
  };

  const prevFounder = () => {
    setImgError(false);
    setCurrentIndex((prev) => (prev - 1 + founders.length) % founders.length);
  };

  return (
    <section id="founder" className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-12 justify-center">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-indigo-300" />
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">
            {t('section_label')}
          </span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-indigo-300" />
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-8 lg:gap-12">
          {/* Photo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-200 to-violet-200 rounded-3xl rotate-3 opacity-60" />
              <div className="relative w-[280px] sm:w-80 aspect-[3/4] mx-auto shrink-0 rounded-3xl overflow-hidden bg-blue-50 shadow-md">
                {showImage ? (
                  <Image 
                    src={founder.photoUrl} 
                    alt={name || "Founder"} 
                    fill 
                    className="object-cover object-top" 
                    unoptimized 
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500 text-6xl font-bold">
                    {name?.charAt(0) || 'F'}
                  </div>
                )}
                
                {/* Name badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg text-center py-2.5 px-4 border border-blue-50">
                  <p className="font-bold text-gray-900 text-sm">{name}</p>
                  <p className="text-indigo-600 text-xs mt-0.5">{t('section_label')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <p className="text-gray-600 text-base leading-relaxed">{bio}</p>

            {/* Message quote */}
            <div className="relative bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-6 md:p-8">
              <Quote className="absolute top-4 left-4 w-8 h-8 text-indigo-200" />
              <h3 className="font-semibold text-indigo-900 mb-3 mt-2">{t('message_title')}</h3>
              <p className="text-gray-700 leading-relaxed italic text-sm md:text-base">
                &ldquo;{message}&rdquo;
              </p>
            </div>
            
            {/* Slider Controls */}
            {founders.length > 1 && (
              <div className="flex items-center gap-4 mt-8 pt-4 border-t border-gray-100">
                <button
                  onClick={prevFounder}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm"
                  aria-label="Previous Founder"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-sm font-medium text-gray-500">
                  {currentIndex + 1} / {founders.length}
                </div>
                <button
                  onClick={nextFounder}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm"
                  aria-label="Next Founder"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
