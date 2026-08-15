import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * POST /api/admin/roles/init-builtin
 * Reinitialize built-in roles (Super Admin Only)
 */
export async function POST(req: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/roles/init-builtin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.get('Authorization') || '',
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to reinitialize built-in roles' },
      { status: 500 }
    );
  }
}
