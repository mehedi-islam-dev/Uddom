import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Quote } from 'lucide-react';
import { FounderData } from '@/lib/types';

interface FounderSectionProps {
  founder: FounderData;
}

export default function FounderSection({ founder }: FounderSectionProps) {
  const t = useTranslations('founder');
  const locale = useLocale();

  const name = locale === 'bn' ? founder.nameBn : founder.nameEn;
  const bio = locale === 'bn' ? founder.bioBn : founder.bioEn;
  const message = locale === 'bn' ? founder.messageBn : founder.messageEn;

  return (
    <section id="founder" className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-12 justify-center">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-indigo-300" />
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">
            {t('section_label')}
          </span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-indigo-300" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Photo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-200 to-violet-200 rounded-3xl rotate-3 opacity-60" />
              <div className="relative w-64 h-80 sm:w-80 sm:h-96 rounded-2xl overflow-hidden shadow-2xl">
                {founder.photoUrl ? (
                  <Image
                    src={founder.photoUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 256px, 320px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                      <span className="text-white text-5xl font-bold">
                        {name.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {/* Name badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-xl px-6 py-3 shadow-lg text-center min-w-[180px]">
                <p className="font-bold text-gray-900 text-sm">{name}</p>
                <p className="text-indigo-600 text-xs mt-0.5">{t('section_label')}</p>
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
                "{message}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
