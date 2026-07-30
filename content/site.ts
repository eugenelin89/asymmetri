export type SiteImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type NavItem = { label: string; href: string };

export const site = {
  company: {
    name: "Asymmetri Labs",
    siteUrl: "https://asymmetri.co",
    contactEmail: "info@asymmetri.co",
    descriptor: "Baseball technology for clearer pitching development",
  },
  metadata: {
    title: "Asymmetri Labs | Baseball Technology",
    description:
      "Asymmetri Labs is exploring how smartphone video, affordable sensors, and AI can help pitchers, coaches, and parents understand mechanics and development more clearly.",
    socialHeadline: "Better evidence for better pitching.",
    socialSupport: "Smartphone video, sensors, and AI—built to support coaches.",
  },
  navigation: [
    { label: "Story", href: "#story" },
    { label: "Approach", href: "#approach" },
    { label: "Get in touch", href: "#contact" },
  ] satisfies NavItem[],
  hero: {
    eyebrow: "Baseball technology",
    headline: "Better evidence for better pitching.",
    support:
      "Asymmetri Labs is exploring how smartphone video, affordable sensors, and AI can help pitchers, coaches, and parents understand mechanics, track progress, and make better-informed development decisions.",
  },
  story: {
    eyebrow: "Where it began",
    headline: "It started with a phone camera.",
    paragraphs: [
      "As a baseball coach, division coordinator, and parent, I began looking more closely at my son’s pitching mechanics after he experienced a pitching injury. The first experiment was simple: record his delivery in slow motion on a smartphone, compare each pitch frame by frame, and study differences in movement and timing.",
      "We identified possible areas for improvement, made a small adjustment, recorded another set of pitches, and compared the new deliveries with earlier ones. Later, we experimented with affordable wearable sensors to capture evidence that video alone could not show as clearly.",
      "Combined with coaching, training, repetition, and measurement, that evidence helped guide changes, improve his mechanics, and determine whether the changes appeared to be working. Over time, he repeatedly reached new personal bests in pitching velocity. No single tool caused those gains.",
      "The evidence was valuable. Extracting it was slow, manual, technically demanding, and dependent on knowing what to look for. Asymmetri Labs grew from a question: could smartphones, affordable sensors, and AI make this kind of pitching analysis clearer, faster, and accessible to more pitchers—while keeping coaches at the centre of development?",
    ],
  },
  approach: {
    eyebrow: "How the idea works",
    headline: "Capture. Understand. Improve.",
    introduction:
      "We are building and testing a simpler way to turn everyday devices into useful pitching evidence. This is a direction we are exploring, not a finished commercial platform.",
    steps: [
      {
        title: "Capture",
        body: "Smartphone slow-motion video and affordable sensors collect evidence about a pitching delivery.",
      },
      {
        title: "Understand",
        body: "Software and AI help compare pitches, identify patterns, and surface changes that deserve attention.",
      },
      {
        title: "Improve",
        body: "Coaches interpret the evidence, pitchers train with greater purpose, and parents gain clearer context so they can support development without replacing a coach.",
      },
    ],
    principle:
      "AI can help identify patterns. Coaches provide the judgment that turns evidence into progress.",
  },
  closing: {
    eyebrow: "Building in the open",
    headline: "Great coaching stays human. Better evidence makes it stronger.",
    body: "Asymmetri Labs is still building, testing, and learning. The mission is to make useful pitching evidence easier for players, coaches, and parents to understand.",
  },
  images: {
    pitchingDelivery: {
      src: "/images/baseball/pitching-delivery.webp",
      alt: "A pitcher follows through on the mound as the baseball travels toward the plate.",
      width: 2400,
      height: 1600,
    } satisfies SiteImage,
  },
} as const;
