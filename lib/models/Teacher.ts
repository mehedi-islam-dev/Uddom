import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeacher extends Document {
  nameEn: string;
  nameBn: string;
  subjectEn: string;
  subjectBn: string;
  experience: string;
  photoUrl: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema = new Schema<ITeacher>(
  {
    nameEn: { type: String, required: true, trim: true },
    nameBn: { type: String, required: true, trim: true },
    subjectEn: { type: String, required: true, trim: true },
    subjectBn: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    photoUrl: { type: String, default: '', trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Teacher: Model<ITeacher> =
  mongoose.models.Teacher ?? mongoose.model<ITeacher>('Teacher', TeacherSchema);

export default Teacher;
