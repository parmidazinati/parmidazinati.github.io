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
  booted = true,
  onOpenAdmin,
}: {
  content: SiteContent;
  /** true once the intro preloader has finished — gates entrance animations */
  booted?: boolean;
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

      {/* owner entry to the admin panel — discreet vertical tab fixed to the
          right edge of the viewport, always reachable without scrolling */}
      {onOpenAdmin && (
        <button
          type="button"
          onClick={onOpenAdmin}
          aria-label="ورود به پنل مدیریت سایت"
          title="ورود به پنل مدیریت"
          className="glass fixed start-0 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-2.5 rounded-e-2xl border-s-0 px-2.5 py-4 text-fog opacity-80 shadow-[0_14px_40px_-14px_rgba(2,8,20,0.85)] backdrop-blur-xl transition-all duration-300 hover:ps-3.5 hover:opacity-100 hover:text-ink hover:shadow-[0_18px_50px_-14px_rgba(34,211,238,0.35)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-aqua/60"
        >
          <LockKeyhole size={14} className="text-aqua" aria-hidden="true" />
          <span className="text-[11px] font-semibold tracking-wide [writing-mode:vertical-rl]">
            مدیریت سایت
          </span>
        </button>
      )}

      <main id="main" className="flex-1">
        <Hero content={content.hero} booted={booted} />
        <About content={content.about} />
        <QuantumSection content={content.quantum} />
        <FocusAreas content={content.focus} />
        <Contact content={content.contact} />
      </main>

      <Footer />
    </div>
  );
}
