import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Founder from '@/lib/models/Founder';
import { requireAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const founders = await Founder.find({}).sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json(founders);
  } catch (error) {
    console.error('GET /api/founder error:', error);
    return NextResponse.json({ error: 'Failed to fetch founder' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    await connectDB();
    const body = await request.json();

    const { nameEn, nameBn, bioEn, bioBn, messageEn, messageBn, photoUrl, order } = body;

    if (!nameEn || !nameBn || !bioEn || !bioBn || !messageEn || !messageBn) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const founder = await Founder.create({
      nameEn,
      nameBn,
      bioEn,
      bioBn,
      messageEn,
      messageBn,
      photoUrl: photoUrl || '',
      order: order ?? 0,
    });

    revalidatePath('/en');
    revalidatePath('/bn');
    return NextResponse.json(founder, { status: 201 });
  } catch (error) {
    console.error('POST /api/founder error:', error);
    return NextResponse.json({ error: 'Failed to create founder' }, { status: 500 });
  }
}
