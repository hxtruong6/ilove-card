import { NextResponse } from 'next/server';

export async function POST() {
  // NextAuth.js handles session cleanup
  return NextResponse.json({ success: true });
}
