export function HeroSection() {
  return (
    <section id="home" className="section-hero overflow-hidden pt-10 sm:pt-12 lg:pt-14">
      <div className="section-shell">
        <div className="max-w-2xl lg:max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 px-0 py-0">
            <span className="h-1 w-1 rounded-full bg-cyan/80" />
            <span className="eyebrow">Sim-to-Real Infrastructure</span>
          </div>
          <h1 className="max-w-2xl text-[3.15rem] font-semibold leading-[0.92] tracking-[-0.075em] text-white sm:text-[4.45rem] lg:max-w-3xl lg:text-[5.35rem]">
            Infrastructure for
            <br />
            Physical AI
          </h1>
          <p className="mt-3 max-w-2xl text-xl font-medium leading-8 text-white/90 sm:text-[1.42rem] sm:leading-9">
            Bringing AI from simulation into the real world.
          </p>
          <p className="mt-2 max-w-xl text-base leading-7 text-white/65 sm:text-[17px]">
            Asymmetri builds infrastructure that enables AI systems trained in simulation to
            operate reliably in noisy, constrained physical systems.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <a href="mailto:info@asymmetri.co" className="button-primary">
              Get in Touch
            </a>
            <a href="#problem" className="button-secondary">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
