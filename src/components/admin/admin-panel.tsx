"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Home,
  ImagePlus,
  LayoutGrid,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  MessageSquareText,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Ambient } from "@/components/site/ambient";
import { QuantumMark } from "@/components/site/quantum-mark";
import { FeedbackTab } from "@/components/admin/feedback-tab";
import {
  DEFAULT_CONTENT,
  parseLines,
  type FocusCard,
  type SiteContent,
} from "@/lib/site-content";

const PASSCODE_KEY = "pz-admin-passcode";

type Status = "idle" | "saving" | "saved" | "error";

/* ------------------------------------------------------------------ */
/* small building blocks                                               */
/* ------------------------------------------------------------------ */

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs leading-5 text-fog/70">{hint}</p>}
    </div>
  );
}

function ListField({
  id,
  label,
  hint,
  value,
  onChange,
  rows = 6,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <Field id={id} label={label} hint={hint}>
      <Textarea
        id={id}
        value={value}
        rows={rows}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(event.target.value)
        }
        className="min-h-24 resize-y border-white/10 bg-white/[0.04] text-sm leading-7 text-ink placeholder:text-fog/50 focus-visible:ring-aqua/40"
      />
    </Field>
  );
}

function ImagePreview({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="glass relative h-16 w-28 shrink-0 overflow-hidden rounded-xl">
      {src ? (
        <Image
          unoptimized
          src={src}
          alt={alt}
          fill
          sizes="112px"
          className="object-cover"
        />
      ) : null}
    </div>
  );
}

/**
 * Image chooser with direct upload: pick a file (or drag & drop), it is
 * uploaded to /api/admin/upload and the returned public path fills the
 * hidden path input. The path can still be typed manually.
 */
