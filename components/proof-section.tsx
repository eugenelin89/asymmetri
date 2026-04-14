const differentiators = [
  {
    title: "Sim-to-real is the product boundary",
    copy: "We treat transfer and deployment as first-class infrastructure problems, not edge cases after training.",
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
    <section id="proof" className="section-block">
      <div className="section-shell">
        <div className="grid gap-14">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <div className="eyebrow mb-5">Why Asymmetri Is Different</div>
              <h2 className="section-title">
                Designed as foundational infrastructure for real-world autonomous systems.
              </h2>
            </div>
            <div className="grid gap-4">
              {differentiators.map((item) => (
                <div key={item.title} className="panel p-6">
                  <h3 className="text-xl font-medium tracking-[-0.03em] text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel grid gap-8 overflow-hidden p-6 sm:p-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="eyebrow mb-4">Proven in Multi-Agent Environments</div>
              <h3 className="text-3xl font-semibold tracking-[-0.04em] text-white">
                A harder test case for infrastructure robustness.
              </h3>
              <p className="mt-5 text-base leading-8 text-slate-300">
                Asymmetri&apos;s early systems include decentralized multi-agent deployments, where
                policies trained in simulation are transferred into real-world robotic agents.
                These environments are intentionally demanding: coordination must emerge under
                uncertainty, noise, and hardware constraints.
              </p>
              <p className="mt-5 text-base leading-8 text-slate-400">
                We view this as evidence of platform strength, not the limit of the company. If the
                stack can support distributed, stigmergic, multi-agent behavior in the field, it
                can support a broad range of physical AI systems beyond that proof point.
              </p>
            </div>

            <div className="relative rounded-[28px] border border-white/10 bg-slate-950/70 p-5">
              <div className="label mb-4">Flagship demonstration</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-sm text-cyan">Emergent coordination</div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Policies coordinate through shared environments rather than centralized control.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-sm text-cyan">Real-world uncertainty</div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Sensor noise, timing drift, and partial observability force stronger transfer assumptions.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-sm text-cyan">Distributed deployment</div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Runtime systems must manage many agents, not a single isolated policy endpoint.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-sm text-cyan">Generalizable layer</div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
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
