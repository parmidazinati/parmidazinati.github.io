import { cn } from "@/lib/utils";

/**
 * Quantum brand mark — an atom/orbit inspired "Q".
 * Pure inline SVG so it stays crisp at any size and adds zero network cost.
 */
export function QuantumMark({
  className,
  size = 36,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="qmk-g" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22D3EE" />
          <stop offset="0.55" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#2DD4BF" />
        </linearGradient>
      </defs>
      {/* nucleus */}
      <circle cx="30" cy="34" r="11" stroke="url(#qmk-g)" strokeWidth="4.5" />
      {/* orbit ring */}
      <ellipse
        cx="30"
        cy="34"
        rx="24"
        ry="9.5"
        stroke="url(#qmk-g)"
        strokeOpacity="0.55"
        strokeWidth="2.5"
        transform="rotate(-24 30 34)"
      />
      {/* electron */}
      <circle cx="50.5" cy="20" r="3.4" fill="#22D3EE" />
      {/* subtle inner spark */}
      <circle cx="30" cy="34" r="3" fill="url(#qmk-g)" fillOpacity="0.9" />
    </svg>
  );
}
