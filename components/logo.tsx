import { site } from "@/content/site";

type LogoProps = {
  tone?: "ink" | "canvas";
  compact?: boolean;
  className?: string;
};

export function Logo({
  tone = "ink",
  compact = false,
  className = "",
}: LogoProps) {
  return (
    <span
      className={`brand-logo brand-logo--${tone} ${compact ? "brand-logo--compact" : ""} ${className}`}
      aria-label={site.company.name}
    >
      <svg
        className="brand-logo__mark"
        viewBox="0 0 96 96"
        aria-hidden="true"
      >
        <path
          d="M10 80 39 17h14L26 68h31l8 12H10Z"
          fill="currentColor"
        />
        <path
          d="m48 39 10-12 29 53H72L52 45l-4-6Z"
          className="brand-logo__accent"
        />
      </svg>
      {!compact ? (
        <span className="brand-logo__word">
          {site.company.name}
        </span>
      ) : null}
    </span>
  );
}
