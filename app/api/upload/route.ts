import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Require admin auth for uploads
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (max 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be smaller than 10 MB' }, { status: 400 });
    }

    // Get file extension from mime type or original filename
    const originalName = file.name || 'upload';
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
    const safeExt = allowedExts.includes(ext) ? ext : '.jpg';

    // Generate unique filename: timestamp + random suffix
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const filename = `${timestamp}-${random}${safeExt}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error('POST /api/upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
