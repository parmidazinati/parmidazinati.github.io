import { Ambient } from "./ambient";
import { Header } from "./header";
import { Hero } from "./hero";
import { About } from "./about";
import { QuantumSection } from "./quantum-section";
import { FocusAreas } from "./focus-areas";
import { Contact } from "./contact";
import { Footer } from "./footer";
import type { SiteContent } from "@/lib/site-content";

export function Site({
  content,
  onOpenAdmin,
}: {
  content: SiteContent;
  onOpenAdmin?: () => void;
}) {
  return (
    <div className="relative flex min-h-svh flex-col overflow-x-clip">
      {/* skip link for keyboard & screen-reader users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[70] focus:rounded-xl focus:bg-aqua focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-[#03121a]"
      >
        پرش به محتوای اصلی
      </a>

      <Ambient />
      <Header />

      <main id="main" className="flex-1">
        <Hero content={content.hero} />
        <About content={content.about} />
        <QuantumSection content={content.quantum} />
        <FocusAreas content={content.focus} />
        <Contact content={content.contact} />
      </main>

      <Footer onManage={onOpenAdmin} />
    </div>
  );
}
