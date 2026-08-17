import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * POST /api/admin/logout
 * Admin logout endpoint - forwards logout request to backend
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');

    const response = await fetch(`${BACKEND_URL}/api/admin/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = response.ok ? { message: 'Logout successful' } : { error: text || 'Logout failed' };
    }

    if (!response.ok) {
      console.error(`Backend logout error (${response.status}):`, data);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Logout fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to logout', details: error.toString() },
      { status: 500 }
    );
  }
}
