import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * POST /api/admin/login
 * Admin login endpoint
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text || 'Invalid JSON response from backend' };
    }

    if (!response.ok) {
      console.error(`Backend login error (${response.status}):`, data);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Login fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to login', details: error.toString() },
      { status: 500 }
    );
  }
}
