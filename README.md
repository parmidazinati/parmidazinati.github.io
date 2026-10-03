<div dir="rtl">

# وب‌سایت شخصی پارمیدا زینتی · Quantum

وب‌سایت رسمی **پارمیدا زینتی** — طراح UI/UX، فارغ‌التحصیل مهندسی کامپیوتر و بنیان‌گذار **Quantum**.

یک سایت تک‌صفحه‌ایِ فارسی (RTL)، با طراحی شیشه‌ای مدرن، کاملاً واکنش‌گرا و همراه با **پنل مدیریت محتوا** برای ویرایش متن‌ها بدون نیاز به کدنویسی.

</div>

---

## ✨ Features

- **RTL Native / Persian First** — built for Persian from the ground up (Vazirmatn font, logical properties)
- **Premium glassmorphism UI** — frosted glass cards, ambient glows, orbit lines, gradient highlights
- **Data-stream intro preloader** — brand glow → animated `loading…` → progress bar filled with streaming code glyphs, live 0→100% counter, particle field & scan-line, ends with `System Ready` and a zoom-fade into the site (skippable, reduced-motion aware)
- **Content admin panel** — edit every section's copy from the browser (no code deploys needed)
- **Feedback box** — «نظرات و پیشنهادات» section (honeypot + rate-limited) with an inbox tab in the admin panel: unread badge, mark read/unread, bulk read, 2-step delete
- **Visitor counter** — session-based hit counter shown in the desktop nav chip and the mobile menu, formatted with Persian digits
- **Layered stair-step mobile menu** — backdrop → panel → light sweep → items cascade in one by one
- **Sections** — Hero, About, Quantum, Focus Areas (4 cards), Feedback, Contact (copy-to-clipboard email)
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
| Database | Prisma ORM + SQLite (site content key/value store, feedback inbox, visit counter) |
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

On every page load the public site greets visitors with a premium data-stream boot screen in three phases:

1. The brand name «پارمیدا زینتی» fades in with a neon glow
2. A monospaced `loading…` with three sequentially blinking dots
3. A professional progress bar (real 0→100% in ~4s) filled with two counter-scrolling layers of code glyphs (`{} <> () [] == &&`…), a typing boot line synced to the percentage, a moving sheen and a glowing frontier — over a particle field with a faint scan-line

At 100% the label switches to a glowing `System Ready` and the whole screen zoom-fades into the site. It can be skipped («رد شدن» or `Esc`), and `prefers-reduced-motion` gets an instant, static version.

## 🗄 Database Models

- `SiteSetting` — editable content (key/value JSON blobs)
- `Feedback` — visitor comments & suggestions (`name`, `contact`, `message`, `readAt`)
- `VisitCounter` — single-row global session counter

## 📁 Structure

```
src/
├── app/
│   ├── api/
│   │   ├── admin/{login,content,upload}/route.ts  # admin auth + content + image upload API
│   │   ├── feedback/route.ts                # public submit + admin list/read/delete
│   │   └── visits/route.ts                  # session-based visitor counter
│   ├── biayekamnazdikeman/page.tsx          # private admin route (noindex)
│   ├── layout.tsx                           # RTL, fonts, SEO, JSON-LD
│   └── page.tsx                             # dynamic server render
├── components/
│   ├── admin/
│   │   ├── admin-panel.tsx                  # passcode gate + 6-tab editor + upload widget
│   │   └── feedback-tab.tsx                 # feedback inbox (read/unread/delete)
│   ├── site/                                # header (menu + counter), hero, about,
│   │                                        # quantum, focus-areas, feedback, contact,
│   │                                        # footer, preloader…
│   └── site/site-shell.tsx                  # public site + boot state
└── lib/
    ├── site-content.ts                      # types + Persian defaults
    ├── site-content-server.ts               # Prisma read/write
    └── admin-auth.ts                        # constant-time passcode check
```

## 📦 Deployment Notes

- Update the placeholder domain `https://parmidazinati.ir` in `src/app/layout.tsx`, `public/robots.txt` and `public/sitemap.xml` once the real domain is purchased.
- The real portrait already lives at `public/images/portrait.webp` (replaceable from the admin panel at any time).
- Set a strong `ADMIN_PASSCODE` in production — and if you ever want a different secret URL, rename the `src/app/biayekamnazdikeman` folder (and the `Disallow` rule in robots.txt).

### Uploading to GitHub (one command)

Create a **Personal Access Token** on GitHub: `Settings → Developer settings → Personal access tokens → Tokens (classic)` → *Generate new token* with the `repo` scope. Then run:

```bash
bash scripts/push-to-github.sh <github-username> <token> [repo-name]
```

The script creates the repository via the GitHub API, adds the remote (token is **not** stored in `.git/config`) and pushes `main`. The repo is then live at `https://github.com/<username>/<repo-name>`.

### Hosting for a shareable link

This app is a dynamic Next.js server (API routes + SQLite), so GitHub Pages alone can't host it. Easiest stable options:

1. **Vercel** (free) — import the GitHub repo, set `ADMIN_PASSCODE`, build with `bun`. Note: SQLite on serverless resets on redeploy; for durable feedback/visit data, migrate to a hosted Postgres (e.g. Neon/Supabase) by changing the Prisma `datasource`.
2. **Railway / Render** — persistent disk keeps `db/custom.db` intact; set `ADMIN_PASSCODE` and the start command `bun run start` after a build.

---

<div dir="rtl">

© پارمیدا زینتی · Quantum

</div>
