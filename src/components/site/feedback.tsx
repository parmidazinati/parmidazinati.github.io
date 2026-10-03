"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  CheckCircle2,
  Loader2,
  MessageSquareText,
  PenLine,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Reveal } from "./reveal";

type Status = "idle" | "sending" | "sent" | "error";

const MAX_MESSAGE = 1500;

export function FeedbackSection() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* clear the "sent" auto-return timer on unmount */
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;

    if (message.trim().length < 3) {
      setStatus("error");
      setError("لطفاً متن پیام را وارد کنید.");
      return;
    }

    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message, website: honeypot }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (res.ok && data?.ok) {
        setStatus("sent");
        setName("");
        setContact("");
        setMessage("");
        /* gently return to the empty form after a while */
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setStatus("idle"), 9000);
      } else {
        setStatus("error");
        setError(data?.error ?? "ثبت پیام با خطا مواجه شد.");
      }
    } catch {
      setStatus("error");
      setError("خطا در برقراری ارتباط با سرور.");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] text-ink placeholder:text-fog/50 transition-colors focus-visible:border-aqua/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua/25";

  return (
    <section
      id="feedback"
      aria-labelledby="feedback-title"
      className="relative pb-24 pt-4 sm:pb-28"
    >
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[2rem] p-7 sm:p-12">
            {/* ambient corner glows */}
            <div
              aria-hidden="true"
              className="absolute -bottom-28 end-[-8%] h-56 w-56 rounded-full bg-iris/[0.08] blur-[90px]"
            />
            <div
              aria-hidden="true"
              className="absolute -top-24 start-[-10%] h-56 w-56 rounded-full bg-lagoon/[0.08] blur-[90px]"
            />

            <div className="relative">
              <div className="text-center">
                <span className="glass-chip mb-6 text-aqua">
                  <MessageSquareText
                    size={15}
                    aria-hidden="true"
                    className="text-aqua"
                  />
                  بازخورد شما
                </span>

                <h2
                  id="feedback-title"
                  className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
                >
                  نظرات و پیشنهادات
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-fog">
                  ایده، پیشنهاد یا بازخوردی دارید؟ خوشحال می‌شوم بنویسید —
                  همه‌ی پیام‌ها مستقیم به خودم می‌رسد.
                </p>
              </div>

              {status === "sent" ? (
                /* ---------------- success panel ---------------- */
                <div
                  role="status"
                  className="mt-9 flex flex-col items-center gap-3 rounded-2xl border border-lagoon/25 bg-lagoon/[0.07] px-6 py-10 text-center"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-lagoon/30 bg-lagoon/10">
                    <CheckCircle2 size={26} aria-hidden="true" className="text-lagoon" />
                  </span>
                  <p className="text-lg font-bold text-ink">پیام شما ثبت شد</p>
                  <p className="max-w-sm text-sm leading-7 text-fog">
                    سپاسگزارم که وقت گذاشتید؛ به‌زودی پیام‌تان را می‌خوانم.
                  </p>
                </div>
              ) : (
                /* ---------------- form ---------------- */
                <form onSubmit={submit} className="mt-9 flex flex-col gap-5" noValidate>
                  {/* honeypot — invisible to humans */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="fb-website">وب‌سایت</label>
                    <input
                      id="fb-website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(event) => setHoneypot(event.target.value)}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="fb-name" className="text-sm font-semibold text-ink">
                        نام
                      </label>
                      <input
                        id="fb-name"
                        type="text"
                        maxLength={80}
                        autoComplete="name"
                        placeholder="نام شما (اختیاری)"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="fb-contact" className="text-sm font-semibold text-ink">
                        راه ارتباطی
                      </label>
                      <input
                        id="fb-contact"
                        type="text"
                        maxLength={120}
                        autoComplete="email"
                        dir="auto"
                        placeholder="ایمیل، تلفن یا آی‌دی (اختیاری)"
                        value={contact}
                        onChange={(event) => setContact(event.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="fb-message" className="text-sm font-semibold text-ink">
                      پیام شما
                    </label>
                    <textarea
                      id="fb-message"
                      rows={5}
                      required
                      maxLength={MAX_MESSAGE}
                      placeholder="هر چه دوست دارید بنویسید…"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      className={`${inputClass} resize-y leading-8`}
                    />
                    <span
                      aria-hidden="true"
                      className="self-end font-mono text-[11px] text-fog/70"
                    >
                      {new Intl.NumberFormat("fa-IR").format(message.length)} /{" "}
                      {new Intl.NumberFormat("fa-IR").format(MAX_MESSAGE)}
                    </span>
                  </div>

                  {status === "error" && error && (
                    <p
                      role="alert"
                      className="rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300"
                    >
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <p className="flex items-center gap-1.5 text-xs text-fog/80">
                      <ShieldCheck size={14} aria-hidden="true" className="text-lagoon/80" />
                      پیام شما فقط برای پارمیدا نمایش داده می‌شود.
                    </p>

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 size={16} aria-hidden="true" className="animate-spin" />
                          در حال ارسال…
                        </>
                      ) : (
                        <>
                          <Send size={16} aria-hidden="true" />
                          ارسال نظر
                        </>
                      )}
                    </button>
                  </div>

                  {/* screen-reader status */}
                  <div aria-live="polite" className="sr-only">
                    {status === "sending" && "در حال ارسال پیام…"}
                  </div>
                </form>
              )}

              {/* decorative hint */}
              <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-fog/60">
                <PenLine size={13} aria-hidden="true" />
                منتظر شنیدن نظرات شما هستم
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
