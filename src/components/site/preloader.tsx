"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SkipForward } from "lucide-react";
import { QuantumMark } from "./quantum-mark";

/**
 * Cinematic boot screen: a fake terminal "compiles" the designer profile
 * while a progress bar fills up. Shown once per page load, before the
 * public site animates in. Fully skippable (button / Escape) and honors
 * prefers-reduced-motion by showing the finished state briefly instead
 * of the typing animation.
 */

type CodeLine = { text: string; className?: string };

const CODE_LINES: CodeLine[] = [
  { text: "$ quantum init --designer", className: "text-aqua" },
  { text: "> loading profile ... Parmida Zinati", className: "text-fog" },
  { text: "const designer = {", className: "text-ink" },
  { text: '  name:  "Parmida Zinati",', className: "text-fog" },
  { text: '  role:  "UI/UX Designer",', className: "text-fog" },
  { text: '  brand: "Quantum",', className: "text-fog" },
  { text: "};", className: "text-ink" },
  { text: "> compiling experiences ...", className: "text-fog" },
  { text: "\u2713 experience ready \u2014 welcome!", className: "text-lagoon" },
];

const TOTAL_CHARS = CODE_LINES.reduce(
  (sum, line) => sum + line.text.length + 1,
  0,
);

/** Pre-computed character offsets ([start, end)) for every code line. */
const LINE_OFFSETS = CODE_LINES.map((_, index) => ({
  start: CODE_LINES.slice(0, index).reduce(
    (sum, line) => sum + line.text.length + 1,
    0,
  ),
}));

export function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();

  const finishedRef = useRef(false);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const [typed, setTyped] = useState(0);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onDoneRef.current();
  }, []);

  /* lock page scroll while the intro is playing */
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

  /* typing engine — reduced motion jumps straight to the finished state */
  useEffect(() => {
    const id = setInterval(
      () => {
        setTyped((prev) => {
          const next = reduce ? TOTAL_CHARS : prev + 3;
          if (next >= TOTAL_CHARS) clearInterval(id);
          return Math.min(next, TOTAL_CHARS);
        });
      },
      reduce ? 0 : 16,
    );
    return () => clearInterval(id);
  }, [reduce, finish]);

  /* brief beat after the code finishes, then hand over to the site */
  useEffect(() => {
    if (typed < TOTAL_CHARS) return;
    const timer = setTimeout(() => finish(), reduce ? 1400 : 620);
    return () => clearTimeout(timer);
  }, [typed, reduce, finish]);

  /* derive the visible slice of code from the typed character count */
  const visible = useMemo(
    () =>
      CODE_LINES.map((line, index) => {
        const start = LINE_OFFSETS[index].start;
        if (typed <= start) return null;
        const take = Math.min(typed - start, line.text.length);
        return {
          text: line.text.slice(0, take),
          className: line.className,
          active: take < line.text.length,
        };
      }),
    [typed],
  );

  const percent = Math.min(100, Math.round((typed / TOTAL_CHARS) * 100));
  const lastVisibleIndex = visible.reduce(
    (last, line, index) => (line ? index : last),
    -1,
  );

  return (
    <motion.div
      role="status"
      aria-label="در حال آماده‌سازی سایت"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -70, filter: "blur(10px)" }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-7 overflow-hidden bg-[#050a14] px-4"
    >
      {/* backdrop: dotted grid + brand glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.55)_1px,transparent_0)] [background-size:26px_26px]" />
        <div className="absolute -top-28 start-[18%] h-80 w-80 rounded-full bg-aqua/[0.09] blur-[120px]" />
        <div className="absolute -bottom-24 end-[18%] h-80 w-80 rounded-full bg-lagoon/[0.09] blur-[120px]" />
      </div>

      {/* brand */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-3 text-center"
      >
        <span className="relative flex h-16 w-16 items-center justify-center">
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full bg-aqua/20"
          />
          <span className="glass relative flex h-14 w-14 items-center justify-center rounded-2xl">
            <QuantumMark size={30} />
          </span>
        </span>
        <div>
          <p className="text-base font-extrabold text-ink">پارمیدا زینتی</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.34em] text-fog">
            Quantum
          </p>
        </div>
      </motion.div>

      {/* terminal */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
        className="glass relative z-10 w-full max-w-xl overflow-hidden rounded-2xl shadow-[0_40px_90px_-30px_rgba(2,8,20,0.95)]"
      >
        {/* title bar */}
        <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-lagoon/70" />
          <span className="ms-3 font-mono text-[11px] text-fog" dir="ltr">
            quantum — zsh
          </span>
        </div>

        {/* code body — fixed min height so the layout never jumps */}
        <div
          dir="ltr"
          className="min-h-[15rem] px-4 py-4 font-mono text-[12.5px] leading-6 sm:min-h-[15.5rem] sm:text-[13px]"
          aria-hidden="true"
        >
          {visible.map(
            (line, index) =>
              line && (
                <p
                  key={index}
                  className={`${line.className ?? "text-fog"} whitespace-pre-wrap`}
                >
                  {line.text}
                  {index === lastVisibleIndex && typed < TOTAL_CHARS && (
                    <span className="ms-0.5 inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-aqua/80" />
                  )}
                </p>
              ),
          )}
          {typed >= TOTAL_CHARS && (
            <p className="text-lagoon">
              <span className="inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-lagoon/80" />
            </p>
          )}
        </div>

        {/* progress */}
        <div className="flex items-center gap-3 border-t border-white/[0.07] bg-white/[0.03] px-4 py-3">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label="پیشرفت بارگذاری"
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-aqua to-lagoon transition-[width] duration-100 ease-linear"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="font-mono text-[11px] tabular-nums text-fog" dir="ltr">
            {percent}%
          </span>
        </div>
      </motion.div>

      {/* skip */}
      <button
        type="button"
        onClick={finish}
        className="relative z-10 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs text-fog/80 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-aqua/60"
      >
        <SkipForward size={13} aria-hidden="true" />
        رد شدن
        <kbd className="hidden rounded-md border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] sm:inline">
          Esc
        </kbd>
      </button>

      <span aria-live="polite" className="sr-only">
        سایت در حال بارگذاری است.
      </span>
    </motion.div>
  );
}
