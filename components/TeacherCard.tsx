import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Briefcase } from 'lucide-react';
import { TeacherData } from '@/lib/types';

interface TeacherCardProps {
  teacher: TeacherData;
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: 'bg-blue-100 text-blue-700',
  Physics: 'bg-purple-100 text-purple-700',
  Chemistry: 'bg-green-100 text-green-700',
  Biology: 'bg-emerald-100 text-emerald-700',
  English: 'bg-yellow-100 text-yellow-700',
  default: 'bg-indigo-100 text-indigo-700',
};

function getSubjectColor(subject: string): string {
  for (const key of Object.keys(SUBJECT_COLORS)) {
    if (subject.toLowerCase().includes(key.toLowerCase())) {
      return SUBJECT_COLORS[key];
    }
  }
  return SUBJECT_COLORS.default;
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
  const locale = useLocale();
  const name = locale === 'bn' ? teacher.nameBn : teacher.nameEn;
  const subject = locale === 'bn' ? teacher.subjectBn : teacher.subjectEn;
  const subjectColor = getSubjectColor(teacher.subjectEn);

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Photo */}
      <div className="relative h-56 bg-gradient-to-br from-indigo-50 to-violet-50 overflow-hidden">
        {teacher.photoUrl ? (
          <Image
            src={teacher.photoUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl font-bold">
                {teacher.nameEn.charAt(0)}
              </span>
            </div>
          </div>
        )}
        {/* Subject badge overlay */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${subjectColor} shadow-sm`}>
            {subject}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-gray-900 font-bold text-lg leading-tight">{name}</h3>
        <p className="text-indigo-600 text-sm font-medium mt-0.5">{subject}</p>

        <div className="flex items-center gap-1.5 mt-3 text-gray-500 text-sm">
          <Briefcase className="w-3.5 h-3.5 shrink-0" />
          <span>{teacher.experience}</span>
        </div>
      </div>
    </div>
  );
}
