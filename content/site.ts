export type SiteImage = { src: string; alt: string; width: number; height: number };
export type NavItem = { label: string; href: string };

export const site = {
  company: { name: "Asymmetri Labs", siteUrl: "https://asymmetri.co", contactEmail: "info@asymmetri.co" },
  metadata: {
    title: "Asymmetri Labs | Sports Technology",
    description: "Asymmetri Labs is a sports technology startup exploring how cameras, sensors, software, and AI can help athletes, coaches, and parents understand development more clearly. Starting with baseball.",
    socialHeadline: "Talent is everywhere. The tools aren’t.",
    socialSupport: "Accessible sports technology. Starting with baseball.",
  },
  navigation: [{ label: "Home", href: "/" }, { label: "Story", href: "/story" }, { label: "Contact", href: "/contact" }] satisfies NavItem[],
  hero: {
    eyebrow: "Sports technology · Starting with baseball",
    headline: "Talent is everywhere. The tools aren’t.",
    support: "Asymmetri Labs is a sports technology startup exploring how accessible cameras, sensors, software, data, and AI can help athletes, coaches, and parents understand development more clearly.",
  },
  mission: {
    headline: "Make better development decisions possible for more people.",
    body: "Our mission is to help athletes and the people around them make better development decisions through clearer evidence and more accessible technology. Sophisticated tools should not be limited to those with elite resources—and good coaching should remain at the centre of progress.",
  },
  closing: {
    headline: "The playing field may be uneven. The opportunity to improve should not be.",
    body: "We are building, testing, and learning. If this mission matters to you, we would like to hear from you.",
  },
  images: {
    running: { src: "/images/sports/baseball-running-action.webp", alt: "A baseball player accelerating out of the batter’s box as clay lifts from the ground.", width: 1400, height: 933 } satisfies SiteImage,
    sensor: { src: "/images/research/wearable-sensor-prototype.webp", alt: "A baseball player testing motion sensors during an early prototype session.", width: 946, height: 1842 } satisfies SiteImage,
    workbench: { src: "/images/research/systems-workbench.webp", alt: "A workbench with small tracked robots, electronics, and prototyping tools.", width: 1080, height: 1440 } satisfies SiteImage,
  },
} as const;

export const pageMetadata = {
  story: { title: "Our Story | Asymmetri Labs", description: "Why Asymmetri Labs starts with baseball and explores accessible technology for clearer athlete development." },
  contact: { title: "Contact | Asymmetri Labs", description: "Talk with Asymmetri Labs about accessible sports technology, athlete development, or research collaboration." },
} as const;
