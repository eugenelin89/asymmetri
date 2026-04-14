const layers = [
  {
    title: "Training Layer",
    copy:
      "Build high-throughput simulated environments, reinforcement learning pipelines, curricula, and multi-agent training loops.",
    bullets: [
      "Simulation environments",
      "Reinforcement learning pipelines",
      "Curriculum learning",
      "Multi-agent training",
    ],
  },
  {
    title: "Transfer Layer",
    copy:
      "Define the contracts that let policies survive transfer: observation and action mappings, noise models, validation, and calibration.",
    bullets: [
      "Observation and action contracts",
      "Noise modeling",
      "Domain randomization",
      "Validation and calibration",
    ],
  },
  {
    title: "Deployment Layer",
    copy:
      "Operationalize physical AI with runtime deployment, sensor integration, edge inference, and live system monitoring.",
    bullets: [
      "Edge inference",
      "Real-world sensor integration",
      "Runtime deployment tools",
      "Live monitoring and adaptation",
    ],
  },
];

export function InfrastructureSection() {
  return (
    <section id="infrastructure" className="section-block">
      <div className="section-shell">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="eyebrow mb-5">Infrastructure</div>
            <h2 className="section-title">From training to transfer to deployment.</h2>
          </div>
          <p className="section-copy max-w-xl">
            Asymmetri is building infrastructure rather than one-off demos: a stack designed to
            move learned capability into production physical systems.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="panel overflow-hidden p-6 sm:p-8">
            <div className="grid gap-4">
              {layers.map((layer, index) => (
                <div
                  key={layer.title}
                  className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-xl">
                      <div className="mb-3 flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan/20 bg-cyan/10 font-mono text-xs text-cyan">
                          {index + 1}
                        </span>
                        <h3 className="text-2xl font-medium tracking-[-0.04em] text-white">
                          {layer.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-7 text-slate-300 sm:text-base">{layer.copy}</p>
                    </div>
                    <div className="grid gap-2 text-sm text-slate-400">
                      {layer.bullets.map((bullet) => (
                        <div key={bullet} className="rounded-full border border-white/10 px-3 py-2">
                          {bullet}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel flex flex-col justify-between p-6 sm:p-8">
            <div>
              <div className="label">What Asymmetri does</div>
              <div className="mt-4 space-y-5">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-sm text-cyan">Train in simulation</div>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Develop policies where iteration is cheap, safe, and data-rich.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-sm text-cyan">Transfer across the gap</div>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Make the move into reality measurable, auditable, and resilient.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-sm text-cyan">Deploy into physical systems</div>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Operate against real sensors, hardware constraints, and continuous feedback.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[28px] border border-cyan/20 bg-cyan/10 p-5">
              <div className="label mb-2 text-cyan/80">Why now</div>
              <p className="text-sm leading-7 text-slate-200">
                AI has become capable enough to act. The missing infrastructure is what lets that
                capability survive contact with the physical world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
