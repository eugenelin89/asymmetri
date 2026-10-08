import { botsquad } from "@/content/site";

/** An illustrative scenario; no simulated product UI or claim of a completed project. */
export function WorkerExample() {
  const example = botsquad.example;
  return (
    <figure className="squad-example product-split">
      <figcaption className="product-heading">
        <p className="eyebrow">{example.eyebrow}</p>
        <h2>{example.headline}</h2>
        <blockquote>{example.request}</blockquote>
      </figcaption>
      <ol className="squad-example__flow">
        {example.steps.map((step, index) => (
          <li key={step.title}>
            <span aria-hidden="true">0{index + 1}</span>
            <div><h3>{step.title}</h3><p>{step.body}</p></div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
