<div dir="rtl">

# وب‌سایت شخصی پارمیدا زینتی · Quantum

وب‌سایت رسمی **پارمیدا زینتی** — طراح UI/UX، فارغ‌التحصیل مهندسی کامپیوتر و بنیان‌گذار **Quantum**.

یک سایت تک‌صفحه‌ایِ فارسی (RTL)، با طراحی شیشه‌ای مدرن، کاملاً واکنش‌گرا و همراه با **پنل مدیریت محتوا** برای ویرایش متن‌ها بدون نیاز به کدنویسی.

</div>

---

## ✨ Features

- **RTL Native / Persian First** — built for Persian from the ground up (Vazirmatn font, logical properties)
- **Premium glassmorphism UI** — frosted glass cards, ambient glows, orbit lines, gradient highlights
- **Content admin panel** — edit every section's copy from the browser (no code deploys needed)
- **Sections** — Hero, About, Quantum, Focus Areas (4 cards), Contact (copy-to-clipboard email)
- **Motion** — scroll reveal / blur-in animations with full `prefers-reduced-motion` support
- **Accessible** — semantic HTML, ARIA labels, keyboard navigation, skip link, focus states
- **SEO** — metadata, Open Graph, Twitter Cards, JSON-LD (`Person`), `robots.txt`, `sitemap.xml`
- **Responsive** — mobile-first, tested from 390px to 1440px+

## 🛠 Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) + TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui + Lucide icons |
| Motion | Framer Motion |
| Database | Prisma ORM + SQLite (site content key/value store) |
| Runtime | Bun |

## 🚀 Getting Started

```bash
# 1. install dependencies
bun install

# 2. create your env file
cp .env.example .env
#    then set DATABASE_URL and ADMIN_PASSCODE inside it

# 3. create the database schema
bun run db:push

# 4. run the dev server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🔐 Admin Panel (مدیریت محتوا)

The admin panel is **completely hidden from the public site** — no buttons, no links. It lives on its own private route:

```
/biayekamnazdikeman
```

- Not linked anywhere on the site and marked `noindex` + `Disallow` in robots.txt.
- A passcode gate protects it — the passcode is read from the `ADMIN_PASSCODE` variable in `.env` (server-side only; change it before deploying).
- «بازگشت به سایت» in the panel always lands on a fresh render of `/`.

What you can edit from the panel (full editorial control):

- **معرفی (Hero)** — chip label, headline (use `**text**` for the gradient highlight), intro, portrait image + alt
- **درباره من** — section eyebrow/title, interest-card title, profile rows, interest chips, closing note
- **Quantum** — only the mysterious line above the logo (default `...coming soon`); the brand block itself stays minimal: logo + name
- **حوزه‌های تمرکز** — section eyebrow/title plus title / description / image / alt of each of the 4 cards
- **تماس** — section eyebrow/title, contact email and invitation text

Images can be **uploaded directly** from the panel (drag & drop or file picker → PNG / JPG / WebP up to 5 MB) — files land in `public/uploads/` and the path fills in automatically. Typing a path from `public/` manually still works too.

Saves go to SQLite (Prisma `SiteSetting` table) and appear on the public site immediately. «بازگردانی متن‌های پیش‌فرض» restores the original copy in the form.

## ✨ Intro Preloader

On every page load the public site greets visitors with a terminal-style boot screen: a single loading box that literally fills up with code (with a live percentage in its title bar and a soft glow rising inside). When the box is full, the site appears. It can be skipped («رد شدن» or `Esc`), and it is replaced by a short static version when `prefers-reduced-motion` is set.

## 📁 Structure

```
src/
├── app/
│   ├── api/admin/{login,content,upload}/route.ts  # admin auth + content + image upload API
│   ├── biayekamnazdikeman/page.tsx          # private admin route (noindex)
│   ├── layout.tsx                           # RTL, fonts, SEO, JSON-LD
│   └── page.tsx                             # dynamic server render
├── components/
│   ├── admin/admin-panel.tsx                # passcode gate + 5-tab editor + upload widget
│   ├── site/                                # header, hero, about, quantum,
│   │                                        # focus-areas, contact, footer, preloader…
│   └── site/site-shell.tsx                  # public site + boot state
└── lib/
    ├── site-content.ts                      # types + Persian defaults
    ├── site-content-server.ts               # Prisma read/write
    └── admin-auth.ts                        # constant-time passcode check
```

## 📦 Deployment Notes

- Update the placeholder domain `https://parmidazinati.ir` in `src/app/layout.tsx`, `public/robots.txt` and `public/sitemap.xml` once the real domain is purchased.
- Replace the placeholder portrait with a real photo at `public/images/portrait.webp` (or upload it from the admin panel).
- Set a strong `ADMIN_PASSCODE` in production — and if you ever want a different secret URL, rename the `src/app/biayekamnazdikeman` folder (and the `Disallow` rule in robots.txt).

---

<div dir="rtl">

© پارمیدا زینتی · Quantum

</div>
