import {
  GraduationCap,
  MapPin,
  Palette,
  Sparkles,
  User,
} from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const PROFILE_ROWS = [
  { icon: User, label: "پارمیدا زینتی" },
  { icon: Palette, label: "طراح UI/UX" },
  { icon: GraduationCap, label: "فارغ‌التحصیل مهندسی کامپیوتر" },
  { icon: MapPin, label: "ساکن قائمشهر، ایران" },
  {
    icon: Sparkles,
    label: "علاقه‌مند به طراحی، فناوری، یادگیری و ساختن آینده",
  },
] as const;

const INTERESTS = [
  "طراحی محصول دیجیتال",
  "تجربه کاربری",
  "فناوری",
  "هوش مصنوعی",
  "آموزش",
  "ساخت محصولات دیجیتال",
  "یادگیری مستمر",
  "آینده‌پژوهی و نوآوری",
] as const;

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative py-24 sm:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="about-title"
          eyebrow="پروفایل حرفه‌ای"
          title="درباره من"
        />

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
                {PROFILE_ROWS.map((row) => {
                  const Icon = row.icon;
                  return (
                    <li key={row.label}>
                      <div className="group flex items-center gap-4 rounded-2xl px-3 py-3.5 transition-colors duration-300 hover:bg-white/[0.04]">
                        <span className="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-aqua transition-shadow duration-300 group-hover:shadow-[0_0_20px_-2px_rgba(34,211,238,0.35)]">
                          <Icon size={19} aria-hidden="true" />
                        </span>
                        <span className="text-[15px] font-medium leading-7 text-ink sm:text-base">
                          {row.label}
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
                حوزه‌های مورد علاقه
              </h3>
              <ul className="relative flex flex-wrap gap-2.5">
                {INTERESTS.map((interest) => (
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
                این حوزه‌ها جهت‌گیری حرفه‌ای من را شکل می‌دهند؛ نقطه‌ای که
                طراحی، فناوری و نگاه انسانی در آن به هم می‌رسند.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
