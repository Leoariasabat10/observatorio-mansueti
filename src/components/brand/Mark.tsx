import { observatorio } from "@/config/observatorio";

// Placeholder mark until the observatory supplies its logo: rising data bars over a baseline.
export function Mark({ className = "size-10", inverted = false }: { className?: string; inverted?: boolean }) {
  const bg = inverted ? "#F8FAFC" : "#0F172A";
  const fg = inverted ? "#0F172A" : "#F8FAFC";
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label={`Logotipo del ${observatorio.shortName}`}>
      <rect width="40" height="40" fill={bg} />
      <rect x="9" y="22" width="5" height="9" fill={fg} />
      <rect x="17.5" y="16" width="5" height="15" fill={fg} />
      <rect x="26" y="9" width="5" height="22" fill="#0284C7" />
      <rect x="9" y="32.5" width="22" height="1.5" fill="#D97706" />
    </svg>
  );
}
