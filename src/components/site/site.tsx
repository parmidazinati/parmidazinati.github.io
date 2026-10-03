import { LockKeyhole } from "lucide-react";
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

      {/* floating admin entry — always reachable without scrolling */}
      {onOpenAdmin && (
        <button
          type="button"
          onClick={onOpenAdmin}
          aria-label="ورود به پنل مدیریت سایت"
          className="glass fixed bottom-4 start-4 z-40 flex h-11 items-center gap-2 rounded-2xl px-4 text-[13px] font-semibold text-fog opacity-85 shadow-[0_14px_40px_-14px_rgba(2,8,20,0.85)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-aqua/30 hover:opacity-100 hover:text-ink hover:shadow-[0_18px_50px_-14px_rgba(34,211,238,0.35)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-aqua/60"
        >
          <LockKeyhole size={14} className="text-aqua" aria-hidden="true" />
          پنل مدیریت
        </button>
      )}

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
