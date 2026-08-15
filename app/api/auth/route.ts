import { NextRequest } from "next/server";

// Proxies multipart/form-data uploads straight through to the FastAPI backend.
// IMPORTANT: do not call req.formData() or req.json() here — parsing and
// re-serializing the body breaks the multipart boundary. Stream it as-is.

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  const backendRes = await fetch(`${BACKEND_URL}/api/admin/media/upload`, {
    method: "POST",
    headers: {
      // Forward whatever the browser sent, MINUS content-type/content-length —
      // fetch will set those correctly from `req.body`'s own multipart boundary.
      cookie: req.headers.get("cookie") ?? "",
      authorization: req.headers.get("authorization") ?? "",
    },
    body: req.body,
    // Required by Node's fetch when streaming a request body through.
    // Without this, the request hangs indefinitely instead of erroring.
    // @ts-expect-error -- duplex is valid at runtime but missing from the TS lib types
    duplex: "half",
  });

  const contentType = backendRes.headers.get("content-type") ?? "application/json";
  const data = await backendRes.text();

  return new Response(data, {
    status: backendRes.status,
    headers: { "content-type": contentType },
  });
}