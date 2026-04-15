export function VisionSection() {
  return (
    <section id="vision" className="section-supporting">
      <div className="section-shell">
        <div className="panel overflow-hidden px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="eyebrow mb-4">Vision</div>
              <h2 className="section-title max-w-2xl">
                The next frontier of AI is not more software. It is intelligence operating in the
                physical world.
              </h2>
              <div className="mt-6 accent-rule" />
            </div>
            <div className="space-y-6">
              <p className="text-base leading-8 text-slate-300 sm:text-lg">
                Much of modern AI still lives in digital environments. The next wave depends on
                systems that can perceive, adapt, coordinate, and act under real-world conditions.
              </p>
              <p className="text-base leading-8 text-slate-400 sm:text-lg">
                Asymmetri aims to build the infrastructure that makes that transition possible:
                rigorous enough for deployment and extensible enough for future classes of
                autonomous systems.
              </p>
              <div className="rounded-[28px] border border-cyan/20 bg-cyan/10 p-6">
                <div className="label mb-3 text-cyan/80">Positioning</div>
                <p className="text-lg leading-8 text-white">
                  The missing layer between simulation and reality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
