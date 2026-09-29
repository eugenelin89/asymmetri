import { botsquad } from "@/content/site";

/** A written example, deliberately presented as prose rather than a simulated UI. */
export function WorkerExample() {
  return (
    <figure className="worker-example">
      <div className="product-split">
        <div className="product-heading">
          <p className="eyebrow">{botsquad.example.eyebrow}</p>
          <h2>{botsquad.example.headline}</h2>
        </div>
        <blockquote>{botsquad.example.request}</blockquote>
      </div>
      <ol>
        {botsquad.example.steps.map((step, index) => (
          <li key={step.title}>
            <span aria-hidden="true">0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
      <figcaption>{botsquad.example.caption}</figcaption>
    </figure>
  );
}
