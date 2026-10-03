import { QuantumMark } from "./quantum-mark";
import { Reveal } from "./reveal";
import type { SiteContent } from "@/lib/site-content";

/**
 * The Quantum brand section is intentionally minimal and mysterious:
 * a secretive "...coming soon" line floating above the logo and name.
 */
export function QuantumSection({
  content,
}: {
  content: SiteContent["quantum"];
}) {
  return (
    <section
      id="quantum"
      aria-labelledby="quantum-title"
      className="relative overflow-hidden py-28 sm:py-36"
    >
      {/* subtle brand gradient backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute start-1/2 top-0 h-px w-[min(48rem,80%)] -translate-x-1/2 bg-linear-to-l from-transparent via-white/[0.08] to-transparent" />
        <div className="absolute start-1/2 top-24 h-72 w-[36rem] max-w-[90vw] -translate-x-1/2 rounded-full bg-iris/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 start-1/2 h-56 w-[30rem] max-w-[85vw] -translate-x-1/2 rounded-full bg-aqua/[0.05] blur-[110px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center sm:px-6">
        {/* --------------------------- mysterious teaser --------------------------- */}
        <Reveal>
          <p
            dir="ltr"
            className="animate-pulse-soft font-mono text-sm font-medium tracking-[0.42em] text-fog/90 sm:text-base"
          >
            {content.comingSoon}
          </p>
        </Reveal>

        {/* ------------------------------ brand emblem ------------------------------ */}
        <Reveal delay={0.12}>
          <div className="relative mt-12 flex items-center justify-center">
            {/* orbit rings around the mark */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-9 sm:-inset-12"
            >
              <div className="animate-orbit absolute inset-0 rounded-full border border-white/[0.07]">
                <span className="orbit-dot -top-1 start-1/2" />
              </div>
              <div className="animate-orbit-rev absolute -inset-4 rounded-full border border-dashed border-white/[0.05]" />
            </div>
            <div className="glass flex h-24 w-24 items-center justify-center rounded-3xl shadow-[0_24px_70px_-20px_rgba(2,8,20,0.9)] sm:h-28 sm:w-28">
              <QuantumMark size={56} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <h2
            id="quantum-title"
            className="mt-9 font-mono text-5xl font-bold tracking-tight sm:text-6xl"
          >
            <span className="text-gradient">Quantum</span>
          </h2>
        </Reveal>
      </div>
    </section>
  );
}
