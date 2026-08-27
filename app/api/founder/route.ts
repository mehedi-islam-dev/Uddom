import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Founder from '@/lib/models/Founder';

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
  try {
    await connectDB();
    const body = await request.json();

    const founder = await Founder.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(founder);
  } catch (error) {
    console.error('PUT /api/founder error:', error);
    return NextResponse.json({ error: 'Failed to update founder' }, { status: 500 });
  }
}
