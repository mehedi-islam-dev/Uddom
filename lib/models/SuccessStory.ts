import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISuccessStory extends Document {
  studentNameEn: string;
  studentNameBn: string;
  achievementEn: string;
  achievementBn: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const SuccessStorySchema = new Schema<ISuccessStory>(
  {
    studentNameEn: { type: String, required: true, trim: true },
    studentNameBn: { type: String, required: true, trim: true },
    achievementEn: { type: String, required: true, trim: true },
    achievementBn: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

const SuccessStory: Model<ISuccessStory> =
  mongoose.models.SuccessStory ??
  mongoose.model<ISuccessStory>('SuccessStory', SuccessStorySchema);

export default SuccessStory;
