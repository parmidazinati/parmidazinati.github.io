# Project Worklog

---
Task ID: 1
Agent: Z.ai Code (main)
Task: طراحی و پیاده‌سازی وب‌سایت شخصی پریمیوم پارمیدا زینتی (طراح UI/UX و بنیان‌گذار Quantum) — RTL، فارسی‌اول، تک‌صفحه‌ای

Work Log:
- بررسی ساختار پروژه Next.js 16 + Tailwind 4 + shadcn/ui و دسترسی شبکه
- تولید ۵ تصویر با اسکیل image-generation (پرتره + ۴ کارت حوزه تمرکز) در public/images/*.webp با گرید رنگی یکپارچه سرمه‌ای/فیروزه‌ای
- بازنویسی globals.css: پالت Quantum (night #050a14, ink #e8eef8, aqua #22d3ee, lagoon #2dd4bf, iris #a78bfa)، توکن‌های شیشه‌ای (glass, glass-chip, glass-frame, btn-primary, btn-glass, text-gradient)، انیمیشن‌های orbit/float/sheen، اسکرول‌بار سفارشی، prefers-reduced-motion
- بازنویسی layout.tsx: RTL (dir="rtl" lang="fa")، فونت Vazirmatn + Geist Mono از next/font، متادیتای کامل SEO (canonical/OG/Twitter)، JSON-LD Person، viewport themeColor
- ساخت کامپوننت‌ها در src/components/site: quantum-mark (لوگوی SVG)، ambient (پس‌زمینه گرادیانی/گرید/نویز)، reveal (FadeUp+BlurReveal با پشتیبانی reduced-motion)، header (شیشه‌ای چسبان + scrollspy + منوی موبایل AnimatePresence)، hero (قاب شیشه‌ای پرتره + مدارهای چرخان + چیپ‌های شناور)، about (کارت پروفایل + علاقه‌مندی‌ها)، quantum-section (نشان برند + ستون‌ها)، focus-areas (۴ کارت تصویری با Next Image lazy)، contact (کپی ایمیل + mailto)، footer (سال داینامیک + اعتبار تصاویر)
- page.tsx تک‌صفحه‌ای با skip-link، فوتر چسبان (min-h-svh flex + mt-auto)
- SEO فایل‌ها: robots.txt (با Sitemap)، sitemap.xml، favicon (app/icon.svg)
- رفع باگ کش CSS (ری‌استارت سرور با .zscripts/dev.sh)، اصلاح ساختار باکس ایمیل (سرریز دکمه)، اصلاح سینتکس important ترِیلینگ Tailwind v4
- راستی‌آزمایی کامل با tsc/eslint (بدون خطا در src) و agent-browser: رندر همه ۵ سکشن، اسکرول‌اسپای، منوی موبایل، دکمه کپی ایمیل («کپی شد»)، فوتر چسبان، نمای موبایل ۳۹۰px و دسکتاپ ۱۴۴۰px، کنسول بدون خطا

Stage Summary:
- سایت تک‌صفحه‌ای Production-Ready با هویت بصری Quantum (شیشه‌ای/لوکس/آینده‌نگر) و صرفاً داده‌های واقعی ارائه‌شده
- نکته برای کاربر: پرتره فعلاً تصویر تولیدیplaceholder است — جایگزینی با عکس واقعی در public/images/portrait.webp
- نکته برای کاربر: دامنه placeholder «https://parmidazinati.ir» در layout.tsx، public/robots.txt و public/sitemap.xml باید پس از خرید دامنه واقعی به‌روزرسانی شود
- سرور توسعه روی پورت ۳۰۰۰ در حال اجرا (لاگ: dev.log)
