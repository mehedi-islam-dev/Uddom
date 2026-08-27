import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudentProfile extends Document {
  nameEn: string;
  nameBn: string;
  batchEn: string;
  batchBn: string;
  rollNumber: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    nameEn: { type: String, required: true, trim: true },
    nameBn: { type: String, required: true, trim: true },
    batchEn: { type: String, required: true, trim: true },
    batchBn: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

const StudentProfile: Model<IStudentProfile> =
  mongoose.models.StudentProfile ??
  mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);

export default StudentProfile;
