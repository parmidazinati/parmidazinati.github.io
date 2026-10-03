import { SiteShell } from "@/components/site/site-shell";
import { getSiteContent } from "@/lib/site-content-server";

/* always render fresh content from the database */
export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ admin?: string }>;
}) {
  const [content, params] = await Promise.all([
    getSiteContent(),
    searchParams,
  ]);

  return <SiteShell content={content} initialAdmin={params.admin === "1"} />;
}
