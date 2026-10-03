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

Two ways to open the content manager:

1. **Footer button** — the discreet «مدیریت سایت» button at the bottom of the page
2. **Direct link** — `http://localhost:3000/?admin=1`

The passcode is read from the `ADMIN_PASSCODE` variable in `.env` (server-side only; change it before deploying).

What you can edit from the panel:

- **معرفی (Hero)** — chip label, headline (use `**text**` for the gradient highlight), intro, portrait image + alt
- **درباره من** — profile rows, interest chips, closing note
- **Quantum** — both paragraphs and brand pillars
- **حوزه‌های تمرکز** — title / description / image / alt of each of the 4 cards
- **تماس** — contact email and invitation text

Saves go to SQLite (Prisma `SiteSetting` table) and appear on the public site immediately. «بازگردانی متن‌های پیش‌فرض» restores the original copy in the form.

## 📁 Structure

```
src/
├── app/
│   ├── api/admin/{login,content}/route.ts   # admin auth + content API
│   ├── layout.tsx                           # RTL, fonts, SEO, JSON-LD
│   └── page.tsx                             # dynamic server render
├── components/
│   ├── admin/admin-panel.tsx                # passcode gate + 5-tab editor
│   ├── site/                                # header, hero, about, quantum,
│   │                                        # focus-areas, contact, footer…
│   └── site/site-shell.tsx                  # public site ⇄ admin switcher
└── lib/
    ├── site-content.ts                      # types + Persian defaults
    ├── site-content-server.ts               # Prisma read/write
    └── admin-auth.ts                        # constant-time passcode check
```

## 📦 Deployment Notes

- Update the placeholder domain `https://parmidazinati.ir` in `src/app/layout.tsx`, `public/robots.txt` and `public/sitemap.xml` once the real domain is purchased.
- Replace the placeholder portrait with a real photo at `public/images/portrait.webp` (or change the path from the admin panel).
- Set a strong `ADMIN_PASSCODE` in production.

---

<div dir="rtl">

© پارمیدا زینتی · Quantum

</div>
