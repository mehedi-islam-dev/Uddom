import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  coachingName: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  metaTitle: string;
  metaDescription: string;
  totalStudents: string;
  totalTeachers: string;
  totalYears: string;
  heroTitle: string;
  heroSubtitle: string;
  specialOfferText: string;
  specialOfferLink: string;
  isSpecialOfferActive: boolean;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    coachingName: { type: String, default: 'Uddom Academic Care' },
    logoUrl: { type: String, default: '' },
    address: { type: String, default: 'Chattogram, Bangladesh' },
    phone: { type: String, default: '' },
    email: { type: String, default: 'uddomacademiccare2024@gmail.com' },
    mapEmbedUrl: { type: String, default: '' },
    metaTitle: { type: String, default: 'Uddom Academic Care | Best Coaching in Chattogram' },
    metaDescription: { type: String, default: 'Join Uddom Academic Care for the best education.' },
    totalStudents: { type: String, default: '200+' },
    totalTeachers: { type: String, default: '25+' },
    totalYears: { type: String, default: '12+' },
    heroTitle: { type: String, default: 'Welcome to Uddom Academic Care' },
    heroSubtitle: { type: String, default: 'Empowering the Next Generation of Achievers' },
    specialOfferText: { type: String, default: '🎉 নতুন ব্যাচে ভর্তি চলছে! ২০% ছাড়!' },
    specialOfferLink: { type: String, default: '/admission' },
    isSpecialOfferActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;