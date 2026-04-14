export function Footer() {
  return (
    <footer className="pb-10 pt-8">
      <div className="section-shell">
        <div className="flex flex-col gap-6 border-t border-white/10 pt-8 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="font-medium tracking-[0.28em] text-white">ASYMMETRI</div>
            <div className="mt-2">Built for the next generation of Physical AI</div>
          </div>
          <div className="flex flex-col gap-2 text-sm lg:items-end">
            <div>asymmetri.co</div>
            <div>info@asymmetri.co</div>
            <div>525 W 8th Ave #800, Vancouver, BC V5Z 1C6, Canada</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
