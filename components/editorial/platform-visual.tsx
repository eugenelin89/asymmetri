const athletes = [
  { initials: "AR", name: "Avery R.", role: "Athlete", status: "Complete" },
  { initials: "MN", name: "Morgan N.", role: "Athlete", status: "In review" },
  { initials: "SL", name: "Sam L.", role: "Athlete", status: "Started" },
];

const timeline = [
  { season: "Spring", label: "Self reflection", accent: "clay" },
  { season: "Summer", label: "Coach evaluation", accent: "green" },
  { season: "Fall", label: "Peer perspective", accent: "blue" },
  { season: "Winter", label: "Development review", accent: "ink" },
];

export function PlatformVisual({ compact = false }: { compact?: boolean }) {
  return (
    <figure
      className={`platform-visual ${compact ? "platform-visual--compact" : ""}`}
      aria-labelledby="platform-visual-caption"
    >
      <div className="platform-visual__topbar">
        <div className="platform-visual__mini-mark" aria-hidden="true">
          A
        </div>
        <div>
          <strong>Athlete development</strong>
          <span>Current evaluation cycle</span>
        </div>
        <span className="status-pill">Active</span>
      </div>
      <div className="platform-visual__body">
        <aside aria-label="Synthetic athlete list">
          <span className="ui-label">Athletes · 24</span>
          {athletes.map((athlete) => (
            <div className="athlete-row" key={athlete.initials}>
              <span>{athlete.initials}</span>
              <div>
                <strong>{athlete.name}</strong>
                <small>{athlete.status}</small>
              </div>
            </div>
          ))}
        </aside>
        <div className="athlete-record">
          <div className="athlete-record__header">
            <div>
              <span className="ui-label">Synthetic athlete record</span>
              <h3>Avery’s development</h3>
            </div>
            <span className="athlete-record__score">
              3 <small>perspectives</small>
            </span>
          </div>
          <div className="perspective-bars" aria-label="Perspective completion">
            <div>
              <span>Self</span>
              <i style={{ width: "82%" }} />
            </div>
            <div>
              <span>Peer</span>
              <i style={{ width: "64%" }} />
            </div>
            <div>
              <span>Coach</span>
              <i style={{ width: "91%" }} />
            </div>
          </div>
          <div className="mini-timeline">
            {timeline.map((item) => (
              <div key={item.season}>
                <i className={`dot dot--${item.accent}`} />
                <span>{item.season}</span>
                <small>{item.label}</small>
              </div>
            ))}
          </div>
          <div className="record-note">
            <span className="ui-label">Development focus</span>
            <p>
              Connect game awareness with a more consistent pre-pitch routine.
            </p>
          </div>
        </div>
      </div>
      <figcaption id="platform-visual-caption">
        A privacy-safe reconstruction using synthetic athletes and verified
        platform concepts.
      </figcaption>
    </figure>
  );
}
