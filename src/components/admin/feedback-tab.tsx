"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  CheckCheck,
  Inbox,
  Loader2,
  RefreshCcw,
  Trash2,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type FeedbackItem = {
  id: string;
  name: string;
  contact: string;
  message: string;
  readAt: string | null;
  createdAt: string;
};

const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function faNumber(value: number): string {
  try {
    return new Intl.NumberFormat("fa-IR").format(value);
  } catch {
    return String(value);
  }
}

export function FeedbackTab({
  passcode,
  onUnreadChange,
}: {
  passcode: string;
  /** reports the current unread count so the tab badge stays fresh */
  onUnreadChange?: (unread: number) => void;
}) {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const reportUnread = useCallback(
    (list: FeedbackItem[]) => {
      onUnreadChange?.(list.filter((item) => !item.readAt).length);
    },
    [onUnreadChange],
  );

  const load = useCallback(
    async (spinner = false) => {
      if (spinner) setLoading(true);
      try {
        const res = await fetch("/api/feedback", {
          headers: { "x-admin-passcode": passcode },
          cache: "no-store",
        });
        const data = (await res.json().catch(() => null)) as
          | { ok?: boolean; items?: FeedbackItem[]; error?: string }
          | null;
        if (res.ok && data?.ok && Array.isArray(data.items)) {
          setItems(data.items);
          setError(null);
          reportUnread(data.items);
        } else {
          setError(data?.error ?? "خطا در دریافت نظرات.");
        }
      } catch {
        setError("خطا در برقراری ارتباط با سرور.");
      } finally {
        setLoading(false);
      }
    },
    [passcode, reportUnread],
  );

  /* initial load (spinner-free to keep the first paint stable) */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) await load();
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const toggleRead = async (item: FeedbackItem) => {
    setBusyId(item.id);
    try {
      const res = await fetch("/api/feedback", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({ id: item.id, read: item.readAt === null }),
      });
      if (res.ok) {
        const stamp = item.readAt === null ? new Date().toISOString() : null;
        const next = items.map((row) =>
          row.id === item.id ? { ...row, readAt: stamp } : row,
        );
        setItems(next);
        reportUnread(next);
      }
    } catch {
      /* silent — the next refresh reflects the truth */
    } finally {
      setBusyId(null);
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/feedback", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({ readAll: true }),
      });
      if (res.ok) {
        const stamp = new Date().toISOString();
        const next = items.map((row) => ({ ...row, readAt: row.readAt ?? stamp }));
        setItems(next);
        reportUnread(next);
      }
    } catch {
      /* silent */
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/feedback?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "x-admin-passcode": passcode },
      });
      if (res.ok) {
        const next = items.filter((row) => row.id !== id);
        setItems(next);
        reportUnread(next);
      }
    } catch {
      /* silent */
    } finally {
      setBusyId(null);
      setConfirmDeleteId(null);
    }
  };

  const unreadCount = items.filter((item) => !item.readAt).length;

  return (
    <div className="flex flex-col gap-4">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-fog">
          {loading
            ? "در حال دریافت پیام‌ها…"
            : items.length === 0
              ? "هنوز پیامی دریافت نشده است."
              : `${faNumber(items.length)} پیام${unreadCount > 0 ? ` · ${faNumber(unreadCount)} خوانده‌نشده` : ""}`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => load(true)}
            disabled={loading}
            className="h-9 gap-1.5 rounded-xl border-white/15 bg-white/[0.04] text-ink hover:bg-white/[0.08] hover:text-ink"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCcw size={14} aria-hidden="true" />
            )}
            به‌روزرسانی
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            disabled={loading || unreadCount === 0}
            className="h-9 gap-1.5 rounded-xl border-white/15 bg-white/[0.04] text-ink hover:bg-white/[0.08] hover:text-ink disabled:opacity-40"
          >
            <CheckCheck size={14} aria-hidden="true" />
            خواندن همه
          </Button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300"
        >
          {error}
        </p>
      )}

      {/* list */}
      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-3xl border border-white/[0.08] bg-white/[0.03] px-6 py-16 text-fog">
          <Loader2 size={20} className="animate-spin" aria-hidden="true" />
          در حال بارگذاری…
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/[0.08] bg-white/[0.03] px-6 py-16 text-center text-fog">
          <Inbox size={30} aria-hidden="true" className="text-fog/60" />
          <p className="text-sm">صندوق نظرات خالی است — با ارسال اولین پیام از سکشن «نظرات و پیشنهادات» سایت، اینجا ظاهر می‌شود.</p>
        </div>
      ) : (
        <ul className="flex max-h-[62vh] flex-col gap-3 overflow-y-auto pe-1">
          {items.map((item) => {
            const busy = busyId === item.id;
            const confirming = confirmDeleteId === item.id;
            return (
              <li
                key={item.id}
                className={`glass rounded-2xl p-4 transition-opacity ${busy ? "opacity-60" : ""} ${
                  item.readAt ? "" : "border-aqua/25 bg-aqua/[0.04]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* unread dot */}
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 rounded-full ${
                        item.readAt
                          ? "bg-white/15"
                          : "bg-aqua shadow-[0_0_8px_2px_rgba(34,211,238,0.55)]"
                      }`}
                    />
                    <span className="text-sm font-bold text-ink">
                      {item.name || "بی‌نام"}
                    </span>
                  </div>
                  <time
                    dateTime={item.createdAt}
                    className="font-mono text-[11px] text-fog/80"
                  >
                    {dateFormatter.format(new Date(item.createdAt))}
                  </time>
                </div>

                {item.contact && (
                  <p dir="auto" className="mt-1.5 font-mono text-xs text-aqua/90">
                    {item.contact}
                  </p>
                )}

                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-ink/90">
                  {item.message}
                </p>

                <div className="mt-3 flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRead(item)}
                    disabled={busy}
                    className="h-8 gap-1.5 rounded-lg px-2.5 text-xs text-fog hover:text-ink"
                  >
                    {item.readAt ? (
                      <>
                        <Undo2 size={13} aria-hidden="true" />
                        علامت‌گذاری به‌عنوان خوانده‌نشده
                      </>
                    ) : (
                      <>
                        <Check size={13} aria-hidden="true" />
                        خوانده شد
                      </>
                    )}
                  </Button>

                  {confirming ? (
                    <span className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(item.id)}
                        disabled={busy}
                        className="h-8 rounded-lg border border-red-400/30 bg-red-400/10 px-2.5 text-xs font-bold text-red-300 hover:bg-red-400/20"
                      >
                        {busy ? (
                          <Loader2 size={13} className="animate-spin" aria-hidden="true" />
                        ) : (
                          "مطمئنم، حذف کن"
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDeleteId(null)}
                        className="h-8 rounded-lg px-2.5 text-xs text-fog hover:text-ink"
                      >
                        انصراف
                      </Button>
                    </span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmDeleteId(item.id)}
                      disabled={busy}
                      aria-label={`حذف پیام ${item.name || "بی‌نام"}`}
                      className="h-8 gap-1.5 rounded-lg px-2.5 text-xs text-fog hover:text-red-300"
                    >
                      <Trash2 size={13} aria-hidden="true" />
                      حذف
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
