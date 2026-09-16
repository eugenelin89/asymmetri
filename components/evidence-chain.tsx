import { motion } from "@/content/site";

export function EvidenceChain() {
  return (
    <ol className="evidence-chain" aria-label="From source video to pitch history">
      {motion.evidence.chain.map((step, index) => (
        <li key={step.title}>
          <span className="evidence-chain__number" aria-hidden="true">
            0{index + 1}
          </span>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
