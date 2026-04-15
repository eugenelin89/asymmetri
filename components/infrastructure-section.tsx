const layers = [
  {
    title: "Training Layer",
    copy:
      "Build high-throughput simulated environments, RL pipelines, curricula, and multi-agent training loops.",
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
      "Define the contracts that let policies survive transfer: observation mappings, action surfaces, noise models, and calibration.",
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
      "Operationalize physical AI with runtime deployment, sensor integration, edge inference, and live monitoring.",
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
        <div className="mb-9 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="eyebrow mb-4">Infrastructure</div>
            <h2 className="section-title">From training to transfer to deployment.</h2>
            <div className="mt-6 accent-rule" />
          </div>
          <p className="section-copy max-w-xl">
            A stack designed to move learned capability into production physical systems.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.28fr_0.72fr]">
          <div className="panel overflow-hidden p-5 sm:p-6">
            <div className="mb-5 border-b border-white/6 pb-3">
              <div className="label">Core Infrastructure Layers</div>
              <div className="mt-2 text-lg font-medium text-white">Product architecture overview</div>
            </div>
            <div className="overflow-hidden rounded-[18px] border border-white/6 bg-slate-950/38">
              {layers.map((layer, index) => (
                <div
                  key={layer.title}
                  className="relative p-4 sm:p-5"
                >
                  {index > 0 ? (
                    <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  ) : null}
                  <div className="flex flex-col gap-3.5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-xl">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-cyan/15 bg-cyan/[0.06] font-mono text-[11px] text-cyan">
                          {index + 1}
                        </span>
                        <h3 className="text-[1.4rem] font-medium tracking-[-0.04em] text-white">
                          {layer.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-[1.65rem] text-slate-300 sm:text-[15px]">{layer.copy}</p>
                    </div>
                    <div className="grid gap-1 text-sm text-slate-300 sm:min-w-[230px]">
                      {layer.bullets.map((bullet) => (
                        <div key={bullet} className="border-b border-white/5 py-1 last:border-b-0">
                          {bullet}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel flex flex-col justify-between p-5 sm:p-6">
            <div>
              <div className="label">What Asymmetri Labs does</div>
              <div className="mt-4 text-lg font-medium tracking-[-0.03em] text-white">
                From training to real-world operation.
              </div>
              <div className="mt-4 space-y-2.5">
                <div className="border-b border-white/5 pb-2.5">
                  <div className="text-sm text-cyan">Train in simulation</div>
                  <p className="mt-1 text-sm leading-[1.65rem] text-slate-300">
                    Develop policies where iteration is cheap, safe, and data-rich.
                  </p>
                </div>
                <div className="border-b border-white/5 pb-2.5">
                  <div className="text-sm text-cyan">Transfer across the gap</div>
                  <p className="mt-1 text-sm leading-[1.65rem] text-slate-300">
                    Make the move into reality measurable, auditable, and resilient.
                  </p>
                </div>
                <div>
                  <div className="text-sm text-cyan">Deploy into physical systems</div>
                  <p className="mt-1 text-sm leading-[1.65rem] text-slate-300">
                    Operate against real sensors, hardware constraints, and continuous feedback.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[18px] border border-white/6 bg-white/[0.015] p-4">
              <div className="label mb-2 text-white/50">Why now</div>
              <p className="text-sm leading-[1.65rem] text-slate-200">
                AI is becoming capable enough to act. The missing infrastructure is what lets that
                capability survive contact with the physical world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
