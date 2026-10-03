import {
  BrainCircuit,
  Compass,
  GraduationCap,
  Palette,
  Rocket,
} from "lucide-react";
import { QuantumMark } from "./quantum-mark";
import { Reveal } from "./reveal";

const PILLARS = [
  { icon: Palette, label: "طراحی" },
  { icon: Compass, label: "استراتژی" },
  { icon: GraduationCap, label: "آموزش" },
  { icon: BrainCircuit, label: "هوش مصنوعی" },
  { icon: Rocket, label: "توسعه محصولات دیجیتال" },
] as const;

export function QuantumSection() {
  return (
    <section
      id="quantum"
      aria-labelledby="quantum-title"
      className="relative overflow-hidden py-24 sm:py-28"
    >
      {/* subtle brand gradient backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute start-1/2 top-0 h-px w-[min(48rem,80%)] -translate-x-1/2 bg-linear-to-l from-transparent via-white/[0.08] to-transparent" />
        <div className="absolute start-1/2 top-24 h-72 w-[36rem] max-w-[90vw] -translate-x-1/2 rounded-full bg-iris/[0.05] blur-[120px]" />
        <div className="absolute bottom-0 start-1/2 h-56 w-[30rem] max-w-[85vw] -translate-x-1/2 rounded-full bg-aqua/[0.05] blur-[110px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center sm:px-6">
        {/* ------------------------------ brand emblem ------------------------------ */}
        <Reveal>
          <div className="relative mb-8 flex items-center justify-center">
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

        <Reveal delay={0.08}>
          <span className="glass-chip mb-6 text-lagoon">
            <span className="h-1.5 w-1.5 rounded-full bg-lagoon shadow-[0_0_8px_2px_rgba(45,212,191,0.6)]" />
            برند در حال شکل‌گیری
          </span>
        </Reveal>

        <Reveal delay={0.12}>
          <h2
            id="quantum-title"
            className="font-mono text-5xl font-bold tracking-tight sm:text-6xl"
          >
            <span className="text-gradient">Quantum</span>
          </h2>
          <p className="mt-2 text-base font-semibold text-fog">کوانتوم</p>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-8 flex max-w-2xl flex-col gap-5 text-base leading-8 text-fog sm:text-lg sm:leading-9">
            <p>
              Quantum یک برند/شرکت در حال شکل‌گیری است که با هدف ایجاد ارتباط
              میان طراحی، استراتژی، آموزش، هوش مصنوعی و توسعه محصولات دیجیتال
              شکل گرفته است.
            </p>
            <p>
              تمرکز Quantum بر خلق راهکارهای معنادار، تجربه‌های دیجیتال مؤثر و
              توسعه دانش در حوزه فناوری و طراحی است.
            </p>
          </div>
        </Reveal>

        {/* -------------------------------- pillars -------------------------------- */}
        <Reveal delay={0.2} className="mt-12 w-full">
          <ul className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-3">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <li
                  key={pillar.label}
                  className="glass group flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-aqua/30 hover:shadow-[0_14px_40px_-14px_rgba(34,211,238,0.4)]"
                >
                  <Icon
                    size={17}
                    aria-hidden="true"
                    className="text-aqua transition-transform duration-300 group-hover:scale-110"
                  />
                  {pillar.label}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
