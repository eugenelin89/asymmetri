import { botsquad } from "@/content/site";

/** A written example, deliberately presented as prose rather than a simulated UI. */
export function WorkerExample() {
  return (
    <figure className="worker-example">
      <p className="eyebrow">{botsquad.example.eyebrow}</p>
      <blockquote>{botsquad.example.request}</blockquote>
      <ol>
        {botsquad.example.steps.map((step) => (
          <li key={step.title}><strong>{step.title}.</strong> {step.body}</li>
        ))}
      </ol>
      <figcaption>{botsquad.example.caption}</figcaption>
    </figure>
  );
}
