import type { Metadata, Viewport } from "next";
import { Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";

/**
 * NOTE: Replace SITE_URL with the real public domain when the site is deployed.
 * It is used for canonical URL, Open Graph and sitemap.
 */
const SITE_URL = "https://parmidazinati.ir";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Parmida Zinati",
  "alternateName": "پارمیدا زینتی",
  "jobTitle": "UI/UX Designer",
  "description":
    "طراح UI/UX، فارغ‌التحصیل مهندسی کامپیوتر و بنیان‌گذار Quantum",
  "email": "mailto:parmida.zinati8932@gmail.com",
  "url": SITE_URL,
  "image": `${SITE_URL}/images/portrait.png`,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Qaemshahr",
    "addressCountry": "IR",
  },
  "worksFor": {
    "@type": "Organization",
    "name": "Quantum",
    "founder": {
      "@type": "Person",
      "name": "Parmida Zinati",
    },
  },
  "knowsAbout": [
    "UI/UX Design",
    "Digital Product Design",
    "User Experience",
    "Artificial Intelligence",
    "Technology",
    "Education",
    "Innovation",
    "Futures Studies",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "پارمیدا زینتی | طراح UI/UX و بنیان‌گذار Quantum",
    template: "%s | پارمیدا زینتی",
  },
  description:
    "وب‌سایت رسمی پارمیدا زینتی؛ طراح UI/UX، فارغ‌التحصیل مهندسی کامپیوتر و بنیان‌گذار Quantum از قائمشهر ایران — جایی که طراحی، فناوری و نگاه انسانی به یک مسیر مشترک می‌رسند.",
  keywords: [
    "پارمیدا زینتی",
    "طراح UI/UX",
    "Quantum",
    "کوانتوم",
    "طراحی رابط کاربری",
    "تجربه کاربری",
    "قائمشهر",
    "Parmida Zinati",
  ],
  authors: [{ name: "Parmida Zinati" }],
  creator: "Parmida Zinati",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "پارمیدا زینتی | طراح UI/UX و بنیان‌گذار Quantum",
    description:
      "ایده‌های بزرگ را به تجربه‌های ماندگار تبدیل می‌کنم. طراح UI/UX و بنیان‌گذار Quantum از قائمشهر، ایران.",
    url: "/",
    siteName: "Parmida Zinati — Quantum",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "/images/portrait.png",
        width: 768,
        height: 1344,
        alt: "پرتره پارمیدا زینتی، طراح UI/UX و بنیان‌گذار Quantum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "پارمیدا زینتی | طراح UI/UX و بنیان‌گذار Quantum",
    description:
      "ایده‌های بزرگ را به تجربه‌های ماندگار تبدیل می‌کنم. طراح UI/UX و بنیان‌گذار Quantum.",
    images: ["/images/portrait.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050a14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${geistMono.variable}`}>
      <body className="bg-background text-foreground antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
