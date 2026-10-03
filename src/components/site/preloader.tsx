"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SkipForward } from "lucide-react";

/**
 * Cinematic boot screen: a single terminal box that literally FILLS UP with
 * code — lines type in one by one while a soft glow rises inside the box.
 * When the box is full, the site appears. Skippable (button / Escape) and
 * honors prefers-reduced-motion with a short static version.
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

  /* typing engine — reduced motion fills the box instantly */
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

  /* brief beat once the box is full, then hand over to the site */
  useEffect(() => {
    if (typed < TOTAL_CHARS) return;
    const timer = setTimeout(() => finish(), reduce ? 1400 : 650);
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
  const full = typed >= TOTAL_CHARS;
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
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden bg-[#050a14] px-4"
    >
      {/* backdrop: dotted grid + brand glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.55)_1px,transparent_0)] [background-size:26px_26px]" />
        <div className="absolute -top-28 start-[18%] h-80 w-80 rounded-full bg-aqua/[0.09] blur-[120px]" />
        <div className="absolute -bottom-24 end-[18%] h-80 w-80 rounded-full bg-lagoon/[0.09] blur-[120px]" />
      </div>

      {/* ----------------------- the filling terminal box ----------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`glass relative z-10 w-full max-w-xl overflow-hidden rounded-2xl shadow-[0_40px_90px_-30px_rgba(2,8,20,0.95)] transition-shadow duration-500 ${
          full ? "ring-1 ring-aqua/40" : ""
        }`}
      >
        {/* title bar — dots, label and live fill percentage */}
        <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-lagoon/70" />
          <span className="ms-3 font-mono text-[11px] text-fog" dir="ltr">
            quantum — zsh
          </span>
          <span
            className="ms-auto font-mono text-[11px] tabular-nums text-aqua"
            dir="ltr"
          >
            {percent}%
          </span>
        </div>

        {/* code area — fixed height so the box visibly FILLS from empty */}
        <div
          dir="ltr"
          className="relative h-[15.5rem] px-4 py-4 font-mono text-[12.5px] leading-6 sm:text-[13px]"
          aria-hidden="true"
        >
          {/* rising glow = how full the box is */}
          <div
            className="absolute inset-x-0 bottom-0 bg-linear-to-t from-aqua/[0.12] via-aqua/[0.05] to-transparent shadow-[0_-1px_0_0_rgba(34,211,238,0.35)] transition-[height] duration-100 ease-linear"
            style={{ height: `${percent}%` }}
          />

          {/* the code being written */}
          <div className="relative">
            {visible.map(
              (line, index) =>
                line && (
                  <p
                    key={index}
                    className={`whitespace-pre-wrap ${line.className ?? "text-fog"}`}
                  >
                    {line.text}
                    {index === lastVisibleIndex && !full && (
                      <span className="ms-0.5 inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-aqua/80" />
                    )}
                  </p>
                ),
            )}
            {full && (
              <p className="text-lagoon">
                <span className="inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-lagoon/80" />
              </p>
            )}
          </div>
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

      <span aria-live="polite" className="sr-only">
        سایت در حال بارگذاری است.
      </span>
    </motion.div>
  );
}
