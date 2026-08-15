import { NextResponse } from 'next/server';

async function forward(req: Request) {
  try {
    const url = new URL(req.url);

    // extract path after /api/proxy/
    const prefix = '/api/proxy/';
    let forwardPath = url.pathname.startsWith(prefix) ? url.pathname.slice(prefix.length) : '';
    // remove leading slash if present
    if (forwardPath.startsWith('/')) forwardPath = forwardPath.slice(1);

    const targetBase = 'http://127.0.0.1:8000/api';
    // build target URL: avoid duplicate slashes
    const targetUrl = forwardPath ? `${targetBase}/${forwardPath}${url.search}` : `${targetBase}${url.search}`;

    // build headers to forward
    const headers: Record<string, string> = {};
    req.headers.forEach((v, k) => {
      // don't forward host header
      if (k.toLowerCase() === 'host') return;
      headers[k] = v as string;
    });

    if (!headers.authorization && !headers.Authorization) {
      const authHeader = req.headers.get('authorization');
      if (authHeader) {
        headers.authorization = authHeader;
      }
    }

    const init: RequestInit = {
      method: req.method,
      headers,
      // forward body for methods that may have one (use arrayBuffer for binary/form-data)
      body: ['GET', 'HEAD', 'OPTIONS'].includes(req.method) ? undefined : await req.arrayBuffer(),
    };

    const res = await fetch(targetUrl, init);
    const resBuffer = await res.arrayBuffer();

    const resHeaders: Record<string, string> = {};
    res.headers.forEach((v, k) => {
      const lower = k.toLowerCase();
      // fetch() already transparently decompresses the body before we read it
      // above, so forwarding the original content-encoding/content-length
      // headers would make the browser try to decode an already-decoded body
      // (and mismatch on length) — drop them and let NextResponse recompute.
      if (lower === 'content-encoding' || lower === 'content-length' || lower === 'transfer-encoding') return;
      resHeaders[k] = v ?? '';
    });

    // Add CORS headers so the frontend can call this proxy from other origins
    const origin = req.headers.get('origin') ?? '*';
    resHeaders['Access-Control-Allow-Origin'] = origin;
    resHeaders['Access-Control-Allow-Credentials'] = 'true';
    // Expose common response headers to the browser
    resHeaders['Access-Control-Expose-Headers'] = res.headers.get('access-control-expose-headers') ?? 'Content-Length,Content-Type';

    return new NextResponse(resBuffer, { status: res.status, headers: resHeaders });
  } catch (err: any) {
    return new NextResponse(err?.message || 'Proxy error', { status: 500 });
  }
}

export async function GET(req: Request) {
  return forward(req);
}

export async function POST(req: Request) {
  return forward(req);
}

export async function PUT(req: Request) {
  return forward(req);
}

export async function PATCH(req: Request) {
  return forward(req);
}

export async function DELETE(req: Request) {
  return forward(req);
}
export async function OPTIONS(req: Request) {
  const headers = new Headers();
  const origin = req.headers.get('origin') ?? '*';
  const reqHeaders = req.headers.get('access-control-request-headers') ?? 'Content-Type, Authorization';

  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  headers.set('Access-Control-Allow-Headers', reqHeaders);
  headers.set('Access-Control-Allow-Credentials', 'true');
  // no content for preflight
  return new NextResponse(null, { status: 204, headers });
}