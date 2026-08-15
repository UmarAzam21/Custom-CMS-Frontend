import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * GET /api/admin/health
 * Check if backend is reachable
 */
export async function GET(req: NextRequest) {
  console.log('Health check - Backend URL:', BACKEND_URL);

  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/health`, {
      method: 'GET',
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw_response: text };
    }

    return NextResponse.json(
      {
        status: 'ok',
        backend_url: BACKEND_URL,
        backend_status: response.status,
        backend_response: data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        backend_url: BACKEND_URL,
        error: error.message,
        details: error.toString(),
      },
      { status: 503 }
    );
  }
}
