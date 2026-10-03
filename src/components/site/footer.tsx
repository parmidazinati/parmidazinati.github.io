"use client";

import { LockKeyhole } from "lucide-react";
import { QuantumMark } from "./quantum-mark";

export function Footer({ onManage }: { onManage?: () => void }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-[#04070f]/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-4 py-8 text-center sm:px-6 md:flex-row md:justify-between md:text-start">
        {/* brand */}
        <div className="flex items-center gap-3">
          <QuantumMark size={28} />
          <div className="leading-tight">
            <p className="text-sm font-bold text-ink">پارمیدا زینتی</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-fog">
              Quantum
            </p>
          </div>
        </div>

        {/* copyright */}
        <p className="text-[13px] text-fog">
          © {year} پارمیدا زینتی · تمامی حقوق محفوظ است.
        </p>

        {/* image credit */}
        <p className="max-w-xs text-[12px] leading-6 text-fog/80">
          تصاویر استفاده‌شده در این وب‌سایت استوک/تولیدی و صرفاً جنبه نمایشی
          دارند.
        </p>
      </div>

      {/* discreet owner-only entry to the admin panel */}
      {onManage && (
        <div className="mx-auto w-full max-w-6xl px-4 pb-7 sm:px-6">
          <div className="flex justify-center border-t border-white/[0.04] pt-4">
            <button
              type="button"
              onClick={onManage}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-fog/50 transition-colors duration-300 hover:bg-white/[0.04] hover:text-aqua focus-visible:outline focus-visible:outline-1 focus-visible:outline-aqua/60"
              aria-label="ورود به پنل مدیریت سایت"
            >
              <LockKeyhole size={12} aria-hidden="true" />
              مدیریت سایت
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
