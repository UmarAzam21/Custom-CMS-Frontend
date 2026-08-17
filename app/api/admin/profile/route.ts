import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/profile`, {
      method: 'GET',
      headers: {
        'Authorization': req.headers.get('Authorization') || '',
      },
      cache: 'no-store',
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch admin profile';
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: message, details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${BACKEND_URL}/api/admin/profile`, {
      method: 'PATCH',
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update admin profile';
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: message, details: String(error) },
      { status: 500 }
    );
  }
}
