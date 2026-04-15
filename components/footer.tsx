import Image from "next/image";

export function Footer() {
  return (
    <footer className="pb-10 pt-8">
      <div className="section-shell">
        <div className="flex flex-col gap-8 border-t border-white/10 pt-8 text-sm text-slate-400 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center">
              <div className="relative h-20 w-[16.5rem] overflow-hidden rounded-xl bg-white/[0.02]">
                <Image
                  src="/logo_w6.png"
                  alt="Asymmetri Labs logo"
                  fill
                  sizes="264px"
                  className="object-contain p-1.5"
                />
              </div>
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
