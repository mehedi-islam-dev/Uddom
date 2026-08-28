import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import SuccessStory from '@/lib/models/SuccessStory';
import { requireAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const stories = await SuccessStory.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(stories);
  } catch (error) {
    console.error('GET /api/success-stories error:', error);
    return NextResponse.json({ error: 'Failed to fetch success stories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    await connectDB();
    const body = await request.json();
    const { studentNameEn, studentNameBn, achievementEn, achievementBn, imageUrl } = body;

    if (!studentNameEn || !studentNameBn || !achievementEn || !achievementBn) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const story = await SuccessStory.create({
      studentNameEn,
      studentNameBn,
      achievementEn,
      achievementBn,
      imageUrl: imageUrl || '',
    });

    revalidatePath('/en');
    revalidatePath('/bn');

    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error('POST /api/success-stories error:', error);
    return NextResponse.json({ error: 'Failed to create success story' }, { status: 500 });
  }
}
