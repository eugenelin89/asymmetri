import Image from "next/image";

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
      <div className="relative h-24 w-40 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        <Image
          src="/logo2.png"
          alt="Asymmetri Labs logo"
          fill
          sizes="160px"
          className="object-contain p-1.5"
          priority
        />
      </div>
      <div>
        <div className="text-sm font-medium tracking-[0.2em] text-white">ASYMMETRI LABS</div>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-ink/75 backdrop-blur-2xl">
      <div className="section-shell flex h-[112px] items-center justify-between gap-6">
        <a href="#home" aria-label="Asymmetri Labs home">
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
