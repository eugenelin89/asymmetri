const problemPoints = [
  "Simulation is scalable, inexpensive, and safe for training.",
  "Reality introduces noise, hardware variability, latency, and partial observability.",
  "Policies that perform well in simulation often degrade at the moment of deployment.",
];

export function ProblemSection() {
  return (
    <section id="problem" className="section-block">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <div className="eyebrow mb-5">The Problem</div>
            <h2 className="section-title">The sim-to-real gap is where most physical AI systems break.</h2>
          </div>
          <div className="space-y-8">
            <p className="section-copy">
              Training in simulation can produce capable agents quickly. Deployment in the physical
              world is different: sensors drift, environments shift, actuators misbehave, and
              assumptions fail under real-world uncertainty.
            </p>
            <div className="grid gap-4">
              {problemPoints.map((point, index) => (
                <div key={point} className="panel flex gap-4 p-5 sm:p-6">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan/20 bg-cyan/10 font-mono text-xs text-cyan">
                    0{index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-300 sm:text-base">{point}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-cyan/20 bg-cyan/10 p-6">
              <div className="label mb-3 text-cyan/80">Definition</div>
              <p className="text-lg leading-8 text-white">
                The sim-to-real gap is the difference between what an agent learns in synthetic
                environments and what it can sustain under physical constraints.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
