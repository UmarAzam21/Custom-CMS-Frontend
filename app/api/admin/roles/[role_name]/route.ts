import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * GET /api/admin/roles/{role_name}
 * Get specific role (Super Admin Only)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ role_name: string }> }
) {
  try {
    const { role_name } = await params;

    const response = await fetch(`${BACKEND_URL}/api/admin/roles/${role_name}`, {
      method: 'GET',
      headers: {
        'Authorization': req.headers.get('Authorization') || '',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch role' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/roles/{role_name}
 * Update role (Super Admin Only)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ role_name: string }> }
) {
  try {
    const { role_name } = await params;
    const body = await req.json();

    const response = await fetch(`${BACKEND_URL}/api/admin/roles/${role_name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update role' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/roles/{role_name}
 * Delete role (Super Admin Only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ role_name: string }> }
) {
  try {
    const { role_name } = await params;

    const response = await fetch(`${BACKEND_URL}/api/admin/roles/${role_name}`, {
      method: 'DELETE',
      headers: {
        'Authorization': req.headers.get('Authorization') || '',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete role' },
      { status: 500 }
    );
  }
}
