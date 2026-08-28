import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Teacher from '@/lib/models/Teacher';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const teachers = await Teacher.find({}).sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json(teachers);
  } catch (error) {
    console.error('GET /api/teachers error:', error);
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { nameEn, nameBn, subjectEn, subjectBn, experience, photoUrl, order } = body;

    if (!nameEn || !nameBn || !subjectEn || !subjectBn || !experience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const teacher = await Teacher.create({
      nameEn,
      nameBn,
      subjectEn,
      subjectBn,
      experience,
      photoUrl: photoUrl || '',
      order: order ?? 0,
    });

    // Invalidate Next.js cache so the public frontend reflects new data immediately
    revalidatePath('/en');
    revalidatePath('/bn');
    revalidatePath('/en/');
    revalidatePath('/bn/');

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error('POST /api/teachers error:', error);
    return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
  }
}
