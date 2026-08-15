import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * POST /api/admin/brand-assets/upload-favicon
 * Upload favicon to Cloudinary
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const response = await fetch(`${BACKEND_URL}/api/admin/brand-assets/upload-favicon`, {
      method: 'POST',
      headers: {
        'Authorization': req.headers.get('Authorization') || '',
      },
      body: formData,
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
    const message = error instanceof Error ? error.message : 'Failed to upload favicon';
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: message, details: String(error) },
      { status: 500 }
    );
  }
}
