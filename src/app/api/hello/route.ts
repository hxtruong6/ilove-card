import { NextResponse } from 'next/server';

export function GET(request: Request) {
  //   return new Response(JSON.stringify({ message: 'Hello from Next.js!' }), {
  //     headers: { 'Content-Type': 'application/json' },
  //   });

  return NextResponse.json({ message: 'Hello from Next.js! 123' });
}
