export function ProblemSection() {
  return (
    <section id="problem" className="section-block pt-8 sm:pt-10 lg:pt-12">
      <div className="section-shell">
        <div className="grid gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
          <div className="pt-0.5">
            <div className="eyebrow mb-2">The Problem</div>
            <h2 className="max-w-2xl text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-[3.35rem] lg:text-[3.8rem]">
              The sim-to-real gap
              <br />
              is where systems fail.
            </h2>
            <div className="mt-3 accent-rule" />
          </div>
          <div className="space-y-4 pt-1 lg:pl-5">
            <p className="max-w-md text-[17px] leading-8 text-white/68">
              Training in simulation is efficient. Deployment is not. Sensors drift, environments
              shift, and assumptions collapse under real-world uncertainty.
            </p>
            <p className="max-w-md text-[17px] leading-8 text-white/68">
              Simulation is scalable, cheap, and safe for training. Reality adds hardware
              variability, latency, and partial observability. Policies that perform well in
              simulation often fail at transfer.
            </p>
            <p className="max-w-md text-[17px] font-medium leading-8 text-white/88">
              This is why most AI systems never leave simulation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
