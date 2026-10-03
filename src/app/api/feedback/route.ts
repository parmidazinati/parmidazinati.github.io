import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isValidPasscode, passcodeFromRequest } from "@/lib/admin-auth";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

/** Strip control characters but keep Persian text & newlines intact. */
function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

/* ------------------------------------------------------------------ */
/* light in-memory rate limiting — 5 submissions / 10 min / IP         */
/* ------------------------------------------------------------------ */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();
let lastSweep = Date.now();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (now - lastSweep > 60_000) {
    for (const [key, times] of hits) {
      const recent = times.filter((t) => now - t < WINDOW_MS);
      if (recent.length === 0) hits.delete(key);
      else hits.set(key, recent);
    }
    lastSweep = now;
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

/* ------------------------------------------------------------------ */
/* POST /api/feedback — public: submit a comment / suggestion          */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | Record<string, unknown>
    | null;
  if (!body) {
    return NextResponse.json(
      { ok: false, error: "بدنه درخواست نامعتبر است." },
      { status: 400 },
    );
  }

  /* honeypot: bots fill the hidden field — pretend success, store nothing */
  if (clean(body.website, 100).length > 0) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        error: "تعداد پیام‌های ارسالی زیاد است؛ کمی بعد دوباره تلاش کنید.",
      },
      { status: 429 },
    );
  }

  const name = clean(body.name, 80);
  const contact = clean(body.contact, 120);
  const message = clean(body.message, 1500);

  if (message.length < 3) {
    return NextResponse.json(
      { ok: false, error: "لطفاً متن پیام را وارد کنید." },
      { status: 400 },
    );
  }

  try {
    await db.feedback.create({ data: { name, contact, message } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "ثبت پیام با خطا مواجه شد." },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/* GET /api/feedback — admin: list (or ?meta=1 for counts only)        */
/* ------------------------------------------------------------------ */

export async function GET(request: Request) {
  if (!isValidPasscode(passcodeFromRequest(request))) {
    return NextResponse.json(
      { ok: false, error: "دسترسی غیرمجاز." },
      { status: 401 },
    );
  }

  const meta = new URL(request.url).searchParams.get("meta") === "1";
  if (meta) {
    const [total, unread] = await Promise.all([
      db.feedback.count(),
      db.feedback.count({ where: { readAt: null } }),
    ]);
    return NextResponse.json({ ok: true, total, unread });
  }

  const items = await db.feedback.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ ok: true, items });
}

/* ------------------------------------------------------------------ */
/* PATCH /api/feedback — admin: mark one (or all) read / unread        */
/* ------------------------------------------------------------------ */

export async function PATCH(request: Request) {
  if (!isValidPasscode(passcodeFromRequest(request))) {
    return NextResponse.json(
      { ok: false, error: "دسترسی غیرمجاز." },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { id?: unknown; readAll?: unknown }
    | null;
  if (!body) {
    return NextResponse.json(
      { ok: false, error: "بدنه درخواست نامعتبر است." },
      { status: 400 },
    );
  }

  /* mark everything as read */
  if (body.readAll === true) {
    await db.feedback.updateMany({
      where: { readAt: null },
      data: { readAt: new Date() },
    });
    return NextResponse.json({ ok: true });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "شناسه پیام نامعتبر است." },
      { status: 400 },
    );
  }

  const existing = await db.feedback.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { ok: false, error: "پیام پیدا نشد." },
      { status: 404 },
    );
  }

  await db.feedback.update({
    where: { id },
    data: { readAt: existing.readAt ? null : new Date() },
  });
  return NextResponse.json({ ok: true });
}

/* ------------------------------------------------------------------ */
/* DELETE /api/feedback?id=... — admin: remove one message             */
/* ------------------------------------------------------------------ */

export async function DELETE(request: Request) {
  if (!isValidPasscode(passcodeFromRequest(request))) {
    return NextResponse.json(
      { ok: false, error: "دسترسی غیرمجاز." },
      { status: 401 },
    );
  }

  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "شناسه پیام نامعتبر است." },
      { status: 400 },
    );
  }

  await db.feedback
    .delete({ where: { id } })
    .catch(() => null /* already gone — treat as success */);
  return NextResponse.json({ ok: true });
}
