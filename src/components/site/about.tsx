import {
  GraduationCap,
  MapPin,
  Palette,
  Sparkles,
  User,
} from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import type { SiteContent } from "@/lib/site-content";

/* icons cycle across whatever rows the admin configures */
const ROW_ICONS = [User, Palette, GraduationCap, MapPin, Sparkles] as const;

export function About({
  content,
  heading,
}: {
  content: SiteContent["about"];
  heading: SiteContent["sections"]["about"];
}) {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative py-24 sm:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading id="about-title" eyebrow={heading.eyebrow} title={heading.title} />

        <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* -------------------------- profile glass card -------------------------- */}
          <Reveal>
            <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
              {/* soft corner glow */}
              <div
                aria-hidden="true"
                className="absolute -top-24 -end-24 h-56 w-56 rounded-full bg-aqua/[0.08] blur-3xl"
              />
              <ul className="relative flex flex-col gap-1">
                {content.rows.map((row, index) => {
                  const Icon = ROW_ICONS[index % ROW_ICONS.length];
                  return (
                    <li key={row}>
                      <div className="group flex items-center gap-4 rounded-2xl px-3 py-3.5 transition-colors duration-300 hover:bg-white/[0.04]">
                        <span className="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-aqua transition-shadow duration-300 group-hover:shadow-[0_0_20px_-2px_rgba(34,211,238,0.35)]">
                          <Icon size={19} aria-hidden="true" />
                        </span>
                        <span className="text-[15px] font-medium leading-7 text-ink sm:text-base">
                          {row}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>

          {/* ----------------------------- interests panel ---------------------------- */}
          <Reveal delay={0.12}>
            <div className="glass relative h-full overflow-hidden rounded-3xl p-6 sm:p-8">
              <div
                aria-hidden="true"
                className="absolute -bottom-24 -start-24 h-56 w-56 rounded-full bg-lagoon/[0.07] blur-3xl"
              />
              <h3 className="relative mb-5 text-lg font-bold text-ink">
                {heading.interestsTitle}
              </h3>
              <ul className="relative flex flex-wrap gap-2.5">
                {content.interests.map((interest) => (
                  <li
                    key={interest}
                    className="glass-chip text-[13px] text-fog transition-colors duration-300 hover:border-aqua/30 hover:text-ink"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full bg-aqua"
                    />
                    {interest}
                  </li>
                ))}
              </ul>
              <p className="relative mt-6 text-sm leading-7 text-fog">
                {content.interestsNote}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
