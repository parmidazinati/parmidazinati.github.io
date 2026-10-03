import Image from "next/image";
import {
  BrainCircuit,
  Code2,
  Compass,
  GraduationCap,
} from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import type { SiteContent } from "@/lib/site-content";

/* icons cycle across whatever cards the admin configures */
const CARD_ICONS = [Compass, GraduationCap, BrainCircuit, Code2] as const;

export function FocusAreas({ content }: { content: SiteContent["focus"] }) {
  return (
    <section
      id="focus"
      aria-labelledby="focus-title"
      className="relative py-24 sm:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="focus-title"
          eyebrow="مسیرهای من"
          title="حوزه‌های تمرکز"
        />

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {content.cards.map((area, i) => {
            const Icon = CARD_ICONS[i % CARD_ICONS.length];
            return (
              <li key={area.title}>
                <Reveal delay={i * 0.08} className="h-full">
                  <article className="glass group relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1.5 hover:border-aqua/25 hover:shadow-[0_30px_70px_-24px_rgba(2,8,20,0.9),0_0_0_1px_rgba(34,211,238,0.12)]">
                    {/* ------------------------------ image ------------------------------ */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={area.image}
                        alt={area.alt}
                        width={1344}
                        height={768}
                        loading="lazy"
                        sizes="(max-width: 640px) 92vw, (max-width: 1280px) 46vw, 300px"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                      {/* legibility gradient over the image */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-linear-to-t from-[#050a14] via-[#050a14]/25 to-transparent"
                      />
                      {/* icon chip overlapping the content area */}
                      <span className="glass-strong absolute -bottom-6 start-5 flex h-12 w-12 items-center justify-center rounded-2xl text-aqua shadow-[0_14px_36px_-10px_rgba(2,8,20,0.9)] transition-all duration-500 group-hover:text-lagoon group-hover:shadow-[0_14px_36px_-8px_rgba(45,212,191,0.45)]">
                        <Icon size={20} aria-hidden="true" />
                      </span>
                    </div>

                    {/* ----------------------------- content ----------------------------- */}
                    <div className="flex flex-1 flex-col gap-2 p-5 pt-9">
                      <h3 className="text-lg font-bold text-ink transition-colors duration-300 group-hover:text-aqua">
                        {area.title}
                      </h3>
                      <p className="text-sm leading-7 text-fog">
                        {area.concept}
                      </p>
                    </div>

                    {/* hover accent line */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-px origin-center scale-x-0 bg-linear-to-l from-transparent via-aqua to-transparent transition-transform duration-500 group-hover:scale-x-100"
                    />
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
