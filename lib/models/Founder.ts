import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFounder extends Document {
  nameEn: string;
  nameBn: string;
  bioEn: string;
  bioBn: string;
  messageEn: string;
  messageBn: string;
  photoUrl: string;
}

const FounderSchema = new Schema<IFounder>(
  {
    nameEn: { type: String, default: 'Founder Name', trim: true },
    nameBn: { type: String, default: 'প্রতিষ্ঠাতার নাম', trim: true },
    bioEn: {
      type: String,
      default:
        'A dedicated educator with over 20 years of experience in shaping young minds.',
      trim: true,
    },
    bioBn: {
      type: String,
      default: 'তরুণ মেধাবীদের গড়ে তোলায় ২০ বছরেরও বেশি অভিজ্ঞতাসম্পন্ন একজন নিবেদিত শিক্ষাবিদ।',
      trim: true,
    },
    messageEn: {
      type: String,
      default:
        'Education is the most powerful weapon you can use to change the world. At Shikkha Alo, we believe every student has the potential to excel.',
      trim: true,
    },
    messageBn: {
      type: String,
      default:
        'শিক্ষা হলো সবচেয়ে শক্তিশালী অস্ত্র যা আপনি পৃথিবীকে পরিবর্তন করতে ব্যবহার করতে পারেন। শিক্ষা আলোতে, আমরা বিশ্বাস করি প্রতিটি শিক্ষার্থীর মধ্যে উৎকর্ষ লাভের সম্ভাবনা রয়েছে।',
      trim: true,
    },
    photoUrl: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

const Founder: Model<IFounder> =
  mongoose.models.Founder ?? mongoose.model<IFounder>('Founder', FounderSchema);

export default Founder;
