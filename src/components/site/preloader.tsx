"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SkipForward } from "lucide-react";

/**
 * Premium cinematic boot screen — AI-lab / datacenter style.
 *
 * Stage 1  brand name fades in with a soft neon glow
 * Stage 2  "loading" with living dots, two lines below the name
 * Stage 3  a professional progress bar (0% → 100%, numeric readout) whose
 *          fill streams programming glyphs ({} <> () [] == === && ||), types
 *          a boot line and carries a moving sheen + bright frontier
 * End      at 100% the status swaps to "System Ready", then the whole screen
 *          zoom-fades away into the site.
 *
 * Backdrop: matte-black field with a subtle particle system and a faint
 * scan-line sweep. Skippable (button / Escape), honors prefers-reduced-motion.
 */

/* deterministic PRNG so server & client render identical particles */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(1404);
const PARTICLES = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  left: rand() * 100,
  top: rand() * 100,
  size: 1 + rand() * 2.4,
  duration: 10 + rand() * 14,
  delay: -rand() * 20,
  opacity: 0.1 + rand() * 0.26,
  tone: i % 3,
}));
const TONE_CLASSES = ["bg-aqua", "bg-lagoon", "bg-ink"] as const;

/* the data flowing through the bar */
const GLYPH_STREAM =
  "{} <> () [] == === && || => </> 01 ; :: {quantum} <ui/ux> (design) [code]".repeat(
    8,
  );

/* boot line typed inside the fill while the bar grows */
const BOOT_LINE = "> boot quantum.core --ui {} <> () [] == === && ||";

