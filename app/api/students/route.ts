import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import StudentProfile from '@/lib/models/StudentProfile';
import { requireAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const students = await StudentProfile.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(students);
  } catch (error) {
    console.error('GET /api/students error:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    await connectDB();
    const body = await request.json();
    const { nameEn, nameBn, batchEn, batchBn, rollNumber, imageUrl } = body;

    if (!nameEn || !nameBn || !batchEn || !batchBn || !rollNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const student = await StudentProfile.create({
      nameEn,
      nameBn,
      batchEn,
      batchBn,
      rollNumber,
      imageUrl: imageUrl || '',
    });

    revalidatePath('/en');
    revalidatePath('/bn');

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('POST /api/students error:', error);
    return NextResponse.json({ error: 'Failed to create student profile' }, { status: 500 });
  }
}
