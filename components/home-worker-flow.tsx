import { labs } from "@/content/site";

export function HomeWorkerFlow() {
  return (
    <figure className="worker-flow home-worker-flow">
      <div className="home-worker-flow__summary">
        <p className="eyebrow">Your direction</p>
        <p>A clear task. Defined boundaries.</p>
      </div>
      <ol>
        {labs.botsquadPreview.steps.map((step, index) => (
          <li key={step}>
            <span aria-hidden="true">0{index + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="home-worker-flow__summary">
        <p className="eyebrow">Back to you</p>
        <p>Evidence you can inspect.</p>
      </div>
      <figcaption>{labs.botsquadPreview.caption}</figcaption>
    </figure>
  );
}
