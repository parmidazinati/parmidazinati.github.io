/**
 * Server-only site content access (Prisma-backed key/value store).
 * Import this from server components and API routes only.
 */

import { db } from "@/lib/db";
import {
  DEFAULT_CONTENT,
  SITE_SECTIONS,
  normalizeContent,
  type SiteContent,
  type SiteSection,
} from "@/lib/site-content";

/** Read the persisted content from the DB, falling back to defaults. */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const rows = await db.siteSetting.findMany({
      where: { key: { in: [...SITE_SECTIONS] } },
    });

    if (rows.length === 0) return DEFAULT_CONTENT;

    const stored: Record<string, unknown> = {};
    for (const row of rows) {
      try {
        stored[row.key] = JSON.parse(row.value);
      } catch {
        /* corrupted row — ignore, defaults fill the gap */
      }
    }

    return normalizeContent(stored);
  } catch {
    /* DB unavailable (e.g. during build) — serve defaults instead of crashing */
    return DEFAULT_CONTENT;
  }
}

/** Persist the given content sections as JSON rows (upsert). */
export async function saveSiteContent(content: SiteContent): Promise<void> {
  const payload: { key: SiteSection; value: string }[] = [
    { key: "hero", value: JSON.stringify(content.hero) },
    { key: "about", value: JSON.stringify(content.about) },
    { key: "quantum", value: JSON.stringify(content.quantum) },
    { key: "focus", value: JSON.stringify(content.focus) },
    { key: "contact", value: JSON.stringify(content.contact) },
    { key: "sections", value: JSON.stringify(content.sections) },
  ];

  await db.$transaction(
    payload.map((row) =>
      db.siteSetting.upsert({
        where: { key: row.key },
        create: { key: row.key, value: row.value },
        update: { value: row.value },
      }),
    ),
  );
}
