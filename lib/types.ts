// Shared type definitions for client and server use

export interface TeacherData {
  _id: string;
  nameEn: string;
  nameBn: string;
  subjectEn: string;
  subjectBn: string;
  experience: string;
  photoUrl: string;
  order: number;
}

export interface SiteSettingsData {
  _id?: string;
  coachingName: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  metaTitle: string;
  metaDescription: string;
  totalStudents?: string;
  totalTeachers?: string;
  totalYears?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  specialOfferText?: string;
  specialOfferLink?: string;
  isSpecialOfferActive?: boolean;
}

export interface FounderData {
  _id?: string;
  nameEn: string;
  nameBn: string;
  bioEn: string;
  bioBn: string;
  messageEn: string;
  messageBn: string;
  photoUrl: string;
}

export interface NoticeData {
  _id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  date: string;
}

export interface SuccessStoryData {
  _id: string;
  studentNameEn: string;
  studentNameBn: string;
  achievementEn: string;
  achievementBn: string;
  imageUrl: string;
}

export interface StudentProfileData {
  _id: string;
  nameEn: string;
  nameBn: string;
  batchEn: string;
  batchBn: string;
  rollNumber: string;
  imageUrl: string;
}
