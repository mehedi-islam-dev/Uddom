import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Teacher from '@/lib/models/Teacher';
import { requireAdminAuth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updated = await Teacher.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Invalidate Next.js cache so the public frontend reflects updated data immediately
    revalidatePath('/en');
    revalidatePath('/bn');

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/teachers/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update teacher' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    await connectDB();
    const { id } = await params;
    const deleted = await Teacher.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Invalidate Next.js cache after deletion
    revalidatePath('/en');
    revalidatePath('/bn');

    return NextResponse.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/teachers/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 });
  }
}
