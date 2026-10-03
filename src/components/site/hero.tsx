"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDownLeft, ChevronDown, Sparkles } from "lucide-react";
import { QuantumMark } from "./quantum-mark";

const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE },
  },
};

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      aria-label="معرفی پارمیدا زینتی"
      className="relative flex min-h-svh items-center overflow-hidden pb-24 pt-32 sm:pt-36"
    >
      {/* local hero glow behind the portrait */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 end-[2%] h-96 w-96 rounded-full bg-aqua/[0.09] blur-[130px]" />
        <div className="absolute bottom-[-8%] start-[4%] h-80 w-80 rounded-full bg-lagoon/[0.07] blur-[140px]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* ------------------------------ text column ------------------------------ */}
        <motion.div
          variants={reduce ? undefined : container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-7"
        >
          <motion.span
            variants={reduce ? undefined : item}
            className="glass-chip text-aqua"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua" />
            </span>
            طراح UI/UX · بنیان‌گذار Quantum
          </motion.span>

          <motion.h1
            variants={reduce ? undefined : item}
            className="max-w-xl text-4xl font-black leading-[1.3] tracking-tight text-ink sm:text-5xl sm:leading-[1.28] xl:text-[3.4rem] xl:leading-[1.25]"
          >
            ایده‌های بزرگ را به{" "}
            <span className="text-gradient">تجربه‌های ماندگار</span> تبدیل
            می‌کنم.
          </motion.h1>

          <motion.p
            variants={reduce ? undefined : item}
            className="max-w-xl text-base leading-8 text-fog sm:text-lg sm:leading-9"
          >
            من پارمیدا زینتی هستم؛ طراح UI/UX، فارغ‌التحصیل مهندسی کامپیوتر و
            بنیان‌گذار کوانتوم. اینجا جایی است که طراحی، فناوری و نگاه انسانی
            به یک مسیر مشترک می‌رسند.
          </motion.p>

          <motion.div
            variants={reduce ? undefined : item}
            className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a href="#about" className="btn-primary group">
              بیشتر درباره من
              <ArrowDownLeft
                size={18}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:translate-y-0.5"
              />
            </a>
            <a href="#quantum" className="btn-glass">
              آشنایی با کوانتوم
            </a>
          </motion.div>
        </motion.div>

        {/* ---------------------------- portrait column ---------------------------- */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 24 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
          className="relative mx-auto w-full max-w-[400px] sm:max-w-[440px]"
        >
          {/* orbit system around the portrait */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-10 hidden sm:-inset-14 sm:block"
          >
            {/* circular orbit — fast */}
            <div className="animate-orbit absolute inset-0 rounded-full border border-white/[0.09]">
              <span className="orbit-dot -top-1 start-1/2" />
            </div>
            {/* dashed orbit — slow, reverse */}
            <div className="animate-orbit-rev absolute -inset-6 rounded-full border border-dashed border-white/[0.07]">
              <span className="orbit-dot -bottom-1 end-[18%] bg-lagoon! shadow-[0_0_14px_4px_rgba(45,212,191,0.5)]" />
            </div>
            {/* tilted elliptical orbit for depth */}
            <div className="absolute inset-0 [transform:scaleY(0.42)_rotate(-14deg)]">
              <div className="animate-orbit-slow absolute inset-0 rounded-full border border-white/[0.06]">
                <span className="orbit-dot top-1/2 -start-1 bg-iris! shadow-[0_0_14px_4px_rgba(167,139,250,0.4)]" />
              </div>
            </div>
            {/* faint static halo */}
            <div className="absolute inset-0 rounded-full border border-white/[0.04]" />
          </div>

          {/* soft ambient glow behind the frame */}
          <div
            aria-hidden="true"
            className="absolute -inset-6 rounded-[3rem] bg-linear-to-tr from-aqua/[0.16] via-transparent to-lagoon/[0.14] blur-2xl"
          />

          {/* glass frame + portrait */}
          <div className="glass-frame relative overflow-hidden rounded-[2rem] p-[1.5px] shadow-[0_40px_90px_-30px_rgba(2,8,20,0.9)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(2rem-1.5px)] bg-night-soft">
              <Image
                src="/images/portrait.webp"
                alt="پرتره پارمیدا زینتی، طراح UI/UX و بنیان‌گذار Quantum"
                width={768}
                height={1344}
                priority
                sizes="(max-width: 640px) 88vw, (max-width: 1024px) 440px, 400px"
                className="h-full w-full object-cover object-[50%_18%]"
              />
              {/* cinematic bottom fade */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#050a14]/85 via-[#050a14]/25 to-transparent"
              />
              {/* soft moving sheen */}
              {!reduce && (
                <div
                  aria-hidden="true"
                  className="animate-sheen absolute inset-y-0 start-0 w-1/3 bg-linear-to-r from-transparent via-white/[0.07] to-transparent"
                />
              )}
            </div>
          </div>

          {/* floating glass chips */}
          <div className="glass absolute -top-5 end-[-6%] hidden animate-float items-center gap-2 rounded-2xl px-4 py-2.5 shadow-[0_18px_50px_-16px_rgba(2,8,20,0.85)] sm:flex">
            <Sparkles size={16} className="text-aqua" aria-hidden="true" />
            <span className="text-[13px] font-semibold text-ink">
              طراح UI/UX
            </span>
          </div>
          <div className="glass absolute -bottom-5 start-[-8%] hidden animate-float-late items-center gap-2.5 rounded-2xl px-4 py-2.5 shadow-[0_18px_50px_-16px_rgba(2,8,20,0.85)] sm:flex">
            <QuantumMark size={20} />
            <span className="text-[13px] font-semibold text-ink">
              بنیان‌گذار Quantum
            </span>
          </div>
        </motion.div>
      </div>

      {/* scroll hint */}
      <a
        href="#about"
        aria-label="اسکرول به بخش درباره من"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-fog transition-colors hover:text-aqua md:flex"
      >
        <span className="text-[11px] font-medium">اسکرول کنید</span>
        <ChevronDown
          size={20}
          aria-hidden="true"
          className="animate-pulse-soft"
        />
      </a>
    </section>
  );
}
