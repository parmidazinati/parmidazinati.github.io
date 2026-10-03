import { SiteShell } from "@/components/site/site-shell";
import { getSiteContent } from "@/lib/site-content-server";

/* always render fresh content from the database */
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();
  return <SiteShell content={content} />;
}
