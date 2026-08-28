import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notice from '@/lib/models/Notice';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    await connectDB();
    const notices = await Notice.find({}).sort({ date: -1, createdAt: -1 }).lean();
    return NextResponse.json(notices);
  } catch (error) {
    console.error('GET /api/notices error:', error);
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { titleEn, titleBn, descriptionEn, descriptionBn, date } = body;

    if (!titleEn || !titleBn || !descriptionEn || !descriptionBn) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const notice = await Notice.create({
      titleEn,
      titleBn,
      descriptionEn,
      descriptionBn,
      date: date ? new Date(date) : new Date(),
    });

    return NextResponse.json(notice, { status: 201 });
  } catch (error) {
    console.error('POST /api/notices error:', error);
    return NextResponse.json({ error: 'Failed to create notice' }, { status: 500 });
  }
}
