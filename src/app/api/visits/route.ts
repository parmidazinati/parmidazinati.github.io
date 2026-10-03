import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const COUNTER_KEY = "site";

/** Read the counter row, creating it on first use. */
async function ensureRow() {
  return db.visitCounter.upsert({
    where: { key: COUNTER_KEY },
    create: { key: COUNTER_KEY, count: 0 },
    update: {},
  });
}

/**
 * GET /api/visits — current visitor count (no increment).
 */
export async function GET() {
  const row = await ensureRow();
  return NextResponse.json({ ok: true, count: row.count });
}

/**
 * POST /api/visits — count one visit and return the new total.
 * The client only calls this once per browser session.
 */
export async function POST() {
  const row = await db.visitCounter.upsert({
    where: { key: COUNTER_KEY },
    create: { key: COUNTER_KEY, count: 1 },
    update: { count: { increment: 1 } },
  });
  return NextResponse.json({ ok: true, count: row.count });
}
