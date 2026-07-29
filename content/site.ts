export type SiteImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type Principle = {
  title: string;
  body: string;
};

export const site = {
  company: {
    name: "Asymmetrico",
    productName: "Asymmetrico Platform",
    siteUrl: "https://asymmetri.co",
    contactEmail: "info@asymmetri.co",
  },
  metadata: {
    title: "Asymmetrico | Accessible Sports Technology",
    description:
      "Asymmetrico builds accessible technology that helps athletes, coaches, and sports organizations see development more clearly and compete beyond their resources.",
    socialHeadline: "Talent is everywhere. The tools aren’t.",
    socialSupport: "Accessible sports technology for an uneven playing field.",
  },
  navigation: [
    { label: "Work", href: "/work" },
    { label: "Why Asymmetrico", href: "/why-asymmetrico" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],
  hero: {
    eyebrow: "Accessible sports technology",
    headline: "Talent is everywhere. The tools aren’t.",
    thesis:
      "Asymmetrico builds practical technology that helps athletes, coaches, and sports organizations see development more clearly, uncover potential, and do more with the resources they have.",
  },
  nameStory: {
    headline: "Asymmetry is usually described as a disadvantage. We see leverage.",
    paragraphs: [
      "When resources are unequal, copying the largest organization is rarely the answer. Smaller programs need technology that is more accessible, information that is more useful, and systems shaped around the decisions they actually make.",
      "In sport, that means preserving what coaches see, combining multiple perspectives, and making development visible over time.",
      "Asymmetrico builds for the side of the playing field that has more potential than resources.",
    ],
  },
  principles: [
    {
      title: "Accessible by design",
      body: "Advanced means attainable, understandable, maintainable, and useful outside a laboratory.",
    },
    {
      title: "Human judgment remains central",
      body: "Technology should preserve and strengthen coaching insight, not pretend to replace it.",
    },
    {
      title: "Development over snapshots",
      body: "No athlete should be defined by one tryout, one score, or one first impression.",
    },
    {
      title: "Multiple perspectives",
      body: "Self, peer, coach, video, and measurement each reveal something different—not a complete truth.",
    },
    {
      title: "Evidence before claims",
      body: "Observation, measurement, interpretation, and future possibility should remain distinct.",
    },
    {
      title: "Technology that earns its complexity",
      body: "Every layer must make a real sports workflow clearer, lighter, or more durable.",
    },
  ] satisfies Principle[],
  perspectives: [
    {
      key: "self",
      number: "01",
      title: "Self",
      body: "The athlete reflects on strengths, habits, confidence, decisions, and what improvement should look like.",
      accent: "clay",
    },
    {
      key: "peer",
      number: "02",
      title: "Peer",
      body: "Teammates can reveal leadership, reliability, communication, and competitive habits that statistics miss.",
      accent: "blue",
    },
    {
      key: "coach",
      number: "03",
      title: "Coach",
      body: "Coaches add technical judgment, context, priorities, observed change, and development recommendations.",
      accent: "green",
    },
  ],
  platform: {
    status: "Deployed work",
    name: "Asymmetrico Platform",
    descriptor:
      "Athlete-development infrastructure for organizations that need to do more with the resources they have.",
    summary:
      "Built from real community-baseball constraints, the platform brings structured observations, evaluation cycles, athlete histories, review workflows, and planning context into one permission-controlled system.",
    verifiedCapabilities: [
      "Self, peer, coach, staff, and guest evaluation perspectives",
      "Configurable question sets and multiple response types",
      "Athlete search, profiles, comparison, and longitudinal timelines",
      "Draft and evaluation context preserved across seasons",
      "Review workflows, completion metrics, and reporting surfaces",
      "Role-aware accounts and permission-controlled views",
    ],
  },
  research: [
    {
      status: "Emerging work",
      title: "Accessible movement sensing",
      body: "Related research explores whether affordable inertial sensors can make useful pitching-motion signals practical outside a laboratory.",
      image: {
        src: "/images/research/wearable-sensor-prototype.webp",
        alt: "A baseball player testing wired motion sensors on the arm and waist during an early prototype session.",
        width: 946,
        height: 1842,
        caption: "Early sensor-data collection. Research foundation, not a commercial product.",
      } satisfies SiteImage,
    },
    {
      status: "Research artifact",
      title: "Movement becomes signal",
      body: "Acceleration and angular-velocity traces create another perspective on a pitch. The challenge is turning noisy measurements into information a coach or athlete can understand.",
      image: {
        src: "/images/research/motion-signal-plot.webp",
        alt: "Two line plots showing hip acceleration and angular velocity across a recorded pitching motion.",
        width: 1486,
        height: 734,
        caption: "A recorded movement signal from related pitching-biomechanics research.",
      } satisfies SiteImage,
    },
  ],
  closing: {
    headline: "The playing field may never be equal. The opportunity to improve should be.",
    body: "We’re interested in sports organizations, coaches, researchers, and technical collaborators working on the same problem.",
  },
} as const;

export const pageMetadata = {
  work: {
    title: "Work | Asymmetrico",
    description:
      "Explore the deployed Asymmetrico Platform and emerging work in accessible sports technology.",
  },
  platform: {
    title: "Asymmetrico Platform | Athlete-Development Infrastructure",
    description:
      "A privacy-conscious system for structured evaluations, athlete histories, multiple perspectives, and organizational continuity.",
  },
  why: {
    title: "Why Asymmetrico | Leverage Over Scale",
    description:
      "Why unequal resources call for more accessible technology, clearer information, and better-designed sports-development systems.",
  },
  about: {
    title: "About | Asymmetrico",
    description:
      "Asymmetrico builds sports technology for imperfect information, real constraints, and the people doing the work.",
  },
  contact: {
    title: "Contact | Asymmetrico",
    description:
      "Start a conversation with Asymmetrico about athlete development, accessible sports technology, or research collaboration.",
  },
} as const;
