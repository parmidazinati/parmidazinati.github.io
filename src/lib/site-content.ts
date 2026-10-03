/**
 * Site content model + Persian defaults.
 *
 * This module is intentionally free of any server-only imports so it can be
 * used by both server components/API routes and client components (admin
 * panel). Database access lives in `site-content-server.ts`.
 */

export type FocusCard = {
  title: string;
  image: string;
  alt: string;
  concept: string;
};

export type SiteContent = {
  hero: {
    chip: string;
    /** Supports **highlight** markers — text between ** ** renders with the gradient style. */
    headline: string;
    intro: string;
    portraitImage: string;
    portraitAlt: string;
  };
  about: {
    rows: string[];
    interests: string[];
    interestsNote: string;
  };
  /** The brand section is intentionally mysterious: logo + name only. */
  quantum: {
    /** Mysterious line above the Quantum logo — defaults to "...coming soon". */
    comingSoon: string;
  };
  focus: {
    cards: FocusCard[];
  };
  contact: {
    message: string;
    email: string;
  };
  /** Section headings — full editorial control over the page structure. */
  sections: {
    about: {
      eyebrow: string;
      title: string;
      interestsTitle: string;
    };
    focus: {
      eyebrow: string;
      title: string;
    };
    contact: {
      eyebrow: string;
      title: string;
    };
  };
};

export const SITE_SECTIONS = [
  "hero",
  "about",
  "quantum",
  "focus",
  "contact",
  "sections",
] as const;

export type SiteSection = (typeof SITE_SECTIONS)[number];

/** The exact content shipped with the site — used as fallback & reset target. */
export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    chip: "طراح UI/UX · بنیان‌گذار Quantum",
    headline: "ایده‌های بزرگ را به **تجربه‌های ماندگار** تبدیل می‌کنم.",
    intro:
      "من پارمیدا زینتی هستم؛ طراح UI/UX، فارغ‌التحصیل مهندسی کامپیوتر و بنیان‌گذار کوانتوم. اینجا جایی است که طراحی، فناوری و نگاه انسانی به یک مسیر مشترک می‌رسند.",
    portraitImage: "/images/portrait.webp",
    portraitAlt: "پرتره پارمیدا زینتی، طراح UI/UX و بنیان‌گذار Quantum",
  },
  about: {
    rows: [
      "پارمیدا زینتی",
      "طراح UI/UX",
      "فارغ‌التحصیل مهندسی کامپیوتر",
      "ساکن قائمشهر، ایران",
      "علاقه‌مند به طراحی، فناوری، یادگیری و ساختن آینده",
    ],
    interests: [
      "طراحی محصول دیجیتال",
      "تجربه کاربری",
      "فناوری",
      "هوش مصنوعی",
      "آموزش",
      "ساخت محصولات دیجیتال",
      "یادگیری مستمر",
      "آینده‌پژوهی و نوآوری",
    ],
    interestsNote:
      "این حوزه‌ها جهت‌گیری حرفه‌ای من را شکل می‌دهند؛ نقطه‌ای که طراحی، فناوری و نگاه انسانی در آن به هم می‌رسند.",
  },
  quantum: {
    comingSoon: "...coming soon",
  },
  focus: {
    cards: [
      {
        title: "استراتژی",
        image: "/images/focus-strategy.webp",
        alt: "جلسه استراتژی و همکاری تیمی دور یک میز شیشه‌ای در دفتر مدرن",
        concept:
          "تفکر ساختاریافته و تصمیم‌گیری برای رشد محصولات و کسب‌وکارها",
      },
      {
        title: "آموزش",
        image: "/images/focus-education.webp",
        alt: "یادگیری، تدریس و توسعه مهارت با ارائه روی صفحه‌نمایش در فضای کار مدرن",
        concept: "انتقال دانش و ایجاد مسیرهای یادگیری مؤثر",
      },
      {
        title: "هوش مصنوعی",
        image: "/images/focus-ai.webp",
        alt: "تجسم انتزاعی هوش مصنوعی؛ شبکه عصبی درخشان و جریان داده",
        concept: "استفاده از فناوری برای خلق ارزش و نوآوری",
      },
      {
        title: "ساخت دیجیتال",
        image: "/images/focus-digital.webp",
        alt: "کدنویسی و توسعه محصولات دیجیتال روی لپ‌تاپ با چند نمایشگر",
        concept: "تبدیل ایده‌ها به محصولات واقعی",
      },
    ],
  },
  contact: {
    message:
      "اگر درباره طراحی، فناوری، هوش مصنوعی، آموزش یا توسعه محصولات دیجیتال علاقه‌مند به گفت‌وگو یا همکاری هستید، خوشحال می‌شوم در ارتباط باشیم.",
    email: "parmida.zinati8932@gmail.com",
  },
  sections: {
    about: {
      eyebrow: "پروفایل حرفه‌ای",
      title: "درباره من",
      interestsTitle: "حوزه‌های مورد علاقه",
    },
    focus: {
      eyebrow: "مسیرهای من",
      title: "حوزه‌های تمرکز",
    },
    contact: {
      eyebrow: "در تماس باشیم",
      title: "ارتباط با من",
    },
  },
};

