export function ContactSection() {
  return (
    <section id="contact" className="section-supporting pt-8 sm:pt-10">
      <div className="section-shell">
        <div className="panel overflow-hidden p-5 sm:p-6 lg:p-7">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="eyebrow mb-4">Contact</div>
              <h2 className="max-w-2xl text-[2.7rem] font-semibold leading-[1] tracking-[-0.05em] text-white sm:text-[3.05rem] lg:text-[3.6rem]">
                For early collaborators, research conversations, and deployment partners.
              </h2>
              <div className="mt-5 accent-rule" />
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-[17px]">
                Asymmetri is an early research company building infrastructure for sim-to-real AI.
                If you are working on real-world autonomous systems and the transfer problem matters
                to you, we should talk.
              </p>
            </div>

            <div className="grid gap-3">
              <a
                href="mailto:info@asymmetri.co"
                className="rounded-[18px] border border-white/8 bg-white/[0.02] p-4 transition hover:border-white/12 hover:bg-white/[0.03]"
              >
                <div className="label mb-2 text-white/50">Email</div>
                <div className="text-lg text-white">info@asymmetri.co</div>
              </a>
              <div className="rounded-[18px] border border-white/8 bg-white/[0.02] p-4">
                <div className="label mb-2">Address</div>
                <div className="text-sm leading-7 text-slate-300">
                  525 W 8th Ave #800
                  <br />
                  Vancouver, BC V5Z 1C6
                  <br />
                  Canada
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
