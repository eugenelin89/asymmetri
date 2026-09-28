import { botsquad } from "@/content/site";

export function WorkerDiagram() {
  return (
    <figure className="worker-diagram">
      <div className="worker-diagram__brief">
        <span>Your direction</span>
        <p>A clear task. Defined boundaries.</p>
      </div>
      <ol>
        {botsquad.example.steps.map((step, index) => (
          <li key={step.title}>
            <span aria-hidden="true">0{index + 1}</span>
            <strong>{step.title}</strong>
            <span className="worker-diagram__line" aria-hidden="true" />
          </li>
        ))}
      </ol>
      <div className="worker-diagram__result">
        <span>Back to you</span>
        <p>Evidence you can inspect.</p>
      </div>
      <figcaption>{botsquad.example.caption}</figcaption>
    </figure>
  );
}
