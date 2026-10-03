import { NextResponse } from "next/server";
import { isValidPasscode } from "@/lib/admin-auth";

/**
 * POST /api/admin/login
 * Body: { passcode: string }
 * Verifies the admin passcode (checked against the ADMIN_PASSCODE env var).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "درخواست نامعتبر است." },
      { status: 400 },
    );
  }

  const passcode = (body as { passcode?: unknown } | null)?.passcode;

  if (!isValidPasscode(passcode)) {
    return NextResponse.json(
      { ok: false, error: "رمز مدیریت نادرست است." },
      { status: 401 },
    );
  }

  return NextResponse.json({ ok: true });
}
