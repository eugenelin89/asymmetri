import { site } from "@/content/site";

export function PerspectiveDiagram() {
  return (
    <div className="perspective-diagram">
      <div className="perspective-diagram__inputs">
        {site.perspectives.map((item) => (
          <article
            className={`perspective-card perspective-card--${item.accent}`}
            key={item.key}
          >
            <span>{item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
      <div className="perspective-diagram__join" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="perspective-diagram__outcome">
        <span className="eyebrow">Not one score</span>
        <strong>A richer picture, built over time.</strong>
      </div>
    </div>
  );
}
