import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  id?: string;
};

/** Consistent premium section header: eyebrow chip + title + lead. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  id,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <Reveal
      className={cn(
        "mb-12 flex flex-col gap-4 sm:mb-16",
        centered ? "items-center text-center" : "items-start text-start"
      )}
    >
      <span className="glass-chip text-aqua">
        <span className="h-1.5 w-1.5 rounded-full bg-aqua shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]" />
        {eyebrow}
      </span>
      <h2
        id={id}
        className="max-w-2xl text-3xl font-extrabold leading-snug tracking-tight text-ink sm:text-4xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base leading-8 text-fog sm:text-lg sm:leading-9">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
