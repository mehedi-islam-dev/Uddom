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
