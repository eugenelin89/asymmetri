export function ContactSection() {
  return (
    <section id="contact" className="section-block pt-12 sm:pt-16">
      <div className="section-shell">
        <div className="panel overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="eyebrow mb-5">Contact</div>
              <h2 className="section-title max-w-2xl">
                For early collaborators, research conversations, and deployment partners.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Asymmetri is an early research company building infrastructure for sim-to-real AI.
                If you are working on real-world autonomous systems and the transfer problem matters
                to you, we should talk.
              </p>
            </div>

            <div className="grid gap-4">
              <a
                href="mailto:info@asymmetri.co"
                className="rounded-[24px] border border-cyan/20 bg-cyan/10 p-5 transition hover:border-cyan/40 hover:bg-cyan/12"
              >
                <div className="label mb-2 text-cyan/80">Email</div>
                <div className="text-lg text-white">info@asymmetri.co</div>
              </a>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="label mb-2">Address</div>
                <div className="text-sm leading-7 text-slate-300">
                  525 W 8th Ave #800
                  <br />
                  Vancouver, BC V5Z 1C6
                  <br />
                  Canada
                </div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="label mb-2">Domain</div>
                <div className="text-sm text-slate-300">asymmetri.co</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
