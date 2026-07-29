const flow = [
  ["01", "Athletes + evaluators"],
  ["02", "Structured observations"],
  ["03", "Evaluation cycles"],
  ["04", "Longitudinal record"],
  ["05", "Review + comparison"],
  ["06", "Development conversations"],
];

export function SystemFlow() {
  return (
    <div className="system-flow" aria-label="Asymmetrico Platform system flow">
      {flow.map(([number, label], index) => (
        <div className="system-flow__step" key={number}>
          <span>{number}</span>
          <strong>{label}</strong>
          {index < flow.length - 1 ? <i aria-hidden="true">→</i> : null}
        </div>
      ))}
    </div>
  );
}
