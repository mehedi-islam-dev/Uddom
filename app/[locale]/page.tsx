export const dynamic = 'force-dynamic';
export const revalidate = 0;

import HeroSection from '@/components/HeroSection';
import FounderSection from '@/components/FounderSection';
import FacultySection from '@/components/FacultySection';
import NoticesSection from '@/components/NoticesSection';
import StudentsSection from '@/components/StudentsSection';
import SuccessStoriesSection from '@/components/SuccessStoriesSection';
import ContactSection from '@/components/ContactSection';
import {
  TeacherData,
  FounderData,
  SiteSettingsData,
  NoticeData,
  SuccessStoryData,
  StudentProfileData,
} from '@/lib/types';

const BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getTeachers(): Promise<TeacherData[]> {
  try {
    const res = await fetch(`${BASE}/api/teachers`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getFounder(): Promise<FounderData> {
  try {
    const res = await fetch(`${BASE}/api/founder`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return {
      nameEn: 'Our Founder',
      nameBn: 'আমাদের প্রতিষ্ঠাতা',
      bioEn: 'A dedicated educator committed to excellence.',
      bioBn: 'উৎকর্ষতায় নিবেদিত একজন শিক্ষাবিদ।',
      messageEn: 'Education is the key to unlocking potential.',
      messageBn: 'শিক্ষা সম্ভাবনার দ্বার উন্মোচনের চাবিকাঠি।',
      photoUrl: '',
    };
  }
}

async function getSettings(): Promise<SiteSettingsData> {
  try {
    const res = await fetch(`${BASE}/api/settings`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return {
      coachingName: 'Uddom Academic Care',
      logoUrl: '',
      address: '',
      phone: '',
      email: '',
      mapEmbedUrl: '',
      metaTitle: '',
      metaDescription: '',
    };
  }
}

async function getNotices(): Promise<NoticeData[]> {
  try {
    const res = await fetch(`${BASE}/api/notices`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getSuccessStories(): Promise<SuccessStoryData[]> {
  try {
    const res = await fetch(`${BASE}/api/success-stories`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getStudents(): Promise<StudentProfileData[]> {
  try {
    const res = await fetch(`${BASE}/api/students`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [teachers, founder, settings, notices, stories, students] =
    await Promise.all([
      getTeachers(),
      getFounder(),
      getSettings(),
      getNotices(),
      getSuccessStories(),
      getStudents(),
    ]);

  return (
    <>
      <HeroSection />
      <FounderSection founder={founder} />
      <FacultySection teachers={teachers} />
      <NoticesSection notices={notices} />
      <SuccessStoriesSection stories={stories} />
      <StudentsSection students={students} />
      <ContactSection settings={settings} />
    </>
  );
}
