/**
 * Global ambient background — layered gradient lighting, a faint
 * blueprint grid and a subtle noise texture. Purely decorative.
 */
export function Ambient() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* base vertical wash */}
      <div className="absolute inset-0 bg-linear-to-b from-[#08101f] via-[#050a14] to-[#04070f]" />

      {/* ambient glows */}
      <div className="absolute -top-40 start-[-10%] h-[34rem] w-[34rem] rounded-full bg-aqua/[0.07] blur-[130px]" />
      <div className="absolute top-[22%] end-[-12%] h-[30rem] w-[30rem] rounded-full bg-iris/[0.05] blur-[140px]" />
      <div className="absolute bottom-[-15%] start-[28%] h-[30rem] w-[30rem] rounded-full bg-lagoon/[0.05] blur-[150px]" />

      {/* blueprint grid, softly masked toward the edges */}
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_20%,black_30%,transparent_100%)]" />

      {/* fine noise for a premium finish */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
