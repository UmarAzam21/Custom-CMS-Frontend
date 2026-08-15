import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * GET /api/admin/roles/builtin/list
 * List built-in roles (Super Admin Only)
 */
export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/roles/builtin/list`, {
      method: 'GET',
      headers: {
        'Authorization': req.headers.get('Authorization') || '',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch built-in roles' },
      { status: 500 }
    );
  }
}
