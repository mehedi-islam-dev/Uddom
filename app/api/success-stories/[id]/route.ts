import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import SuccessStory from '@/lib/models/SuccessStory';
import { requireAdminAuth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    await connectDB();
    const body = await request.json();
    const { studentNameEn, studentNameBn, achievementEn, achievementBn, imageUrl } = body;

    if (!studentNameEn || !studentNameBn || !achievementEn || !achievementBn) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updated = await SuccessStory.findByIdAndUpdate(
      id,
      { studentNameEn, studentNameBn, achievementEn, achievementBn, imageUrl: imageUrl || '' },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Success story not found' }, { status: 404 });
    }

    revalidatePath('/en');
    revalidatePath('/bn');

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/success-stories/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update success story' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    await connectDB();
    const deleted = await SuccessStory.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Success story not found' }, { status: 404 });
    }

    revalidatePath('/en');
    revalidatePath('/bn');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/success-stories/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete success story' }, { status: 500 });
  }
}
