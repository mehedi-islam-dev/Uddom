import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notice from '@/lib/models/Notice';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await request.json();
    const { titleEn, titleBn, descriptionEn, descriptionBn, date } = body;

    if (!titleEn || !titleBn || !descriptionEn || !descriptionBn) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updated = await Notice.findByIdAndUpdate(
      id,
      { titleEn, titleBn, descriptionEn, descriptionBn, date: date ? new Date(date) : undefined },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/notices/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update notice' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const deleted = await Notice.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/notices/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete notice' }, { status: 500 });
  }
}
