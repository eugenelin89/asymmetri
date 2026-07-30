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
  const color = tone === "canvas" ? "#FAF8F3" : "#0B1020";

  return (
    <span
      className={`brand-logo ${compact ? "brand-logo--compact" : ""} ${className}`}
      aria-label="Asymmetri Labs"
    >
      <svg
        className="brand-logo__mark"
        viewBox="0 0 96 96"
        aria-hidden="true"
      >
        <path
          d="M10 80 39 17h14L26 68h31l8 12H10Z"
          fill={color}
        />
        <path
          d="m48 39 10-12 29 53H72L52 45l-4-6Z"
          fill="#C86D45"
        />
      </svg>
      {!compact ? (
        <span className="brand-logo__word" style={{ color }}>
          Asymmetri <span>Labs</span>
        </span>
      ) : null}
    </span>
  );
}
