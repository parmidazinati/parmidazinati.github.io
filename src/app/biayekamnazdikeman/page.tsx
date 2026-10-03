import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/admin-panel";
import { getSiteContent } from "@/lib/site-content-server";

/**
 * Private admin route — intentionally unlisted and hard to guess.
 * Not indexed (noindex + robots.txt) and never linked from the public site.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  robots: { index: false, follow: false },
};

export default async function AdminRoute() {
  const content = await getSiteContent();
  return <AdminPanel initialContent={content} />;
}