function ImageUploadField({
  id,
  label,
  hint,
  passcode,
  value,
  alt,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  passcode: string;
  value: string;
  alt: string;
  onChange: (path: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-passcode": passcode },
        body,
      });
      const data = await res.json();
      if (res.ok && data.ok && typeof data.path === "string") {
        onChange(data.path);
      } else {
        setUploadError(data.error ?? "آپلود تصویر ناموفق بود.");
      }
    } catch {
      setUploadError("خطا در ارتباط با سرور هنگام آپلود.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span id={`${id}-label`} className="text-sm font-semibold text-ink">
        {label}
      </span>
      <div className="flex items-start gap-4">
        <ImagePreview src={value} alt={alt} />
        <div className="flex flex-1 flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              const file = event.dataTransfer.files?.[0];
              if (file) void upload(file);
            }}
            disabled={uploading}
            aria-labelledby={`${id}-label`}
            aria-label={`${label} — انتخاب فایل تصویر برای آپلود`}
            className={`flex h-24 w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-3 text-center transition-colors duration-300 disabled:opacity-60 ${
              dragging
                ? "border-aqua/60 bg-aqua/[0.08] text-ink"
                : "border-white/15 bg-white/[0.03] text-fog hover:border-aqua/40 hover:text-ink"
            }`}
          >
            {uploading ? (
              <Loader2 size={18} className="animate-spin text-aqua" aria-hidden="true" />
            ) : (
              <ImagePlus size={18} className="text-aqua" aria-hidden="true" />
            )}
            <span className="text-[13px] font-semibold">
              {uploading ? "در حال آپلود…" : "انتخاب عکس یا کشیدن و رها کردن"}
            </span>
            <span className="text-[11px] text-fog/60">
              PNG · JPG · WebP — حداکثر ۵ مگابایت
            </span>
          </button>
          <Input
            aria-label={`${label} — مسیر فایل (دستی)`}
            dir="ltr"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="border-white/10 bg-white/[0.04] font-mono text-xs text-ink focus-visible:ring-aqua/40"
            placeholder="/images/... یا /uploads/..."
          />
        </div>
      </div>
      {hint && <p className="text-xs leading-5 text-fog/70">{hint}</p>}
      {uploadError && (
        <p role="alert" className="text-xs leading-5 text-red-300">
          {uploadError}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* main component                                                      */
/* ------------------------------------------------------------------ */

export function AdminPanel({
  initialContent,
  onSaved,
  onExit,
}: {
  initialContent: SiteContent;
  onSaved?: (saved: SiteContent) => void;
  /** defaults to navigating back to the public site on "/" */
  onExit?: () => void;
}) {
  const [passcode, setPasscode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);
  const [gateLoading, setGateLoading] = useState(false);

  const [draft, setDraft] = useState<SiteContent>(initialContent);
  const [aboutRowsText, setAboutRowsText] = useState(
    initialContent.about.rows.join("\n"),
  );
  const [interestsText, setInterestsText] = useState(
    initialContent.about.interests.join("\n"),
  );

  const [status, setStatus] = useState<Status>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const exitToSite = useCallback(() => {
    if (onExit) {
      onExit();
    } else {
      /* leaving the panel always lands on a fresh render of the public site */
      window.location.assign("/");
    }
  }, [onExit]);

  useEffect(() => {
    return () => {
      if (statusTimer.current) clearTimeout(statusTimer.current);
    };
  }, []);

  /* keep draft fields in sync with a freshly loaded/reset content object */
  const applyContent = useCallback((content: SiteContent) => {
    setDraft(content);
    setAboutRowsText(content.about.rows.join("\n"));
    setInterestsText(content.about.interests.join("\n"));
  }, []);

  /* restore a saved session inside the same tab — verified against the
     server asynchronously so we never set state synchronously in an effect */
  useEffect(() => {
    const stored = sessionStorage.getItem(PASSCODE_KEY);
    if (!stored) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passcode: stored }),
        });
        if (cancelled) return;
        if (res.ok) {
          setPasscode(stored);
          setAuthed(true);
        } else {
          sessionStorage.removeItem(PASSCODE_KEY);
        }
      } catch {
        /* network issue — keep the gate visible */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* after unlocking, pull the latest saved content from the server
     plus a lightweight feedback badge count */
  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/content", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled && data?.ok && data.content) {
          applyContent(data.content as SiteContent);
        }
      } catch {
        /* keep the initial content if the fetch fails */
      }
      try {
        const res = await fetch("/api/feedback?meta=1", {
          cache: "no-store",
          headers: { "x-admin-passcode": passcode },
        });
        const data = await res.json();
        if (!cancelled && data?.ok) setUnreadCount(data.unread ?? 0);
      } catch {
        /* the feedback badge is non-critical */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authed, applyContent, passcode]);

  /* ------------------------------ actions ------------------------------ */

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setGateLoading(true);
    setGateError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        sessionStorage.setItem(PASSCODE_KEY, passcode);
        setAuthed(true);
      } else {
        setGateError(data.error ?? "رمز مدیریت نادرست است.");
      }
    } catch {
      setGateError("خطا در برقراری ارتباط با سرور.");
    } finally {
      setGateLoading(false);
    }
  };

  const buildContent = (): SiteContent => ({
    ...draft,
    about: {
      ...draft.about,
      rows: parseLines(aboutRowsText),
      interests: parseLines(interestsText),
    },
  });

  const save = async () => {
    setStatus("saving");
    setSaveError(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({ content: buildContent() }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        /* push the normalized saved content to the public view instantly */
        if (data.content && onSaved) onSaved(data.content as SiteContent);
        setStatus("saved");
        if (statusTimer.current) clearTimeout(statusTimer.current);
        statusTimer.current = setTimeout(() => setStatus("idle"), 2600);
      } else {
        setStatus("error");
        setSaveError(data.error ?? "ذخیره‌سازی ناموفق بود.");
      }
    } catch {
      setStatus("error");
      setSaveError("خطا در برقراری ارتباط با سرور.");
    }
  };

  const resetToDefaults = () => {
    applyContent(DEFAULT_CONTENT);
    setSaveError(null);
  };

  const logout = () => {
    sessionStorage.removeItem(PASSCODE_KEY);
    setPasscode("");
    setAuthed(false);
    setGateError(null);
  };

  const updateHero = (patch: Partial<SiteContent["hero"]>) =>
    setDraft((prev) => ({ ...prev, hero: { ...prev.hero, ...patch } }));

  const updateSectionHeading = <K extends keyof SiteContent["sections"]>(
    sectionKey: K,
    patch: Partial<SiteContent["sections"][K]>,
  ) =>
    setDraft((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: { ...prev.sections[sectionKey], ...patch },
      },
    }));

  const updateCard = (index: number, patch: Partial<FocusCard>) =>
    setDraft((prev) => ({
      ...prev,
      focus: {
        cards: prev.focus.cards.map((card, i) =>
          i === index ? { ...card, ...patch } : card,
        ),
      },
    }));

  /* ------------------------------- gate -------------------------------- */

  if (!authed) {
    return (
      <div className="relative flex min-h-svh flex-col items-center justify-center overflow-x-clip bg-[#050a14] px-4">
        <Ambient />
        <div className="glass relative z-10 w-full max-w-sm rounded-3xl p-8 shadow-[0_40px_90px_-30px_rgba(2,8,20,0.9)]">
          <div className="mb-7 flex flex-col items-center gap-4 text-center">
            <span className="glass flex h-16 w-16 items-center justify-center rounded-2xl">
              <QuantumMark size={34} />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-ink">پنل مدیریت</h1>
              <p className="mt-1 text-sm text-fog">
                برای ویرایش محتوای سایت، رمز مدیریت را وارد کنید.
              </p>
            </div>
          </div>

          <form onSubmit={login} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="admin-passcode"
                className="text-sm font-semibold text-ink"
              >
                رمز مدیریت
              </label>
              <div className="relative">
                <LockKeyhole
                  size={15}
                  aria-hidden="true"
                  className="absolute start-3 top-1/2 -translate-y-1/2 text-fog"
                />
                <Input
                  id="admin-passcode"
                  type={showPass ? "text" : "password"}
                  value={passcode}
                  onChange={(event) => setPasscode(event.target.value)}
                  dir="ltr"
                  autoComplete="current-password"
                  required
                  className="border-white/10 bg-white/[0.04] px-9 text-ink focus-visible:ring-aqua/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((prev) => !prev)}
                  aria-label={showPass ? "پنهان کردن رمز" : "نمایش رمز"}
                  className="absolute end-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-fog transition-colors hover:text-ink"
                >
                  {showPass ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {gateError && (
              <p
                role="alert"
                className="rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs leading-5 text-red-300"
              >
                {gateError}
              </p>
            )}

            <Button
              type="submit"
              disabled={gateLoading || passcode.length === 0}
              className="h-11 rounded-2xl text-sm font-bold"
            >
              {gateLoading ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <ShieldCheck size={16} aria-hidden="true" />
              )}
              ورود به پنل
            </Button>

            <button
              type="button"
              onClick={exitToSite}
              className="mx-auto flex items-center gap-1.5 text-xs text-fog transition-colors hover:text-ink"
            >
              <ArrowRight size={13} aria-hidden="true" />
              بازگشت به سایت
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ------------------------------ editor ------------------------------- */

  return (
    <div className="relative min-h-svh overflow-x-clip bg-[#050a14] text-ink">
      <Ambient />

      {/* sticky action bar */}
      <header className="glass-strong sticky top-0 z-30 border-b border-white/[0.08]">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <QuantumMark size={24} />
            <div className="leading-tight">
              <p className="text-sm font-bold text-ink">پنل مدیریت</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                Quantum CMS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="h-9 gap-1.5 rounded-xl text-fog hover:text-ink"
              aria-label="خروج از پنل مدیریت"
            >
              <LogOut size={14} aria-hidden="true" />
              <span className="hidden sm:inline">خروج</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exitToSite}
              className="h-9 gap-1.5 rounded-xl border-white/15 bg-white/[0.04] text-ink hover:bg-white/[0.08] hover:text-ink"
            >
              <ArrowRight size={14} aria-hidden="true" />
              <span className="hidden sm:inline">بازگشت به سایت</span>
            </Button>
            <Button
              size="sm"
              onClick={save}
              disabled={status === "saving"}
              className="h-9 gap-1.5 rounded-xl font-bold text-[#03121a]"
            >
              {status === "saving" ? (
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              ) : (
                <Save size={14} aria-hidden="true" />
              )}
              {status === "saved" ? "ذخیره شد" : "ذخیره تغییرات"}
            </Button>
          </div>
        </div>

        {/* save status (screen-reader friendly) */}
        <div aria-live="polite" className="sr-only">
          {status === "saved" && "تغییرات با موفقیت ذخیره شد."}
          {status === "error" && `خطا در ذخیره‌سازی: ${saveError ?? ""}`}
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
        {status === "error" && saveError && (
          <p
            role="alert"
            className="mb-5 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300"
          >
            {saveError}
          </p>
        )}

        <Tabs defaultValue="hero" dir="rtl" className="gap-6">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-1.5 backdrop-blur-xl">
            <TabsTrigger
              value="hero"
              className="gap-1.5 rounded-xl px-3 py-2 text-xs data-[state=active]:bg-aqua data-[state=active]:text-[#03121a] sm:text-sm"
            >
              <Home size={14} aria-hidden="true" />
              معرفی
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="gap-1.5 rounded-xl px-3 py-2 text-xs data-[state=active]:bg-aqua data-[state=active]:text-[#03121a] sm:text-sm"
            >
              <User size={14} aria-hidden="true" />
              درباره من
            </TabsTrigger>
            <TabsTrigger
              value="quantum"
              className="gap-1.5 rounded-xl px-3 py-2 text-xs data-[state=active]:bg-aqua data-[state=active]:text-[#03121a] sm:text-sm"
            >
              <Sparkles size={14} aria-hidden="true" />
              Quantum
            </TabsTrigger>
            <TabsTrigger
              value="focus"
              className="gap-1.5 rounded-xl px-3 py-2 text-xs data-[state=active]:bg-aqua data-[state=active]:text-[#03121a] sm:text-sm"
            >
              <LayoutGrid size={14} aria-hidden="true" />
              حوزه‌های تمرکز
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="gap-1.5 rounded-xl px-3 py-2 text-xs data-[state=active]:bg-aqua data-[state=active]:text-[#03121a] sm:text-sm"
            >
              <Mail size={14} aria-hidden="true" />
              تماس
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className="relative gap-1.5 rounded-xl px-3 py-2 text-xs data-[state=active]:bg-aqua data-[state=active]:text-[#03121a] sm:text-sm"
            >
              <MessageSquareText size={14} aria-hidden="true" />
              نظرات
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -start-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-linear-to-l from-aqua to-lagoon px-1 font-mono text-[10px] font-bold text-[#03121a] shadow-[0_0_10px_2px_rgba(34,211,238,0.45)]">
                  {new Intl.NumberFormat("fa-IR").format(unreadCount)}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ------------------------------- hero ------------------------------ */}
          <TabsContent value="hero" className="mt-0 flex flex-col gap-6">
            <div className="glass rounded-3xl p-6">
              <div className="flex flex-col gap-6">
                <Field
                  id="hero-chip"
                  label="برچسب بالای تیتر"
                  hint="متن کوتاه معرفی؛ بخش‌ها با «·» جدا می‌شوند و به‌صورت چیپ شناور کنار پرتره هم نمایش داده می‌شوند."
                >
                  <Input
                    id="hero-chip"
                    value={draft.hero.chip}
                    onChange={(event) => updateHero({ chip: event.target.value })}
                    className="border-white/10 bg-white/[0.04] text-ink focus-visible:ring-aqua/40"
                  />
                </Field>

                <Field
                  id="hero-headline"
                  label="تیتر اصلی"
                  hint="برای هایلایت گرادیانی، بخش موردنظر را بین دو ستاره قرار دهید: **متن هایلایت**"
                >
                  <Input
                    id="hero-headline"
                    value={draft.hero.headline}
                    onChange={(event) =>
                      updateHero({ headline: event.target.value })
                    }
                    className="border-white/10 bg-white/[0.04] text-ink focus-visible:ring-aqua/40"
                  />
                </Field>

                <Field id="hero-intro" label="متن معرفی">
                  <Textarea
                    id="hero-intro"
                    rows={4}
                    value={draft.hero.intro}
                    onChange={(event) =>
                      updateHero({ intro: event.target.value })
                    }
                    className="resize-y border-white/10 bg-white/[0.04] text-sm leading-7 text-ink focus-visible:ring-aqua/40"
                  />
                </Field>
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <div className="flex flex-col gap-6">
                <ImageUploadField
                  id="hero-portrait"
                  label="تصویر پرتره (هدر)"
                  hint="عکس خود را آپلود کنید یا مسیر فایل در پوشه public را دستی وارد کنید. پس از آپلود، حتماً «ذخیره تغییرات» را بزنید."
                  passcode={passcode}
                  value={draft.hero.portraitImage}
                  alt={draft.hero.portraitAlt}
                  onChange={(portraitImage) => updateHero({ portraitImage })}
                />

                <Field
                  id="hero-portrait-alt"
                  label="متن جایگزین تصویر (Alt)"
                  hint="برای دسترس‌پذیری و سئو؛ تصویر را برای کاربران صفحه‌خوان توصیف می‌کند."
                >
                  <Input
                    id="hero-portrait-alt"
                    value={draft.hero.portraitAlt}
                    onChange={(event) =>
                      updateHero({ portraitAlt: event.target.value })
                    }
                    className="border-white/10 bg-white/[0.04] text-ink focus-visible:ring-aqua/40"
                  />
                </Field>
              </div>
            </div>
          </TabsContent>

          {/* ------------------------------ about ------------------------------ */}
          <TabsContent value="about" className="mt-0 flex flex-col gap-6">
            <div className="glass rounded-3xl p-6">
              <div className="flex flex-col gap-6">
                <p className="-mb-1 text-xs font-semibold uppercase tracking-wide text-fog/70">
                  تیترهای این بخش
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="about-eyebrow" label="برچسب بالای تیتر">
                    <Input
                      id="about-eyebrow"
                      value={draft.sections.about.eyebrow}
                      onChange={(event) =>
                        updateSectionHeading("about", {
                          eyebrow: event.target.value,
                        })
                      }
                      className="border-white/10 bg-white/[0.04] text-ink focus-visible:ring-aqua/40"
                    />
                  </Field>
                  <Field id="about-title" label="تیتر بخش">
                    <Input
                      id="about-title"
                      value={draft.sections.about.title}
                      onChange={(event) =>
                        updateSectionHeading("about", {
                          title: event.target.value,
                        })
                      }
                      className="border-white/10 bg-white/[0.04] text-ink focus-visible:ring-aqua/40"
                    />
                  </Field>
                </div>
                <Field id="about-interests-title" label="تیتر کارت علایق">
                  <Input
                    id="about-interests-title"
                    value={draft.sections.about.interestsTitle}
                    onChange={(event) =>
                      updateSectionHeading("about", {
                        interestsTitle: event.target.value,
                      })
                    }
                    className="border-white/10 bg-white/[0.04] text-ink focus-visible:ring-aqua/40"
                  />
                </Field>
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <ListField
                id="about-rows"
                label="ردیف‌های پروفایل"
                hint="هر ردیف در یک خط؛ به ترتیب نمایش داده می‌شوند."
                value={aboutRowsText}
                onChange={setAboutRowsText}
              />
            </div>

            <div className="glass rounded-3xl p-6">
              <div className="flex flex-col gap-6">
                <ListField
                  id="about-interests"
                  label="حوزه‌های مورد علاقه"
                  hint="هر مورد در یک خط؛ به‌صورت چیپ نمایش داده می‌شوند."
                  value={interestsText}
                  onChange={setInterestsText}
                  rows={5}
                />
                <Field id="about-note" label="توضیح پایانی">
                  <Textarea
                    id="about-note"
                    rows={3}
                    value={draft.about.interestsNote}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        about: {
                          ...prev.about,
                          interestsNote: event.target.value,
                        },
                      }))
                    }
                    className="resize-y border-white/10 bg-white/[0.04] text-sm leading-7 text-ink focus-visible:ring-aqua/40"
                  />
                </Field>
              </div>
            </div>
          </TabsContent>

          {/* ----------------------------- quantum ----------------------------- */}
          <TabsContent value="quantum" className="mt-0 flex flex-col gap-6">
            <p className="rounded-2xl border border-iris/25 bg-iris/[0.07] px-4 py-3 text-xs leading-6 text-fog">
              این بخش عمداً مرموز و مینیمال است: یک متن رمزآلود بالای لوگو، و بعد
              فقط لوگو و نام Quantum — بدون توضیح اضافه.
            </p>

            <div className="glass rounded-3xl p-6">
              <Field
                id="quantum-coming-soon"
                label="متن مرموز بالای لوگو"
                hint="با فونت monospace و حروف فاصله‌دار نمایش داده می‌شود. پیش‌فرض: ...coming soon"
              >
                <Input
                  id="quantum-coming-soon"
                  dir="ltr"
                  value={draft.quantum.comingSoon}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      quantum: { comingSoon: event.target.value },
                    }))
                  }
                  className="border-white/10 bg-white/[0.04] font-mono text-sm text-ink focus-visible:ring-aqua/40"
                />
              </Field>
            </div>
          </TabsContent>

          {/* ------------------------------ focus ------------------------------ */}
          <TabsContent value="focus" className="mt-0 flex flex-col gap-6">
            <p className="rounded-2xl border border-aqua/20 bg-aqua/[0.06] px-4 py-3 text-xs leading-6 text-fog">
              عنوان، توضیح و تصویر هر کارت را می‌توانید ویرایش کنید و عکس جدید
              آپلود کنید. پس از هر تغییر، «ذخیره تغییرات» را بزنید.
            </p>

            <div className="glass rounded-3xl p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="focus-eyebrow" label="برچسب بالای تیتر بخش">
                  <Input
                    id="focus-eyebrow"
                    value={draft.sections.focus.eyebrow}
                    onChange={(event) =>
                      updateSectionHeading("focus", {
                        eyebrow: event.target.value,
                      })
                    }
                    className="border-white/10 bg-white/[0.04] text-ink focus-visible:ring-aqua/40"
                  />
                </Field>
                <Field id="focus-title" label="تیتر بخش">
                  <Input
                    id="focus-title"
                    value={draft.sections.focus.title}
                    onChange={(event) =>
                      updateSectionHeading("focus", {
                        title: event.target.value,
                      })
                    }
                    className="border-white/10 bg-white/[0.04] text-ink focus-visible:ring-aqua/40"
                  />
                </Field>
              </div>
            </div>

            {draft.focus.cards.map((card, index) => (
              <div key={index} className="glass rounded-3xl p-6">
                <div className="flex flex-col gap-5">
                  <ImageUploadField
                    id={`card-${index}-image`}
                    label={`تصویر کارت ${index + 1}`}
                    passcode={passcode}
                    value={card.image}
                    alt={card.alt}
                    onChange={(image) => updateCard(index, { image })}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      id={`card-${index}-title`}
                      label={`عنوان کارت ${index + 1}`}
                    >
                      <Input
                        id={`card-${index}-title`}
                        value={card.title}
                        onChange={(event) =>
                          updateCard(index, { title: event.target.value })
                        }
                        className="border-white/10 bg-white/[0.04] text-ink focus-visible:ring-aqua/40"
                      />
                    </Field>
                    <Field
                      id={`card-${index}-alt`}
                      label="متن جایگزین تصویر (Alt)"
                    >
                      <Input
                        id={`card-${index}-alt`}
                        value={card.alt}
                        onChange={(event) =>
                          updateCard(index, { alt: event.target.value })
                        }
                        className="border-white/10 bg-white/[0.04] text-sm text-ink focus-visible:ring-aqua/40"
                      />
                    </Field>
                  </div>
                  <Field id={`card-${index}-concept`} label="توضیح کوتاه">
                    <Textarea
                      id={`card-${index}-concept`}
                      rows={2}
                      value={card.concept}
                      onChange={(event) =>
                        updateCard(index, { concept: event.target.value })
                      }
                      className="resize-y border-white/10 bg-white/[0.04] text-sm leading-7 text-ink focus-visible:ring-aqua/40"
                    />
                  </Field>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* ----------------------------- contact ----------------------------- */}
          <TabsContent value="contact" className="mt-0 flex flex-col gap-6">
            <div className="glass rounded-3xl p-6">
              <div className="flex flex-col gap-6">
                <p className="-mb-1 text-xs font-semibold uppercase tracking-wide text-fog/70">
                  تیترهای این بخش
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="contact-eyebrow" label="برچسب بالای تیتر">
                    <Input
                      id="contact-eyebrow"
                      value={draft.sections.contact.eyebrow}
                      onChange={(event) =>
                        updateSectionHeading("contact", {
                          eyebrow: event.target.value,
                        })
                      }
                      className="border-white/10 bg-white/[0.04] text-ink focus-visible:ring-aqua/40"
                    />
                  </Field>
                  <Field id="contact-title" label="تیتر بخش">
                    <Input
                      id="contact-title"
                      value={draft.sections.contact.title}
                      onChange={(event) =>
                        updateSectionHeading("contact", {
                          title: event.target.value,
                        })
                      }
                      className="border-white/10 bg-white/[0.04] text-ink focus-visible:ring-aqua/40"
                    />
                  </Field>
                </div>
                <Field
                  id="contact-email"
                  label="ایمیل"
                  hint="این ایمیل در دکمه‌های کپی و ارسال ایمیل استفاده می‌شود."
                >
                  <Input
                    id="contact-email"
                    dir="ltr"
                    type="email"
                    value={draft.contact.email}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, email: event.target.value },
                      }))
                    }
                    className="border-white/10 bg-white/[0.04] font-mono text-sm text-ink focus-visible:ring-aqua/40"
                  />
                </Field>
                <Field id="contact-message" label="متن دعوت به گفت‌وگو">
                  <Textarea
                    id="contact-message"
                    rows={4}
                    value={draft.contact.message}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          message: event.target.value,
                        },
                      }))
                    }
                    className="resize-y border-white/10 bg-white/[0.04] text-sm leading-7 text-ink focus-visible:ring-aqua/40"
                  />
                </Field>
              </div>
            </div>
          </TabsContent>

          {/* ---------------------------- feedback ---------------------------- */}
          <TabsContent value="feedback" className="mt-0 flex flex-col gap-4">
            <div className="glass rounded-3xl p-6">
              <p className="text-sm leading-7 text-fog">
                پیام‌های ثبت‌شده در سکشن «نظرات و پیشنهادات» سایت — می‌توانید
                آن‌ها را خوانده‌شده علامت‌بزنید یا حذف کنید.
              </p>
              <div className="mt-4">
                <FeedbackTab passcode={passcode} onUnreadChange={setUnreadCount} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* footer actions */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToDefaults}
            className="h-9 gap-1.5 rounded-xl text-fog hover:text-ink"
          >
            <RotateCcw size={14} aria-hidden="true" />
            بازگردانی متن‌های پیش‌فرض در فرم
          </Button>
          <p className="text-xs leading-5 text-fog/70">
            پس از ذخیره، تغییرات بلافاصله روی سایت اعمال می‌شود.
          </p>
        </div>
      </main>
    </div>
  );
}
