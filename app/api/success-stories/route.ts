import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SuccessStory from '@/lib/models/SuccessStory';

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

    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error('POST /api/success-stories error:', error);
    return NextResponse.json({ error: 'Failed to create success story' }, { status: 500 });
  }
}
