export type SiteImage = { src: string; alt: string; width: number; height: number; caption?: string };
export type NavItem = { label: string; href: string };

export const site = {
  company: { name: "Asymmetrico", siteUrl: "https://asymmetri.co", contactEmail: "info@asymmetri.co" },
  metadata: {
    title: "Asymmetrico | Sports Technology",
    description: "Asymmetrico builds accessible sports technology for athletes and coaches who want to compete beyond their resources. Starting with baseball.",
    socialHeadline: "Better tools for an uneven playing field.",
    socialSupport: "Accessible sports technology. Starting with baseball.",
  },
  navigation: [
    { label: "Home", href: "/" }, { label: "Work", href: "/work" },
    { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],
  hero: {
    eyebrow: "Sports technology",
    headline: "Better tools for an uneven playing field.",
    support: "Asymmetrico builds accessible technology for athletes and coaches who want to compete beyond the limits of their resources. Starting with baseball.",
  },
  mission: {
    headline: "Make sophisticated development tools accessible.",
    body: "We build practical technology that gives athletes and coaches better feedback, clearer development history, and more useful information—without requiring an elite budget. Our aim is to help people with limited resources learn faster, train with greater purpose, and compete beyond what their circumstances might suggest.",
  },
  work: [
    { status: "Built", title: "Development in context", body: "Tools that bring athlete feedback, development history, and coaching perspectives into one place—so insight can carry across conversations and seasons." },
    { status: "Research", title: "Practical measurement", body: "Exploring affordable sensors, movement data, video, and machine learning as useful inputs for athletes and coaches—not substitutes for human judgment." },
    { status: "Direction", title: "Better training conversations", body: "Connecting observations and measurements in ways that can make priorities clearer and help athletes take greater ownership of development." },
  ],
  nameStory: {
    headline: "Leverage over scale.",
    body: "When resources are unequal, copying the largest competitor is rarely the answer. The smaller side needs leverage: better information, sharper focus, and tools designed to do more with less. That is the idea behind Asymmetrico.",
  },
  closing: {
    headline: "The playing field may be uneven. The opportunity to improve should not be.",
    body: "We want to hear from coaches, athletes, sports organizations, researchers, and technical collaborators who believe better development tools should be within reach.",
  },
  images: {
    running: { src: "/images/sports/baseball-running-action.webp", alt: "A baseball player accelerating out of the batter’s box as clay lifts from the ground.", width: 1400, height: 933 } satisfies SiteImage,
    pitcher: { src: "/images/sports/baseball-pitching-mound.webp", alt: "A pitcher pauses on the mound and looks toward home plate before the next delivery.", width: 1400, height: 933 } satisfies SiteImage,
    sensor: { src: "/images/research/wearable-sensor-prototype.webp", alt: "A baseball player testing wired motion sensors during an early prototype session.", width: 946, height: 1842 } satisfies SiteImage,
    signal: { src: "/images/research/motion-signal-plot.webp", alt: "Line plots showing acceleration and angular velocity across a recorded pitching motion.", width: 1486, height: 734 } satisfies SiteImage,
    workbench: { src: "/images/research/systems-workbench.webp", alt: "A workbench with small tracked robots, electronics, and prototyping tools.", width: 1080, height: 1440 } satisfies SiteImage,
  },
} as const;

export const pageMetadata = {
  work: { title: "Work | Asymmetrico", description: "See how Asymmetrico is building athlete-development and coaching technology, beginning with baseball." },
  about: { title: "About | Asymmetrico", description: "Why Asymmetrico builds accessible sports technology and why baseball is the first proving ground." },
  contact: { title: "Contact | Asymmetrico", description: "Talk with Asymmetrico about accessible sports technology, athlete development, or research collaboration." },
} as const;
