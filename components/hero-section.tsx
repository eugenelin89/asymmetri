import { HeroSignalVisual } from "@/components/hero-signal-visual";
import { ProductMockup } from "@/components/product-mockup";

export function HeroSection() {
  return (
    <section id="home" className="section-block overflow-hidden pt-16 sm:pt-20 lg:pt-24">
      <div className="section-shell">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative">
            <div className="eyebrow mb-6">Sim-to-Real Infrastructure</div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Infrastructure for Physical AI
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Asymmetri builds infrastructure that enables AI systems trained in simulation to
              operate reliably in the real world.
            </p>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-400">
              We are building the layer between scalable simulated training and deployment into
              noisy, constrained physical systems.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="mailto:info@asymmetri.co"
                className="inline-flex items-center justify-center rounded-full bg-cyan px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-mist"
              >
                Get in Touch
              </a>
              <a
                href="#problem"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white transition hover:border-cyan/40 hover:bg-white/[0.05]"
              >
                Learn More
              </a>
            </div>
            <div className="mt-12 flex flex-wrap gap-6 border-t border-white/10 pt-8 text-sm text-slate-400">
              <div>
                <div className="label mb-2">Focus</div>
                <div>Training, transfer, deployment</div>
              </div>
              <div>
                <div className="label mb-2">Positioning</div>
                <div>Infrastructure layer for Physical AI</div>
              </div>
              <div>
                <div className="label mb-2">Location</div>
                <div>Vancouver, Canada</div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col gap-6">
            <HeroSignalVisual />
            <ProductMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
