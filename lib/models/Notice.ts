import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotice extends Document {
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema = new Schema<INotice>(
  {
    titleEn: { type: String, required: true, trim: true },
    titleBn: { type: String, required: true, trim: true },
    descriptionEn: { type: String, required: true, trim: true },
    descriptionBn: { type: String, required: true, trim: true },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const Notice: Model<INotice> =
  mongoose.models.Notice ?? mongoose.model<INotice>('Notice', NoticeSchema);

export default Notice;
