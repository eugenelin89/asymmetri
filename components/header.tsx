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
    <div className="flex items-center gap-2">
      <div className="relative h-8.5 w-8.5 overflow-hidden rounded-xl border border-white/12 bg-white/[0.03]">
        <div className="absolute inset-y-1.5 left-1.5 w-2 rounded-full bg-gradient-to-b from-cyan to-cyan/10" />
        <div className="absolute left-[14px] top-[8px] h-[14px] w-[14px] rotate-45 rounded-[4px] border border-cyan/45 bg-cyan/10" />
        <div className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan" />
      </div>
      <div>
        <div className="text-sm font-medium tracking-[0.28em] text-white">ASYMMETRI</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
          asymmetri.co
        </div>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-ink/75 backdrop-blur-2xl">
      <div className="section-shell flex h-[58px] items-center justify-between gap-6">
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
          className="button-secondary px-3.5 py-2 text-[13px]"
        >
          Get in Touch
        </a>
      </div>
    </header>
  );
}
