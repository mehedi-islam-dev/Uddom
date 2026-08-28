import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import SiteSettings from '@/lib/models/SiteSettings';
import { requireAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne({});

    if (!settings) {
      settings = await SiteSettings.create({});
    }

    return NextResponse.json(settings);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('GET Settings Error:', msg);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    await connectDB();
    const body = await request.json();

    // Strip Mongoose system fields before saving
    const { _id, __v, createdAt, updatedAt, ...updateData } = body;

    let settings = await SiteSettings.findOne({});

    if (!settings) {
      settings = await SiteSettings.create(updateData);
    } else {
      Object.assign(settings, updateData);
      await settings.save();
    }

    // Invalidate Next.js cache for both locale home pages so layout & hero
    // immediately display the updated coachingName, logoUrl, hero content, etc.
    revalidatePath('/en');
    revalidatePath('/bn');
    revalidatePath('/en/', 'layout');
    revalidatePath('/bn/', 'layout');

    return NextResponse.json(settings);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server Error';
    console.error('PUT Settings Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}