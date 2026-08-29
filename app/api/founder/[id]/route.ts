import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Founder from '@/lib/models/Founder';
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

    const updated = await Founder.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Founder not found' }, { status: 404 });
    }

    // Invalidate Next.js cache so the public frontend reflects updated data immediately
    revalidatePath('/en');
    revalidatePath('/bn');

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/founder/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update founder' }, { status: 500 });
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
    const deleted = await Founder.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Founder not found' }, { status: 404 });
    }

    // Invalidate Next.js cache after deletion
    revalidatePath('/en');
    revalidatePath('/bn');

    return NextResponse.json({ message: 'Founder deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/founder/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete founder' }, { status: 500 });
  }
}