/* ------------------------------------------------------------------ */
/* Normalizers — defensively turn arbitrary JSON into valid content    */
/* ------------------------------------------------------------------ */

const str = (value: unknown, fallback: string): string =>
  typeof value === "string" && value.trim().length > 0 ? value : fallback;

const strArr = (value: unknown, fallback: string[]): string[] => {
  if (!Array.isArray(value)) return fallback;
  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return items.length > 0 ? items : fallback;
};

const focusCards = (value: unknown): FocusCard[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_CONTENT.focus.cards;
  }
  return value.slice(0, 8).map((raw, index) => {
    const fallback =
      DEFAULT_CONTENT.focus.cards[index] ?? DEFAULT_CONTENT.focus.cards[0];
    const card = (raw ?? {}) as Record<string, unknown>;
    return {
      title: str(card.title, fallback.title),
      image: str(card.image, fallback.image),
      alt: str(card.alt, fallback.alt),
      concept: str(card.concept, fallback.concept),
    };
  });
};

const sectionHeadings = (value: unknown) => {
  const source = (value ?? {}) as Record<string, unknown>;
  const about = (source.about ?? {}) as Record<string, unknown>;
  const focus = (source.focus ?? {}) as Record<string, unknown>;
  const contact = (source.contact ?? {}) as Record<string, unknown>;
  const fallback = DEFAULT_CONTENT.sections;

  return {
    about: {
      eyebrow: str(about.eyebrow, fallback.about.eyebrow),
      title: str(about.title, fallback.about.title),
      interestsTitle: str(about.interestsTitle, fallback.about.interestsTitle),
    },
    focus: {
      eyebrow: str(focus.eyebrow, fallback.focus.eyebrow),
      title: str(focus.title, fallback.focus.title),
    },
    contact: {
      eyebrow: str(contact.eyebrow, fallback.contact.eyebrow),
      title: str(contact.title, fallback.contact.title),
    },
  };
};

/** Merge an arbitrary stored value over the defaults, section by section. */
export function normalizeContent(raw: unknown): SiteContent {
  const source = (raw ?? {}) as Record<string, unknown>;
  const hero = (source.hero ?? {}) as Record<string, unknown>;
  const about = (source.about ?? {}) as Record<string, unknown>;
  const quantum = (source.quantum ?? {}) as Record<string, unknown>;
  const focus = (source.focus ?? {}) as Record<string, unknown>;
  const contact = (source.contact ?? {}) as Record<string, unknown>;

  return {
    hero: {
      chip: str(hero.chip, DEFAULT_CONTENT.hero.chip),
      headline: str(hero.headline, DEFAULT_CONTENT.hero.headline),
      intro: str(hero.intro, DEFAULT_CONTENT.hero.intro),
      portraitImage: str(
        hero.portraitImage,
        DEFAULT_CONTENT.hero.portraitImage,
      ),
      portraitAlt: str(hero.portraitAlt, DEFAULT_CONTENT.hero.portraitAlt),
    },
    about: {
      rows: strArr(about.rows, DEFAULT_CONTENT.about.rows),
      interests: strArr(about.interests, DEFAULT_CONTENT.about.interests),
      interestsNote: str(
        about.interestsNote,
        DEFAULT_CONTENT.about.interestsNote,
      ),
    },
    quantum: {
      comingSoon: str(
        quantum.comingSoon,
        DEFAULT_CONTENT.quantum.comingSoon,
      ),
    },
    focus: {
      cards: focusCards(focus.cards),
    },
    contact: {
      message: str(contact.message, DEFAULT_CONTENT.contact.message),
      email: str(contact.email, DEFAULT_CONTENT.contact.email),
    },
    sections: sectionHeadings(source.sections),
  };
}

/** Turn a multi-line textarea value into a clean string list. */
export function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Split a headline into plain/highlight/plain segments based on **markers**,
 * so the gradient highlight survives content edits.
 */
export function splitHeadline(
  headline: string,
): { text: string; highlighted: boolean }[] {
  return headline
    .split(/\*\*(.+?)\*\*/g)
    .filter((part) => part.length > 0)
    .map((part, index) => ({ text: part, highlighted: index % 2 === 1 }));
}
