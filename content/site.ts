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
  },
  metadata: {
    title: "Asymmetri Labs | Sports Technology",
    description:
      "Asymmetri Labs explores how everyday cameras, sensors, and AI can provide clearer evidence for athlete development while keeping coaches at the centre.",
    socialHeadline: "Talent is everywhere. The tools aren’t.",
    socialSupport: "Accessible sports technology. Starting with baseball.",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Story", href: "/story" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],
  hero: {
    eyebrow: "Sports technology · Starting with baseball",
    headline: "Talent is everywhere. The tools aren’t.",
    support:
      "Asymmetri Labs explores how everyday cameras and sensors can give athletes, coaches, and parents clearer evidence for better development—starting with baseball.",
  },
  origin: {
    eyebrow: "Where it began",
    headline: "From slow-motion video to measurable progress.",
    paragraphs: [
      "As a coach, division coordinator, and parent, I began comparing slow-motion smartphone videos frame by frame to better understand my son’s pitching mechanics after an injury. We made small adjustments, recorded again, and compared the results. Later, we added affordable sensors to capture evidence that video alone could not show as clearly.",
      "Together with coaching, training, and repeated experimentation, that evidence helped guide changes, improve his mechanics, and measure progress as he repeatedly reached new personal bests in pitching velocity. The process showed me both the value of objective evidence and how manual, time-consuming, and technically difficult it can be to use well.",
      "Asymmetri Labs grew from a question: could AI use cameras and sensors already available in everyday devices to make this kind of analysis faster, clearer, and more accessible—while keeping coaches at the centre of development?",
    ],
  },
  coaching: {
    headline: "Capture evidence. Find patterns. Keep coaching human.",
    paragraphs: [
      "Cameras and sensors capture evidence. AI can help identify movement patterns, recognize strengths, compare performance over time, and surface areas that deserve attention.",
      "AI should not replace good coaching. Coaches provide the judgment, context, experience, and human understanding that turn evidence into progress. Athletes gain clearer insight into what they are working on and why. Parents gain objective context about progress and priorities so they can support development appropriately.",
    ],
  },
  story: {
    introTitle: "Evidence made the problem—and the possibility—personal.",
    introSummary:
      "Asymmetri Labs began with my experience as a baseball coach, division coordinator, and parent helping my son develop as a pitcher.",
    lessons: [
      "Development information becomes more useful when it remains connected across training sessions and seasons.",
      "Everyday video and sensors can capture meaningful evidence about movement.",
      "Evidence works best when coaches interpret it, athletes understand it, and parents receive appropriate context.",
      "Measurement matters because it helps show whether a change is actually working.",
    ],
  },
  mission: {
    headline: "Make better development decisions possible for more people.",
    body: "Our mission is to help athletes and the people around them make better development decisions through clearer evidence and more accessible technology. Sophisticated tools should not be limited to those with elite resources—and good coaching should remain at the centre of progress.",
  },
  closing: {
    headline:
      "The playing field may be uneven. The opportunity to improve should not be.",
    body: "We are building, testing, and learning. If this mission matters to you, we would like to hear from you.",
  },
  images: {
    running: {
      src: "/images/sports/baseball-running-action.webp",
      alt: "A baseball player accelerating out of the batter’s box as clay lifts from the ground.",
      width: 1400,
      height: 933,
    } satisfies SiteImage,
    sensor: {
      src: "/images/research/wearable-sensor-prototype.webp",
      alt: "A baseball player testing motion sensors during an early prototype session.",
      width: 946,
      height: 1842,
    } satisfies SiteImage,
    workbench: {
      src: "/images/research/systems-workbench.webp",
      alt: "A workbench with small tracked robots, electronics, and prototyping tools.",
      width: 1080,
      height: 1440,
    } satisfies SiteImage,
  },
} as const;

export const pageMetadata = {
  story: {
    title: "Our Story | Asymmetri Labs",
    description:
      "How a coach, division coordinator, and parent turned slow-motion pitching video and sensor experiments into the question behind Asymmetri Labs.",
  },
  contact: {
    title: "Contact | Asymmetri Labs",
    description:
      "Talk with Asymmetri Labs about accessible sports technology, athlete development, or research collaboration.",
  },
} as const;
