export function OriginSection() {
  return (
    <section className="section-supporting">
      <div className="section-shell">
        <div className="grid gap-8 border-y border-white/8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <div>
            <div className="eyebrow mb-3">Research Origin</div>
            <h2 className="max-w-2xl text-[2.4rem] font-semibold leading-[1] tracking-[-0.05em] text-white sm:text-[3rem] lg:text-[3.4rem]">
              Emerging from research in collective intelligence.
            </h2>
          </div>
          <div className="space-y-4 pt-1 lg:pl-5">
            <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-[17px]">
              Asymmetri Labs is emerging from a Canada Wide Science Fair 2026 research project
              investigating artificial collective intelligence in swarm robotics.
            </p>
            <p className="max-w-xl text-base leading-7 text-slate-400 sm:text-[17px]">
              The name reflects a core thesis: Physical AI can emerge from decentralized systems,
              without relying only on large centralized models or extreme computational scale.
            </p>
            <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-[17px]">
              That work now informs a broader infrastructure focus: training multi-agent systems
              in simulation and transferring learned policies onto physical robotic platforms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
