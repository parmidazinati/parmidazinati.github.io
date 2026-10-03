"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Mail, Send } from "lucide-react";
import { Reveal } from "./reveal";
import type { SiteContent } from "@/lib/site-content";

export function Contact({ content }: { content: SiteContent["contact"] }) {
  const EMAIL = content.email;
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copyEmail = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(EMAIL);
      } else {
        /* fallback for contexts without the async clipboard API */
        const el = document.createElement("textarea");
        el.value = EMAIL;
        el.setAttribute("readonly", "");
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — the mailto link remains usable */
    }
  }, [EMAIL]);

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative py-24 sm:py-28"
    >
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[2rem] p-7 text-center sm:p-12">
            {/* ambient corner glows */}
            <div
              aria-hidden="true"
              className="absolute -top-28 start-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-aqua/[0.09] blur-[90px]"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-28 start-[-10%] h-56 w-56 rounded-full bg-lagoon/[0.07] blur-[90px]"
            />

            <div className="relative flex flex-col items-center">
              <span className="glass-chip mb-6 text-aqua">
                <span className="h-1.5 w-1.5 rounded-full bg-aqua shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]" />
                در تماس باشیم
              </span>

              <h2
                id="contact-title"
                className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
              >
                ارتباط با من
              </h2>

              <p className="mt-5 max-w-xl text-base leading-8 text-fog sm:text-lg sm:leading-9">
                {content.message}
              </p>

              {/* email row */}
              <div className="glass mt-9 flex w-full max-w-md items-center gap-3 rounded-2xl p-3">
                <span className="flex min-h-11 flex-1 items-center gap-3 rounded-xl px-2">
                  <Mail
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 text-aqua"
                  />
                  <a
                    href={`mailto:${EMAIL}`}
                    dir="ltr"
                    className="truncate font-mono text-[13px] text-ink transition-colors hover:text-aqua sm:text-sm"
                  >
                    {EMAIL}
                  </a>
                </span>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-live="polite"
                  className="btn-glass shrink-0 px-4 py-2.5 text-[13px]"
                >
                  {copied ? (
                    <>
                      <Check size={16} aria-hidden="true" className="text-lagoon" />
                      کپی شد
                    </>
                  ) : (
                    <>
                      <Copy size={16} aria-hidden="true" />
                      کپی ایمیل
                    </>
                  )}
                </button>
              </div>

              <a href={`mailto:${EMAIL}`} className="btn-primary mt-4">
                <Send size={16} aria-hidden="true" />
                ارسال ایمیل
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
