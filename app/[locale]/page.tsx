export const dynamic = 'force-dynamic';
export const revalidate = 0;

import HeroSection from '@/components/HeroSection';
import FounderSection from '@/components/FounderSection';
import FacultySection from '@/components/FacultySection';
import NoticesSection from '@/components/NoticesSection';
import StudentsSection from '@/components/StudentsSection';
import SuccessStoriesSection from '@/components/SuccessStoriesSection';
import ContactSection from '@/components/ContactSection';
import connectDB from '@/lib/mongodb';
import Teacher from '@/lib/models/Teacher';
import Founder from '@/lib/models/Founder';
import SiteSettings from '@/lib/models/SiteSettings';
import Notice from '@/lib/models/Notice';
import SuccessStory from '@/lib/models/SuccessStory';
import StudentProfile from '@/lib/models/StudentProfile';
import {
  TeacherData,
  FounderData,
  SiteSettingsData,
  NoticeData,
  SuccessStoryData,
  StudentProfileData,
} from '@/lib/types';

async function getTeachers(): Promise<TeacherData[]> {
  try {
    await connectDB();
    const teachers = await Teacher.find({}).sort({ order: 1, createdAt: 1 }).lean();
    return JSON.parse(JSON.stringify(teachers));
  } catch {
    return [];
  }
}

async function getFounders(): Promise<FounderData[]> {
  try {
    await connectDB();
    const founders = await Founder.find({}).sort({ order: 1, createdAt: 1 }).lean();
    return JSON.parse(JSON.stringify(founders));
  } catch {
    return [];
  }
}

async function getSettings(): Promise<SiteSettingsData> {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne({}).lean();
    if (settings) {
      return JSON.parse(JSON.stringify(settings));
    }
  } catch {}
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

async function getNotices(): Promise<NoticeData[]> {
  try {
    await connectDB();
    const notices = await Notice.find({}).sort({ date: -1, createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(notices));
  } catch {
    return [];
  }
}

async function getSuccessStories(): Promise<SuccessStoryData[]> {
  try {
    await connectDB();
    const stories = await SuccessStory.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(stories));
  } catch {
    return [];
  }
}

async function getStudents(): Promise<StudentProfileData[]> {
  try {
    await connectDB();
    const students = await StudentProfile.find({}).sort({ batchEn: 1, createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(students));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [teachers, founders, settings, notices, stories, students] =
    await Promise.all([
      getTeachers(),
      getFounders(),
      getSettings(),
      getNotices(),
      getSuccessStories(),
      getStudents(),
    ]);

  return (
    <>
      <HeroSection settings={settings} />
      <FounderSection founders={founders} />
      <FacultySection teachers={teachers} />
      <NoticesSection notices={notices} />
      <SuccessStoriesSection stories={stories} />
      <StudentsSection students={students} />
      <ContactSection settings={settings} />
    </>
  );
}
