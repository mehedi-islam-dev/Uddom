import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Founder from '@/lib/models/Founder';
import { requireAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    let founder = await Founder.findOne({}).lean();
    if (!founder) {
      founder = await Founder.create({});
    }
    return NextResponse.json(founder);
  } catch (error) {
    console.error('GET /api/founder error:', error);
    return NextResponse.json({ error: 'Failed to fetch founder' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    await connectDB();
    const body = await request.json();

    const founder = await Founder.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    );

    revalidatePath('/en');
    revalidatePath('/bn');
    return NextResponse.json(founder);
  } catch (error) {
    console.error('PUT /api/founder error:', error);
    return NextResponse.json({ error: 'Failed to update founder' }, { status: 500 });
  }
}
