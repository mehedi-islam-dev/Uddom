import { useTranslations, useLocale } from 'next-intl';
import { Users } from 'lucide-react';
import { StudentProfileData } from '@/lib/types';

interface StudentsSectionProps {
  students: StudentProfileData[];
}

export default function StudentsSection({ students }: StudentsSectionProps) {
  const t = useTranslations('students');
  const locale = useLocale();

  return (
    <section id="students" className="py-20 lg:py-28 bg-indigo-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
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

        {/* Students Grid */}
        {students.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {students.map((student) => {
              const name = locale === 'bn' ? student.nameBn : student.nameEn;
              const batch = locale === 'bn' ? student.batchBn : student.batchEn;

              return (
                <div
                  key={student._id}
                  className="group flex flex-col items-center text-center p-4 bg-indigo-900/50 backdrop-blur-sm rounded-2xl border border-indigo-800/50 hover:bg-indigo-800/60 hover:border-indigo-600/50 hover:-translate-y-1 transition-all duration-200"
                >
                  {/* Avatar */}
                  {student.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={student.imageUrl}
                      alt={name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-700 group-hover:ring-indigo-400 transition-all mb-3"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-indigo-800 flex items-center justify-center mb-3 ring-2 ring-indigo-700 group-hover:ring-indigo-400 transition-all">
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
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-indigo-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-indigo-400">{t('no_students')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
