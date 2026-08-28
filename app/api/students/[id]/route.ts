import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import StudentProfile from '@/lib/models/StudentProfile';
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
    const { nameEn, nameBn, batchEn, batchBn, rollNumber, imageUrl } = body;

    if (!nameEn || !nameBn || !batchEn || !batchBn || !rollNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updated = await StudentProfile.findByIdAndUpdate(
      id,
      { nameEn, nameBn, batchEn, batchBn, rollNumber, imageUrl: imageUrl || '' },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    revalidatePath('/en');
    revalidatePath('/bn');

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/students/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update student profile' }, { status: 500 });
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
    const deleted = await StudentProfile.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    revalidatePath('/en');
    revalidatePath('/bn');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/students/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete student profile' }, { status: 500 });
  }
}
