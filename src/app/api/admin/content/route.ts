import { NextResponse } from "next/server";
import { isValidPasscode, passcodeFromRequest } from "@/lib/admin-auth";
import { getSiteContent, saveSiteContent } from "@/lib/site-content-server";
import { normalizeContent } from "@/lib/site-content";

/**
 * GET /api/admin/content
 * Returns the current site content (no secret data — same data the page uses).
 */
export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json({ ok: true, content });
}

/**
 * PUT /api/admin/content
 * Headers: x-admin-passcode
 * Body: partial or full site content — normalized over defaults, then saved.
 */
export async function PUT(request: Request) {
  if (!isValidPasscode(passcodeFromRequest(request))) {
    return NextResponse.json(
      { ok: false, error: "دسترسی غیرمجاز." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "بدنه درخواست نامعتبر است." },
      { status: 400 },
    );
  }

  const incoming = (body as { content?: unknown } | null)?.content ?? body;

  try {
    const content = normalizeContent(incoming);
    await saveSiteContent(content);
    return NextResponse.json({ ok: true, content });
  } catch {
    return NextResponse.json(
      { ok: false, error: "ذخیره‌سازی با خطا مواجه شد." },
      { status: 500 },
    );
  }
}
