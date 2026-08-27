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
  },
  { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;