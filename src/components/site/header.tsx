"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Eye, Menu, X } from "lucide-react";
import { QuantumMark } from "./quantum-mark";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "#home", id: "home", label: "خانه" },
  { href: "#about", id: "about", label: "درباره من" },
  { href: "#quantum", id: "quantum", label: "کوانتوم" },
  { href: "#focus", id: "focus", label: "حوزه‌های تمرکز" },
  { href: "#contact", id: "contact", label: "ارتباط با من" },
] as const;

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

/* sessionStorage flag — one counted visit per browser session */
const VISIT_FLAG = "pz-visit-counted";

/** Persian digit formatting for the counter (fallback: plain number). */
function faNumber(value: number): string {
  try {
    return new Intl.NumberFormat("fa-IR").format(value);
  } catch {
    return String(value);
  }
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [visits, setVisits] = useState<number | null>(null);
  const reduce = useReducedMotion();

  /* elevate the glass bar after scrolling */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* lightweight scroll-spy for the active nav item */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* visitor counter — POST once per browser session, then read-only */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const counted = sessionStorage.getItem(VISIT_FLAG) === "1";
        sessionStorage.setItem(VISIT_FLAG, "1");
        const res = await fetch("/api/visits", {
          method: counted ? "GET" : "POST",
          cache: "no-store",
        });
        const data = (await res.json().catch(() => null)) as {
          ok?: boolean;
          count?: number;
        } | null;
        if (!cancelled && data?.ok && typeof data.count === "number") {
          setVisits(data.count);
        }
      } catch {
        /* the counter is non-critical — stay silent */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* lock body scroll + close on Escape while the mobile menu is open */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const closeMenu = useCallback(() => setOpen(false), []);

  const visitLabel = visits === null ? "—" : faNumber(visits);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-white/[0.07] bg-[#050a14]/70 shadow-[0_10px_40px_-12px_rgba(2,8,20,0.8)] backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      {/* layered backdrop — appears under the bar, closes the menu on click */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu-backdrop"
            initial={reduce ? { opacity: 0 } : { opacity: 0, backdropFilter: "blur(0px)" }}
            animate={
              reduce ? { opacity: 1 } : { opacity: 1, backdropFilter: "blur(4px)" }
            }
            exit={reduce ? { opacity: 0 } : { opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            onClick={closeMenu}
            aria-hidden="true"
            className="fixed inset-0 z-0 bg-[#020409]/60 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 md:h-[72px]">
        {/* brand — logo + name */}
        <a
          href="#home"
          onClick={closeMenu}
          className="group flex min-h-11 items-center gap-3"
          aria-label="پارمیدا زینتی — بازگشت به بالای صفحه"
        >
          <span className="relative">
            <QuantumMark
              size={34}
              className="transition-transform duration-500 group-hover:rotate-[18deg]"
            />
            <span className="absolute inset-0 -z-10 rounded-full bg-aqua/25 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold text-ink">
              پارمیدا زینتی
            </span>
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-fog/90">
              Quantum
            </span>
          </span>
        </a>

        {/* desktop navigation */}
        <nav aria-label="ناوبری اصلی" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  aria-current={active === item.id ? "true" : undefined}
                  className={cn(
                    "relative flex min-h-11 items-center rounded-xl px-4 text-sm font-medium transition-colors duration-300",
                    active === item.id
                      ? "text-aqua"
                      : "text-fog hover:text-ink"
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-4 -bottom-0.5 h-px bg-linear-to-l from-transparent via-aqua to-transparent transition-opacity duration-300",
                      active === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* desktop visitor counter chip */}
        <span
          title="تعداد بازدید سایت"
          className="hidden items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-3.5 py-2 text-[13px] text-fog backdrop-blur-xl lg:inline-flex"
        >
          <Eye size={14} aria-hidden="true" className="text-aqua" />
          <span className="font-mono font-semibold tabular-nums text-ink">
            {visitLabel}
          </span>
          <span className="sr-only">بازدیدکننده</span>
        </span>

        {/* mobile menu trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          className="glass flex min-h-11 w-11 items-center justify-center rounded-xl text-ink transition-colors hover:bg-white/[0.09] lg:hidden"
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {/* mobile menu panel — opens in layers: backdrop → panel → sheen → items */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            id="mobile-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.97 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2, ease: "easeIn" } }
            }
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="glass-strong relative z-10 mx-4 mt-1 overflow-hidden rounded-3xl p-3 shadow-[0_24px_70px_-20px_rgba(2,8,20,0.9)] lg:hidden"
          >
            {/* layer 1 — aqua hairline on the top edge */}
            {!reduce && (
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0, scaleX: 0.2 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.12, duration: 0.45, ease: "easeOut" }}
                className="absolute inset-x-6 top-0 h-px bg-linear-to-l from-transparent via-aqua/70 to-transparent"
              />
            )}

            {/* layer 2 — soft light sweep across the panel */}
            {!reduce && (
              <motion.span
                aria-hidden="true"
                initial={{ x: "-130%" }}
                animate={{ x: "230%" }}
                transition={{ delay: 0.28, duration: 0.85, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-y-0 start-0 w-1/2 bg-linear-to-r from-transparent via-white/[0.07] to-transparent"
              />
            )}

            <nav aria-label="ناوبری موبایل">
              {/* layer 3 — stair-step cascade of the items */}
              <ul className="relative flex flex-col">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={
                      reduce ? undefined : { opacity: 0, x: 30, y: -8 }
                    }
                    animate={reduce ? undefined : { opacity: 1, x: 0, y: 0 }}
                    exit={
                      reduce
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            x: 18,
                            transition: {
                              duration: 0.14,
                              delay: (NAV_ITEMS.length - 1 - i) * 0.025,
                              ease: "easeIn",
                            },
                          }
                    }
                    transition={{
                      delay: 0.07 + i * 0.062,
                      duration: 0.34,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                  >
                    <a
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active === item.id ? "true" : undefined}
                      className={cn(
                        "flex min-h-12 items-center justify-between rounded-2xl px-4 text-[15px] font-medium transition-colors",
                        active === item.id
                          ? "bg-white/[0.06] text-aqua"
                          : "text-fog hover:bg-white/[0.04] hover:text-ink"
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-1.5 w-1.5 rounded-full bg-aqua transition-opacity",
                          active === item.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </a>
                  </motion.li>
                ))}

                {/* visitor counter item — the final stair */}
                <motion.li
                  initial={reduce ? undefined : { opacity: 0, x: 30, y: -8 }}
                  animate={reduce ? undefined : { opacity: 1, x: 0, y: 0 }}
                  exit={
                    reduce
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          x: 18,
                          transition: { duration: 0.14, ease: "easeIn" },
                        }
                  }
                  transition={{
                    delay: 0.07 + NAV_ITEMS.length * 0.062,
                    duration: 0.34,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  aria-label="تعداد بازدیدکنندگان سایت"
                >
                  <div className="flex min-h-12 items-center justify-between rounded-2xl px-4 text-[15px] font-medium text-fog">
                    <span className="flex items-center gap-2.5">
                      <Eye size={16} aria-hidden="true" className="text-aqua" />
                      بازدیدکنندگان
                    </span>
                    <span className="font-mono text-sm font-semibold tabular-nums text-ink">
                      {visitLabel}
                      <span className="ms-1.5 font-sans text-xs font-normal text-fog">
                        نفر
                      </span>
                    </span>
                  </div>
                </motion.li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
