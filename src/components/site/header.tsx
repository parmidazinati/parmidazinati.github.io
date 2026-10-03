"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
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

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");
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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-white/[0.07] bg-[#050a14]/70 shadow-[0_10px_40px_-12px_rgba(2,8,20,0.8)] backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 md:h-[72px]">
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

      {/* mobile menu panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="glass-strong mx-4 mt-1 rounded-3xl p-3 shadow-[0_24px_70px_-20px_rgba(2,8,20,0.9)] lg:hidden"
          >
            <nav aria-label="ناوبری موبایل">
              <ul className="flex flex-col">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={reduce ? undefined : { opacity: 0, x: 18 }}
                    animate={reduce ? undefined : { opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
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
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
