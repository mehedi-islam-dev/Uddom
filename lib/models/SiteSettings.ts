import mongoose, { Schema, Document, Model } from 'mongoose';

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
    coachingName: { type: String, default: 'Shikkha Alo Coaching', trim: true },
    logoUrl: { type: String, default: '', trim: true },
    address: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    mapEmbedUrl: { type: String, default: '', trim: true },
    metaTitle: { type: String, default: 'Shikkha Alo Coaching Center', trim: true },
    metaDescription: {
      type: String,
      default: 'Quality education and expert coaching for academic excellence.',
      trim: true,
    },
  },
  { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ??
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
