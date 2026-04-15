import Image from "next/image";

export function Footer() {
  return (
    <footer className="pb-10 pt-8">
      <div className="section-shell">
        <div className="flex flex-col gap-8 border-t border-white/10 pt-8 text-sm text-slate-400 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
                <Image
                  src="/logo.png"
                  alt="Asymmetri Labs logo"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div className="font-medium tracking-[0.2em] text-white">ASYMMETRI LABS</div>
            </div>
            <div className="mt-2 text-slate-400">Built for the next generation of Physical AI</div>
          </div>
          <div className="grid gap-2 text-sm lg:text-right">
            <div className="text-white">asymmetri.co</div>
            <div>info@asymmetri.co</div>
            <div>525 W 8th Ave #800, Vancouver, BC V5Z 1C6, Canada</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
