import { labs } from "@/content/site";

export function CapabilityDiagram() {
  return (
    <figure className="capability-diagram">
      <div className="capability-diagram__heading" aria-hidden="true">
        <span>Small input</span>
        <span>Greater capability ↗</span>
      </div>
      {labs.diagram.tracks.map((track, index) => (
        <div className="capability-track" key={track.product}>
          <div className="capability-track__input">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              {index === 0 ? (
                <>
                  <circle cx="24" cy="13" r="6" />
                  <path d="M12 40V31a12 12 0 0 1 24 0v9M19 30v10m10-10v10" />
                </>
              ) : (
                <>
                  <rect x="12" y="4" width="24" height="40" rx="4" />
                  <path d="M21 9h6M21 39h6" />
                  <circle cx="24" cy="24" r="5" />
                </>
              )}
            </svg>
            <p>{track.input}</p>
          </div>
          <div className="capability-track__branches">
            {track.steps.map((step) => (
              <span key={step}>{step}</span>
            ))}
          </div>
          <div className="capability-track__output">
            <strong>{track.output}</strong>
            <span>{track.product}</span>
          </div>
        </div>
      ))}
      <figcaption>{labs.diagram.caption}</figcaption>
    </figure>
  );
}
