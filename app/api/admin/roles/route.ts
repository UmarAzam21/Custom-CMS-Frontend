import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * GET /api/admin/roles
 * List all roles (Super Admin Only)
 */
export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/roles`, {
      method: 'GET',
      headers: {
        'Authorization': req.headers.get('Authorization') || '',
      },
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text || 'Invalid JSON response from backend' };
    }

    if (!response.ok) {
      console.error(`Backend error (${response.status}):`, data);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch roles', details: error.toString() },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/roles
 * Create custom role (Super Admin Only)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${BACKEND_URL}/api/admin/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.get('Authorization') || '',
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
      console.error(`Backend error (${response.status}):`, data);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create role', details: error.toString() },
      { status: 500 }
    );
  }
}