export function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();

  const finishedRef = useRef(false);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const [progress, setProgress] = useState(0);
  const full = progress >= 100;

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onDoneRef.current();
  }, []);

  /* lock page scroll while the intro plays */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  /* Escape also skips */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  /* progress engine — 0 → 100 in roughly four seconds */
  useEffect(() => {
    const id = setInterval(
      () =>
        setProgress((prev) => {
          const next = reduce ? 100 : prev + 1;
          if (next >= 100) clearInterval(id);
          return Math.min(next, 100);
        }),
      reduce ? 0 : 38,
    );
    return () => clearInterval(id);
  }, [reduce, finish]);

  /* a beat on "System Ready", then hand over to the site */
  useEffect(() => {
    if (!full) return;
    const timer = setTimeout(() => finish(), reduce ? 1400 : 1150);
    return () => clearTimeout(timer);
  }, [full, reduce, finish]);

  const typed = Math.round((progress / 100) * BOOT_LINE.length);

  return (
    <motion.div
      role="status"
      aria-label="در حال آماده‌سازی سایت"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[90] overflow-hidden bg-[#050a14]"
    >
      {/* ------------- backdrop: particles, scan line, glows ------------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.1] [background-image:radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.5)_1px,transparent_0)] [background-size:30px_30px]" />
        <div className="absolute -top-32 start-1/2 h-96 w-[42rem] max-w-[95vw] -translate-x-1/2 rounded-full bg-aqua/[0.07] blur-[130px]" />
        <div className="absolute -bottom-28 start-1/2 h-80 w-[36rem] max-w-[90vw] -translate-x-1/2 rounded-full bg-iris/[0.06] blur-[120px]" />

        {/* particle system — very subtle floating light dots */}
        {!reduce &&
          PARTICLES.map((p) => (
            <span
              key={p.id}
              className={`animate-particle absolute rounded-full blur-[0.5px] ${TONE_CLASSES[p.tone]}`}
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                opacity: p.opacity,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}

        {/* faint scan-line sweep */}
        {!reduce && (
          <div className="animate-scanline absolute inset-x-0 top-0 h-16 bg-linear-to-b from-transparent via-aqua/[0.06] to-transparent" />
        )}
      </div>

      {/* ------------------------- center stage ------------------------- */}
      <div className="relative flex h-full w-full flex-col items-center justify-center px-4">
        {/* stage 1 — brand name, fade in + glow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative text-center"
        >
          <div
            aria-hidden="true"
            className="animate-pulse-soft absolute start-1/2 top-1/2 -z-10 h-32 w-96 max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-aqua/[0.14] blur-[80px]"
          />
          <h1 className="text-5xl font-black leading-[1.2] text-ink drop-shadow-[0_0_28px_rgba(34,211,238,0.35)] sm:text-6xl">
            پارمیدا <span className="text-gradient">زینتی</span>
          </h1>
        </motion.div>

        {/* stage 2 — living "loading" → "System Ready", two lines below */}
        <div
          className="mt-7 flex h-6 items-center justify-center sm:mt-8"
          dir="ltr"
          aria-hidden="true"
        >
          <AnimatePresence mode="wait" initial={false}>
            {!full ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28 }}
                className="font-mono text-sm font-medium tracking-[0.5em] text-fog sm:text-base"
              >
                loading
                <span className="text-aqua">
                  <span className="animate-loading-dots">.</span>
                  <span className="animate-loading-dots [animation-delay:-0.8s]">
                    .
                  </span>
                  <span className="animate-loading-dots [animation-delay:-0.4s]">
                    .
                  </span>
                </span>
              </motion.span>
            ) : (
              <motion.span
                key="ready"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="font-mono text-sm font-bold tracking-[0.42em] text-lagoon drop-shadow-[0_0_14px_rgba(45,212,191,0.75)] sm:text-base"
              >
                System Ready
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* stage 3 — the data-stream progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
          className="mt-8 w-full max-w-lg"
        >
          <div
            role="progressbar"
            aria-label="پیشرفت بارگذاری سایت"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            dir="ltr"
            className={`glass relative h-14 w-full overflow-hidden rounded-2xl transition-shadow duration-500 ${
              full
                ? "shadow-[0_0_44px_-6px_rgba(34,211,238,0.45)]"
                : "shadow-[0_24px_70px_-30px_rgba(2,8,20,0.95)]"
            }`}
          >
            {/* dim glyph stream across the whole track */}
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center overflow-hidden"
            >
              <span className="animate-stream inline-block whitespace-nowrap font-mono text-[11px] text-ink/25">
                {GLYPH_STREAM}
                {GLYPH_STREAM}
              </span>
            </div>

            {/* the fill — clipped home of the data stream */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 overflow-hidden transition-[width] duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-aqua/90 via-electric/75 to-lagoon/90" />
              <div className="absolute inset-0 flex flex-col justify-center gap-0.5">
                <span className="animate-stream-rev inline-block whitespace-nowrap font-mono text-[11px] font-semibold text-[#03121a]/80">
                  {GLYPH_STREAM}
                  {GLYPH_STREAM}
                </span>
                <span className="inline-block whitespace-nowrap px-3 font-mono text-[11px] font-semibold text-[#03121a]/85">
                  {BOOT_LINE.slice(0, typed)}
                  <span className="animate-pulse">▌</span>
                </span>
              </div>
              {/* travelling sheen */}
              <div className="animate-bar-sheen absolute inset-y-0 w-14 bg-white/25 blur-md" />
              {/* bright frontier line */}
              <div className="absolute inset-y-0 right-0 w-[2px] bg-white shadow-[0_0_16px_4px_rgba(34,211,238,0.8)]" />
            </div>

            {/* numeric readout inside the bar */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-[#050a14]/80 px-2 py-1 font-mono text-sm font-bold tabular-nums text-ink ring-1 ring-white/10 backdrop-blur-sm">
              {progress}%
            </span>
          </div>
        </motion.div>

        {/* skip */}
        <button
          type="button"
          onClick={finish}
          className="relative z-10 mt-7 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs text-fog/80 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-aqua/60"
        >
          <SkipForward size={13} aria-hidden="true" />
          رد شدن
          <kbd className="hidden rounded-md border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] sm:inline">
            Esc
          </kbd>
        </button>
      </div>

      <span aria-live="polite" className="sr-only">
        {full ? "سایت آماده شد." : "سایت در حال بارگذاری است."}
      </span>
    </motion.div>
  );
}
