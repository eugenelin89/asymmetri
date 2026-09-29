import { botsquad } from "@/content/site";

export function WorkerFlow() {
  return (
    <figure className="worker-flow">
      <figcaption>{botsquad.workflowHeadline}</figcaption>
      <ol>
        {botsquad.workflow.map((step, index) => (
          <li key={step.title}>
            <span aria-hidden="true">0{index + 1}</span>
            <span>{step.title}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
