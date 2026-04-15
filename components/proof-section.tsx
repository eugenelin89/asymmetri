const differentiators = [
  {
    title: "Sim-to-real is the product boundary",
    copy: "Transfer and deployment are treated as core infrastructure problems, not edge cases after training.",
  },
  {
    title: "Infrastructure mindset",
    copy: "The goal is a repeatable layer for physical AI systems, not isolated robotics demonstrations.",
  },
  {
    title: "Built for harder environments",
    copy: "Decentralized multi-agent systems are an early proof point because they expose coordination, noise, and runtime complexity quickly.",
  },
];

export function ProofSection() {
  return (
    <section id="proof" className="section-block pt-20 sm:pt-24 lg:pt-28">
      <div className="section-shell">
        <div className="grid gap-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <div className="eyebrow mb-4">Why Asymmetri Is Different</div>
              <h2 className="section-title">
                Designed as foundational infrastructure for real-world autonomous systems.
              </h2>
              <div className="mt-6 accent-rule" />
            </div>
            <div className="grid gap-4">
              {differentiators.map((item) => (
                <div key={item.title} className="muted-card p-5">
                  <h3 className="text-xl font-medium tracking-[-0.03em] text-white">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-[1.65rem] text-slate-300 sm:text-base">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel grid gap-6 overflow-hidden p-6 sm:p-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <div className="eyebrow mb-4">Proven in Multi-Agent Environments</div>
              <h3 className="text-3xl font-semibold tracking-[-0.04em] text-white">
                A harder test case for infrastructure robustness.
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Asymmetri&apos;s early systems include decentralized multi-agent deployments, where
                policies trained in simulation are transferred into real-world robotic agents.
                These environments are intentionally demanding.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-400">
                Coordination must emerge under uncertainty, noise, and hardware constraints. We
                view this as evidence of platform strength, not the limit of the company.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-slate-950/55 p-5 sm:p-6">
              <div className="label mb-5">Flagship demonstration</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border-b border-white/8 pb-4 sm:border-b-0 sm:pb-0">
                  <div className="text-sm text-cyan">Emergent coordination</div>
                  <p className="mt-2.5 text-sm leading-[1.65rem] text-slate-300">
                    Policies coordinate through shared environments rather than centralized control.
                  </p>
                </div>
                <div className="border-b border-white/8 pb-4 sm:border-b-0 sm:pb-0">
                  <div className="text-sm text-cyan">Real-world uncertainty</div>
                  <p className="mt-2.5 text-sm leading-[1.65rem] text-slate-300">
                    Sensor noise, timing drift, and partial observability force stronger transfer assumptions.
                  </p>
                </div>
                <div>
                  <div className="text-sm text-cyan">Distributed deployment</div>
                  <p className="mt-2.5 text-sm leading-[1.65rem] text-slate-300">
                    Runtime systems must manage many agents, not a single isolated policy endpoint.
                  </p>
                </div>
                <div>
                  <div className="text-sm text-cyan">Generalizable layer</div>
                  <p className="mt-2.5 text-sm leading-[1.65rem] text-slate-300">
                    Success here suggests infrastructure that can generalize to broader physical AI categories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
