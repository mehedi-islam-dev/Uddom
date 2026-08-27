import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SiteSettings from '@/lib/models/SiteSettings';

export async function GET() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne({});

    if (!settings) {
      settings = await SiteSettings.create({});
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('GET Settings Error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // ১. ফর্ম থেকে আসা ডেটা থেকে ডাটাবেসের সিস্টেম আইডিগুলো আলাদা করে দিচ্ছি
    const { _id, __v, createdAt, updatedAt, ...updateData } = body;

    // ২. আগের ডেটাবেস ডকুমেন্টটি খুঁজে বের করছি
    let settings = await SiteSettings.findOne({});

    if (!settings) {
      // ৩. যদি একদমই কিছু না থাকে, নতুন তৈরি করবে
      settings = await SiteSettings.create(updateData);
    } else {
      // ৪. আর যদি থাকে, তবে আগের ডকুমেন্টের ওপর নতুন ডেটাগুলো বসিয়ে সেভ করবে
      Object.assign(settings, updateData);
      await settings.save(); // এটি সবচেয়ে নিরাপদ সেভ মেথড!
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    // ৫. যদি এবারও ফেইল করে, তবে ঠিক কী কারণে ফেইল করেছে সেই আসল মেসেজটি ফর্মে পাঠাবে
    console.error('PUT Settings Error:', error.message);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}