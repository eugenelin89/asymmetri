const navItems = [
  { label: "Home", href: "#home" },
  { label: "Problem", href: "#problem" },
  { label: "Infrastructure", href: "#infrastructure" },
  { label: "Proof", href: "#proof" },
  { label: "Vision", href: "#vision" },
  { label: "Contact", href: "#contact" },
];

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-cyan/30 bg-white/[0.04] shadow-glow">
        <div className="absolute inset-y-1 left-1 w-2 rounded-full bg-gradient-to-b from-cyan to-cyan/10" />
        <div className="absolute left-[14px] top-[8px] h-[18px] w-[18px] rotate-45 rounded-sm border border-cyan/50 bg-cyan/10" />
        <div className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-cyan" />
      </div>
      <div>
        <div className="text-sm font-medium tracking-[0.38em] text-white">ASYMMETRI</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
          asymmetri.co
        </div>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-ink/70 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-8">
        <a href="#home" aria-label="Asymmetri home">
          <BrandMark />
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="mailto:info@asymmetri.co"
          className="rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-sm text-cyan transition hover:border-cyan/60 hover:bg-cyan/14 hover:text-white"
        >
          Get in Touch
        </a>
      </div>
    </header>
  );
}
