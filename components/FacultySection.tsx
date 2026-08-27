import { useTranslations } from 'next-intl';
import { GraduationCap } from 'lucide-react';
import { TeacherData } from '@/lib/types';
import TeacherCard from './TeacherCard';

interface FacultySectionProps {
  teachers: TeacherData[];
}

export default function FacultySection({ teachers }: FacultySectionProps) {
  const t = useTranslations('faculty');

  return (
    <section id="faculty" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
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

        {/* Grid */}
        {teachers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {teachers.map((teacher) => (
              <TeacherCard key={teacher._id} teacher={teacher} />
            ))}
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
    </section>
  );
}
