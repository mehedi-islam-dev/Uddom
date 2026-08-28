import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Notice from '@/lib/models/Notice';
import { requireAdminAuth } from '@/lib/auth';

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
  const authError = requireAdminAuth(request);
  if (authError) return authError;

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

    // Invalidate Next.js cache so the public frontend shows the new notice immediately
    revalidatePath('/en');
    revalidatePath('/bn');

    return NextResponse.json(notice, { status: 201 });
  } catch (error) {
    console.error('POST /api/notices error:', error);
    return NextResponse.json({ error: 'Failed to create notice' }, { status: 500 });
  }
}
