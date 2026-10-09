export type SiteImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type NavItem = { label: string; href: string };
export type PrimaryNavItem = NavItem & { children?: readonly NavItem[] };
export type LabsProject = {
  name: string;
  description: string;
  status: string;
  detail?: NavItem;
  source: NavItem;
  license?: NavItem;
};

export const divisions = {
  sports: {
    label: "Sports",
    name: "Asymmetri Sports",
    path: "/sports",
    description: "Technology for athletes, coaches and teams.",
    product: { name: "Asymmetri Motion", path: "/motion" },
  },
  labs: {
    label: "Labs",
    name: "Asymmetri Labs",
    path: "/labs",
    description: "A playground for open-source experiments.",
    product: { name: "BotSquad", path: "/botsquad" },
  },
} as const;

const contactEmail = "info@asymmetri.co";

export const site = {
  company: {
    name: "Asymmetri",
    siteUrl: "https://asymmetri.co",
    contactEmail,
    descriptor: "Technology for individuals and small teams",
  },
  metadata: {
    themeColor: "#0C1111",
    title: "Asymmetri | Build an Asymmetric Advantage",
    description:
      "Technology that gives people and small teams more capability. Asymmetri Sports builds sports technology; Asymmetri Labs explores experimental, open-source work.",
    socialHeadline: "Build an asymmetric advantage.",
    socialSupport:
      "Technology for individuals and small teams.",
  },
  navigation: [
    {
      label: "Sports", href: divisions.sports.path,
      children: [
        { label: divisions.sports.name, href: divisions.sports.path },
        { label: divisions.sports.product.name, href: divisions.sports.product.path },
        { label: "Motion product family", href: "/sports#motion-family" },
      ],
    },
    {
      label: "Labs", href: divisions.labs.path,
      children: [
        { label: divisions.labs.name, href: divisions.labs.path },
        { label: divisions.labs.product.name, href: divisions.labs.product.path },
      ],
    },
    { label: "About", href: "/about" },
    { label: "Contact", href: `mailto:${contactEmail}` },
  ] satisfies PrimaryNavItem[],
  companyNavigation: [
    { label: "About Asymmetri", href: "/about" },
    { label: divisions.sports.name, href: divisions.sports.path },
    { label: divisions.labs.name, href: divisions.labs.path },
    { label: divisions.sports.product.name, href: divisions.sports.product.path },
    { label: divisions.labs.product.name, href: divisions.labs.product.path },
  ] satisfies NavItem[],
  footerNavigation: [
    { label: "Motion tutorial", href: "/tutorial" },
    { label: "Motion privacy", href: "/privacy" },
    { label: "Motion support", href: "/support" },
  ] satisfies NavItem[],
} as const;

export const sports = {
  ...divisions.sports,
  metadata: {
    title: "Asymmetri Sports | Technology for Athletes, Coaches and Teams",
    description: "Sports technology grounded in coaching. Discover Asymmetri Motion, its pitching roots and the planned individual and professional baseball product family.",
  },
  hero: {
    eyebrow: divisions.sports.name,
    headline: "A closer look at the game.",
    support:
      "Technology for athletes, coaches and teams. Our work began with a phone camera and a pitch to review. Asymmetri Motion carries that approach into a growing family of baseball tools.",
  },
  story: {
    eyebrow: "Where it began",
    headline: "It started with a phone camera.",
    paragraphs: [
      "I was coaching baseball and coordinating a division when I started recording pitchers in slow motion on my phone. I would go through deliveries frame by frame, looking at movement and timing.",
      "We would try a small adjustment, record another pitch and compare it with the earlier one. Later, I tried affordable wearable sensors to look at things the video couldn’t show as clearly.",
      "Having something we could look at together helped the conversation. A player could see the moment we were discussing. As a coach, I still had to decide what it meant and what to work on next.",
      "The review took a lot of time, and finding useful evidence depended on knowing where to look. I wanted to make that part easier with the phone we already had. That’s where Asymmetri Motion began. The sensor experiments remain part of the research; Motion V1 works with iPhone video.",
    ],
  },
  approach: {
    eyebrow: "Working with a coach",
    headline: "From recording to review.",
    introduction:
      "Motion brings this approach into one iPhone workflow, from recording a pitch to revisiting the evidence with a coach.",
    steps: [
      {
        title: "Capture",
        body: "Record high-frame-rate video on a supported iPhone or import from Photos. Back and Side framing guides and optional Recording Setups help prepare the next recording.",
      },
      {
        title: "Look closely",
        body: "Confirm the exact pitching moments. On-device pose analysis connects available projected 2D measurements to annotated evidence, with camera view and throwing arm kept in context.",
      },
      {
        title: "Review together",
        body: "Revisit pitches, compare observations and notice patterns worth discussing. Coaches interpret the evidence and guide training; parents gain context to support the process.",
      },
    ],
    principle:
      "A recorded difference starts a conversation. Coaches bring the judgment and context.",
  },
  closing: {
    eyebrow: "Talk to us",
    headline: "There’s more to a pitch than a measurement.",
    body: "How do you review movement with your athletes? We’d like to hear what helps, what takes too long and what you wish you could see.",
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

export type ProductStep = { title: string; body: string; note?: string };

export const productStatusLabels = {
  current: "Available now",
  preparing: "Preparing for release",
  development: "In development",
  planned: "Planned",
} as const;
export type ProductStatus = keyof typeof productStatusLabels;
export type MotionFamilyProduct = {
  id: string;
  name: string;
  status: ProductStatus;
  description: string;
  detail: string;
  link?: NavItem;
};

// Display names and release states live here; these are not final Store names.
export const motionFamily = {
  name: divisions.sports.product.name,
  headline: "One Motion family. Individual and team perspectives.",
  introduction: "The current pitching app is the starting point. Separate individual apps and one professional Team app are the next direction for Motion, sharing review technology while keeping pitching and hitting distinct.",
  individual: {
    label: "Individual",
    description: "Separate, focused apps for one athlete.",
    products: [
      {
        id: "pitching", name: "Pitching", status: "preparing",
        description: "The current Motion experience for iPhone: capture, exact-frame review, projected 2D evidence and pitching history.",
        detail: "The V1.2 candidate is complete. App Store distribution is still being prepared; public availability is not yet announced.",
        link: { label: "Explore the pitching experience", href: "/motion#how-it-works" },
      },
      {
        id: "hitting", name: "Hitting", status: "planned",
        description: "A planned individual app for measuring, tracking and comparing hitting over time, reviewing evidence alongside recorded context, and learning with a coach.",
        detail: "Approved roadmap work. Hitting-specific definitions and evidence come before analysis claims; development has not yet begun.",
      },
    ] satisfies MotionFamilyProduct[],
  },
  professional: {
    label: "Professional",
    description: "One app for coaches working with multiple athletes.",
    product: {
      id: "team", name: "Team", status: "planned",
      description: "A professional Motion app built around one account, organization, roster and Athlete identity system, with required Team Cloud for shared records and cross-device work.",
      detail: "Planned after Hitting. Team Pitching, Team Hitting and Team Baseball are entitlement configurations inside this one app.",
    } satisfies MotionFamilyProduct,
    entitlements: [
      { name: "Team Pitching", description: "Pitching module" },
      { name: "Team Hitting", description: "Hitting module" },
      { name: "Team Baseball", description: "Both modules" },
    ],
    continuity: "Adding the second module keeps the same account, organization, roster, Athlete identities and Cloud data.",
    cloud: "Team Cloud will use finite, quota-aware storage. Exact plans and storage allowances are still to be decided.",
  },
  future: {
    title: "Further ahead",
    body: "Team productionization and Enterprise expansion follow the first Team product. Deeper Mechanics Lab work, exploring movement through a delivery or swing, comes later. These are future directions, not released capabilities.",
  },
  note: "Pitching, Hitting and Team describe the product direction. Final names may change. No launch dates are announced.",
} as const;

// Current normal-user vocabulary: Motion 1.2 (2), Decisions 50/77.
// Baseball-first renaming and Side trunk promotion remain gated; see MOTION_PRODUCT_REVIEW.md.
export const motionMeasurements = {
  eyebrow: "By view and event",
  headline: "What Motion tracks",
  support: "Repeat the same measurement at the same pitching event. The current app offers these projected 2D observations for your history.",
  groups: [
    { view: "Side View", event: "Front Foot Contact", items: [
      { title: "2D FFC Ankle-Span Ratio", body: "Compare projected ankle separation at Front Foot Contact with the nose-to-ankle-midpoint span in the earlier Setup image. A stride-related video estimate, not physical stride distance or a percentage of body height." },
      { title: "2D Lead-Knee Bend Angle", body: "Track the projected bend of the lead leg at Front Foot Contact, using the estimated hip, knee and ankle." },
    ] },
    { view: "Side View", event: "Ball Release", items: [
      { title: "2D Lead-Knee Bend Angle", body: "Track projected lead-leg bend at release. This is a separate observation from Front Foot Contact, not a measure of blocking force or continuous leg movement." },
    ] },
    { view: "Back View", event: "Front Foot Contact", items: [
      { title: "2D Trunk-Segment Orientation", body: "Track projected trunk position relative to image vertical at Front Foot Contact. Image vertical is not a calibrated gravity reference." },
    ] },
    { view: "Back View", event: "Ball Release", items: [
      { title: "2D Shoulder-Upper Arm Angle", body: "Compare the projected angle between the shoulder line and throwing upper arm at release." },
      { title: "2D Throwing-Side Shoulder-Wrist Orientation", body: "Compare the shoulder-to-wrist direction with image vertical at release. This is not a direct Arm Slot measurement." },
    ] },
  ],
  note: "For exact definitions, open Settings → About → Measurements in the app. Camera position, event marking and pose estimates affect every comparison; higher or lower is not a score.",
} as const;

export const motion = {
  name: divisions.sports.product.name,
  path: divisions.sports.product.path,
  headline: "Measure. Track. Compare. Learn.",
  descriptor: "Pitching mechanics, tracked over time. For iPhone.",
  platform: "iPhone · iOS 17 or later",
  device: "iPhone",
  operatingSystem: "iOS 17 or later",
  releaseStatus: productStatusLabels[motionFamily.individual.products[0].status],
  releaseStatement: "Motion’s current pitching app for iPhone is preparing for release.",
  metadata: {
    title: "Asymmetri Motion | Track Pitching Mechanics Over Time",
    description:
      "Track pitching-mechanics measurements over time, compare changes alongside recorded performance context, and return to the video and evidence. For iPhone.",
  },
  icon: {
    src: "/brand/motion-pitcher.png",
    alt: "Asymmetri Motion icon: an illustrated pitcher in a high-knee windup, framed by a teal motion arc.",
    width: 1024,
    height: 1024,
  } satisfies SiteImage,
  socialImage: "/brand/motion-pitcher.png",
  introduction: {
    eyebrow: "Product",
    paragraphs: [
      "Record a pitch or import video from Photos. Choose the camera view and throwing arm, mark the important moments, and inspect the available projected 2D measurements.",
      "Open annotated evidence to see what contributed to a result. Save pitches, revisit your history and compare supported observations over time. The goal is evidence you can trace back to the pitch.",
    ],
    link: { label: "Explore Asymmetri Motion", href: "/motion" },
  },
  hero: {
    eyebrow: "An Asymmetri Sports product · Current pitching experience",
    support:
      "Track pitching-mechanics measurements over time. See what changed, explore it alongside recorded performance context, and return to the video and evidence behind each result.",
    philosophy: "Motion gives you measurements and evidence. You and your coach decide what they mean.",
    link: { label: "How Motion works", href: "#how-it-works" },
  },
  gap: {
    eyebrow: "Why repeat the measurement?",
    headline: "Track what changes",
    items: [
      { title: "One pitch", body: "A measurement describes one observation: one pitch, a particular event, and the image you recorded." },
      { title: "Repeated pitches", body: "Repeating the same measurement makes differences visible. Keep the camera view and event selection as consistent as you can." },
      { title: "A history", body: "Investigate whether a difference persists, whether one pitch was an outlier, and what else changed during the same period." },
    ] satisfies ProductStep[],
    questions: "Has my stride-related measurement changed? Is my lead-leg position different? Does my trunk position look consistent across several sessions? Start with a question, then inspect the pitches behind it.",
  },
  measurements: motionMeasurements,
  workflow: {
    eyebrow: "How it works",
    headline: "A loop you can return to.",
    steps: [
      {
        title: "Record or import",
        body: "Choose Record Pitch or Import Video from Photos. Back and Side View framing guides help you keep the pitcher in view. Optional Recording Setups reuse your view and guide choices.",
        note: "Direct recording uses supported 240 or 120 fps camera modes. Availability depends on the iPhone. A Recording Setup is guidance, not camera calibration.",
      },
      {
        title: "Mark the same meaningful events",
        body: "Confirm Camera View and Throwing Arm. Scrub and fine-adjust to Front Foot Contact and Ball Release; Side View also uses a Setup Reference. Choose and confirm each exact frame so you can revisit the same event across pitches.",
      },
      {
        title: "Measure",
        body: "Choose Analyze Pitch for the available on-device, projected 2D measurements. Results depend on the view, your inputs and visible landmarks. If several people appear, Pitcher Selection lets you identify the pitcher to analyze.",
      },
      {
        title: "Build history",
        body: "Repeat the workflow across comparable recordings. My Pitches keeps each observation with its video, marks, results and evidence.",
      },
      {
        title: "Compare",
        body: "Use Explore to inspect two pitches, follow a measurement over time or compare two periods. Save a question as a Saved View to return to it.",
      },
      {
        title: "Look at performance and context",
        body: "Examine measurements alongside the velocity, pitch type, location and result you recorded. Ask what changed during the same period.",
      },
      {
        title: "Return to the evidence",
        body: "Open the contributing pitch, exact event frame and saved annotated image. Check the landmarks and reference lines behind a difference. Save evidence to Photos or share it deliberately.",
      },
      {
        title: "Learn with your coach",
        body: "Bring the observations to a conversation. You and your coach decide what they mean, what to investigate next and what to keep tracking.",
      },
    ] satisfies ProductStep[],
  },
  evidence: {
    eyebrow: "Behind a measurement",
    headline: "See where the number came from.",
    support:
      "A change in history is worth looking at closely. Follow a measurement back to its pitch, exact event frame, and the landmarks and reference lines used to calculate it.",
    chain: [
      { title: "Source video", body: "The pitch you recorded or imported." },
      { title: "Exact selected frame", body: "A specific image you can return to." },
      { title: "Human-confirmed moment", body: "The pitching moment you marked." },
      { title: "Projected 2D measurement", body: "Geometry from the video image." },
      { title: "Annotated evidence", body: "The landmarks and lines behind the result." },
      { title: "Pitch history", body: "Saved observations to revisit and compare." },
    ] satisfies ProductStep[],
    closing:
      "History stays connected to individual observations. Review the saved evidence before interpreting a pattern; if a source or evidence is unavailable, Motion shows that state.",
  },
  history: {
    eyebrow: "Your pitching history",
    headline: "From one pitch to a pattern.",
    support: "Explore is central to the work: follow your own measurements over time, then open the observations behind a difference.",
    items: [
      { title: "Compare two pitches", body: "Inspect a difference directly with A/B marked frames or a supported measurement. Open either pitch to review its evidence." },
      { title: "Follow a measurement over time", body: "Use Measurement history to see whether a difference persists or appears in just one pitch. Check the individual contributors behind a chart or summary." },
      { title: "Compare periods", body: "Use Two periods to investigate what changed between earlier and later training dates. Save the question and its settings as a Saved View." },
    ] satisfies ProductStep[],
    note: "Keep the view, framing and event selection comparable. A date is not proof of a session, and a numerical difference alone does not establish improvement.",
  },
  performance: {
    eyebrow: "What changed with it?",
    headline: "Mechanics + performance",
    support: "Mechanics history becomes more useful when you can investigate what else was happening during those pitches.",
    items: [
      { title: "Add the context you know", body: "Record velocity and its source, pitch type, chart-relative pitch location and outcome in Pitch Context. These are manual entries; Motion does not derive ball speed or determine the outcome from video." },
      { title: "Look alongside the measurement", body: "Inspect recorded velocity and location with an exact measurement in Chart, Table or A/B comparison. Use supported context filters to narrow the pitches you are investigating. Leave unknown context unrecorded." },
      { title: "Ask a specific question", body: "Did the stride-related measurement change during a period of increased recorded velocity? Do harder pitches show a different trunk position in Back View? Do pitches with different outcomes share an observable pattern?" },
    ] satisfies ProductStep[],
    note: "A relationship does not prove causation. Motion surfaces evidence for investigation. The athlete and coach decide what it means.",
  },
  study: {
    eyebrow: "Deeper investigation",
    headline: "Keep the conversation with the video.",
    items: [
      { title: "Notes and pitch context", body: "Keep Athlete Notes and Pitch Notes alongside your work. Add pitch type, reported velocity, chart-relative location and result yourself; these are recorded context, not video-derived measurements." },
      { title: "Reference Study", body: "Import authorized footage from Photos or Files into a separate Reference Library. Review a saved interval, add event marks, bookmarks and Reference Notes, and return to the original source." },
      { title: "Compare With My Pitch", body: "Put one personal pitch beside a Reference. Review independently or explicitly align Front Foot Contact or Ball Release. Save the comparison settings without turning the Reference into personal measurement history." },
      { title: "Share a review", body: "Preview a Pitch Review PDF with your selected context, measurements and evidence. Notes, athlete display name and marked frames are included only when selected. Share Original Video is a separate action." },
    ] satisfies ProductStep[],
    note: "These tools are implemented in the V1.2 pitching candidate. They do not measure the Reference subject, identify an ideal delivery or prove that a change improved performance.",
  },
  limits: {
    eyebrow: "Before you interpret a result",
    headline: "Measurements and evidence, not a mechanics grade.",
    items: [
      { title: "Camera position matters", body: "Measurements describe projected 2D geometry in the video image. Camera position and perspective affect what you see. Motion does not produce anatomical 3D biomechanics or laboratory-calibrated measurements." },
      { title: "Landmarks can be missing", body: "Pose landmarks are estimates, and you confirm the pitching moments. Missing landmarks or unresolved ambiguity can leave a measurement unavailable. Motion does not fill the gap with an invented result." },
      { title: "A coach brings the context", body: "You and your coach interpret the evidence. Motion does not label mechanics good or bad, prescribe changes, predict injury or provide medical advice." },
    ] satisfies ProductStep[],
  },
  privacy: {
    eyebrow: "Storage and privacy",
    headline: "Your pitching record, on your iPhone.",
    paragraphs: [
      "No account is required. Pitch videos, optional Athlete Profile details and analysis records are stored locally. Apple Vision performs pose analysis on the device.",
      "There is no app-owned advertising, tracking or analytics SDK, and no Asymmetri-operated upload or cloud-sync system for your local pitch records.",
      "Photos copies, iCloud, device backups and sharing follow the services and settings you use. You choose when to save or share annotated evidence; those separate copies have their own handling.",
    ],
    link: { label: "Read the Privacy Policy", href: "/privacy" },
  },
  coaching: {
    eyebrow: "At the next practice",
    audiences: [
      { title: "Pitchers", body: "See your work more clearly." },
      { title: "Coaches", body: "Inspect the evidence. Bring your judgment." },
      { title: "Parents", body: "Find context to support development alongside a coach." },
    ] satisfies ProductStep[],
  },
} as const;

export type UtilitySection = {
  id: string;
  heading: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
  ordered?: boolean;
  closing?: readonly string[];
  link?: NavItem;
};

export type UtilityPageContent = {
  title: string;
  description: string;
  introduction: readonly string[];
  effectiveDate?: { label: string; value: string };
  contactLabel: string;
  related: NavItem;
  sections: readonly UtilitySection[];
};

export const motionPages = {
  privacy: {
    title: "Asymmetri Motion Privacy Policy",
    description:
      "How Asymmetri Motion handles local pitching videos and analysis, Apple services and sharing, website visits, and support email.",
    effectiveDate: { label: "October 6, 2026", value: "2026-10-06" },
    introduction: [
      "Asymmetri operates Asymmetri Motion, a pitching video and motion-analysis app for iPhone. This policy distinguishes information in the app from website visits, support email, and Apple or other services you choose to use.",
      "Asymmetri does not sell personal information.",
    ],
    contactLabel: "Privacy contact",
    related: { label: "Asymmetri Motion Support", href: "/support" },
    sections: [
      {
        id: "information-in-the-app",
        heading: "Information in the app",
        paragraphs: [
          "The app stores information on your iPhone for pitch review, organization and projected 2D analysis, including:",
        ],
        items: [
          "Videos you record or import and the pitch observations that organize them. Imported originals may contain audio and embedded metadata; the app also retains the selected Photos item's local identifier and date.",
          "Optional Athlete Profile information: name, date of birth, throwing arm, batting side, positions, and dated height and weight entries and corrections.",
          "Camera view, throwing arm, Setup Reference and event marks, pitcher selection, detected pose landmarks and confidence, projected 2D measurements and analysis history.",
          "Rendered, annotated evidence images, recording setups, saved views and preferences.",
          "Optional Athlete Notes and Pitch Notes, and manually entered Pitch Context such as pitch type, reported velocity and its source, chart-relative location and result. Explorer Saved Views retain your chosen review settings.",
          "Authorized footage imported from Photos or Files into a separate Reference Library, with optional user-entered metadata, study intervals, event marks, bookmarks and notes.",
          "Saved Comparisons containing the chosen personal pitch and Reference pair and comparison settings. These configurations do not duplicate videos or create measurement records for the Reference subject.",
        ],
        closing: [
          "Apple Vision processes analysis on your device. No account is required. The app has no Asymmetri-operated server-upload or cloud-sync feature for these records and does not send your videos, Athlete Profile or analysis records to Asymmetri for remote analysis.",
          "The app has no app-owned analytics SDK, advertising or tracking system, or crash-reporting SDK. It does not sell your locally stored app data. Local diagnostic messages may still be produced; Apple may handle system diagnostics under its own services and your settings.",
        ],
      },
      {
        id: "camera-photos-sharing",
        heading: "Camera, Photos, Files and sharing",
        paragraphs: [
          "Camera access enables rear-camera pitching video. Direct recording does not use the microphone; imported originals can contain audio.",
          "Photos access lets the app obtain your selected original video and copy it into app storage. After saving a recording locally, the app attempts to add a separate copy to Photos, subject to permission. You can also save annotated evidence to Photos. A failed Photos copy does not remove a locally saved pitch.",
          "Review Camera and Photos permissions in iOS Settings. Denying access can prevent the corresponding recording, import or Photos-save operation.",
          "Reference import from Files uses the system document picker and makes an app-owned local source copy. The selected file provider or Photos/iCloud may download an original according to that service's settings.",
          "Sharing sends an annotated image and its visible information to the recipient or service you choose through the system share sheet. Check the image before sharing; the recipient or service controls its copy.",
          "Share Analysis can create a temporary Pitch Review PDF from one personal pitch, selected context, current measurements and verified evidence. Individual notes, the athlete display name and marked frames are included only when you select them. Preview the report before sharing. Reference videos and Reference Notes are not included in personal Share Analysis.",
          "Share Original Video is a separate action. Sharing sends only the output you choose through the system share sheet; external services and recipients control their copies.",
        ],
      },
      {
        id: "apple-services-backups",
        heading: "Apple services and device backups",
        paragraphs: [
          "Photos may download selected originals from iCloud, Photos copies may sync through iCloud Photos, and app data may be included in device backups. These behaviors depend on Apple services and your device/account settings. The app does not exclude its data from ordinary device backups.",
          "Apple, backup providers and services you choose for sharing handle their copies under their own privacy practices. Asymmetri Motion does not control those copies or guarantee deletion when you remove something in the app.",
          "We use the analytics, crash and diagnostic information, ratings, reviews and customer feedback Apple makes available to operate, debug and improve Asymmetri Motion. The app includes no app-owned or third-party analytics or crash-reporting SDK. We do not use this information for advertising or profiling, or combine it with personally identifiable athlete information for those purposes. Apple handles information through its own services and privacy practices; some feedback you choose to send may include comments, contact details or screenshots.",
        ],
      },
      {
        id: "retention-deletion",
        heading: "Retention and deletion",
        paragraphs: [
          "App records remain locally until you delete the relevant records or remove the app's local data. Deleting a pitch removes it from My Pitches and deletes its app-owned video, marks, analysis history and annotated evidence. If file cleanup cannot finish, the app explains that files remain and offers Try Cleanup Again.",
          "Deleting a pitch does not delete your separate Athlete Profile or independent Photos, backup or shared copies. Profile corrections can retain earlier entries.",
          "Deleting a Reference removes that Reference and its app-owned source and study information; personal pitches and their scientific history remain separate. Deleting a saved Comparison removes its configuration without deleting either source. A saved Comparison can become unavailable if a source is missing; the app does not silently substitute another video. Notes and context can be edited through their own controls.",
          "Deleting the app and its local data removes records from that installation. Reinstalling alone does not guarantee recovery; restoring a backup may restore earlier data. A Photos video or exported evidence image does not preserve complete analysis history. These operations do not provide a secure-erasure guarantee.",
        ],
      },
      {
        id: "young-athletes",
        heading: "Children and young athletes",
        paragraphs: [
          "Asymmetri Motion is intended for pitchers, coaches and parents, including use involving youth athletes. Videos and profiles may include children or teenagers; the app processes those records locally in the same way as other pitch information.",
          "Parents, guardians and authorized adults should supervise recording and sharing involving minors. Only use footage you have permission to record, import or share. Do not send identifiable footage of a minor to support unless intentionally needed and authorized by the parent or guardian.",
        ],
      },
      {
        id: "website",
        heading: "The asymmetri.co website",
        paragraphs: [
          "The website provides public information and email links. It has no site-owned analytics, advertising, marketing trackers, tracking pixels, or browser storage for tracking or profiling. It has no contact or support form, visitor accounts, or website database. Fonts and images are served locally. YouTube introduction videos connect to a third party only when you choose to load a player or follow an external link, as explained below.",
          "The website is hosted on a DigitalOcean server. Website hosting and server infrastructure may process standard technical request information, such as IP address, browser/request information, requested URLs and request times, as needed to deliver, operate and protect the website. This infrastructure processing is separate from the app's on-device records.",
          "We use website information only to operate and support the informational site, not for advertising, profiling, sale or sharing for unrelated purposes. Our DigitalOcean server has access/error logging and system/service logs. Exact total retention across the host, server and other infrastructure copies is not currently established. We do not promise a fixed deletion period for those logs.",
        ],
      },
      {
        id: "website-media",
        heading: "Optional website videos",
        paragraphs: [
          "The BotSquad and Asymmetri Motion product pages offer YouTube introduction videos. Before you select Load video, the website displays local artwork and does not load the YouTube player, thumbnails, scripts or media. Scrolling and hovering do not activate a video. Your choice is not saved as permission for later visits.",
          "Selecting Load video connects your browser to YouTube using its privacy-enhanced player at youtube-nocookie.com. YouTube and Google may then process information such as your IP address, browser information and interactions, and may use storage or serve advertising under their policies. Privacy-enhanced mode does not mean no data collection or advertising. The player does not autoplay.",
          "Watch on YouTube opens the corresponding video on YouTube, where Google's policies apply. These optional website videos do not change the Motion app's local data handling. This is not a privacy policy for the BotSquad application.",
        ],
        link: { label: "Google privacy policy", href: "https://policies.google.com/privacy" },
      },
      {
        id: "support-email",
        heading: "Support email",
        paragraphs: [
          "Support is provided by email at info@asymmetri.co using Gmail. Asymmetri Motion's owner is the only human operator with access to the support inbox. Email providers process correspondence under their own service terms and privacy practices.",
          "We use your email address, message and chosen attachments only to respond to support requests and debug reported issues. Start with a written description. You may provide redacted screenshots and relevant logs; remove unnecessary personal information. We request athlete video only when needed for the issue and when you are authorized to share it. Obtain parent or guardian authorization for identifiable footage involving a minor. Sending a video is not required to ask for help, and support permission does not authorize public reuse.",
          "Our support policy is to delete attachments within 30 days after the issue is resolved and message threads within 90 days after resolution. Where an attachment cannot be removed separately, we delete the containing message within the shorter period and retain only a necessary text summary for the remainder of the message-retention period. You can request deletion by emailing info@asymmetri.co; we verify that the request comes from the sender before acting. These periods describe our handling of the inbox and retained support copies, not guaranteed erasure from email-provider systems, independent backups or senders' copies.",
        ],
      },
      {
        id: "privacy-questions",
        heading: "Privacy questions and requests",
        paragraphs: [
          "For privacy questions, requests about information sent to us, or concerns about a child's information sent to support, email us with the subject “Asymmetri Motion privacy”. Describe the request without private athlete footage. We cannot remotely access or delete records held only in your app.",
        ],
        link: {
          label: site.company.contactEmail,
          href: `mailto:${site.company.contactEmail}`,
        },
      },
      {
        id: "policy-updates",
        heading: "Policy updates",
        paragraphs: [
          "We may update this policy as the app or our practices change. Updates will appear on this page with a revised effective date.",
          "October 6, 2026: added Motion 1.2 coverage for Notes, Pitch Context, References, Files import, Saved Comparisons and PDF/original-video sharing. Website, Apple-service and support-email handling remains unchanged.",
          "September 28, 2026: updated website coverage for optional, user-activated YouTube introductions and the Asymmetri Labs portfolio. The Motion app, Apple services and support-email handling described in the September 19, 2026 policy are unchanged.",
        ],
      },
    ],
  },
  support: {
    title: "Asymmetri Motion Support",
    description:
      "Help with Asymmetri Motion for iPhone: recording, import, notes, results, Reference Study, comparisons, sharing and local data.",
    introduction: [
      "Asymmetri Motion for iPhone helps you record or import pitching videos, mark key moments, inspect projected 2D measurements and keep notes beside saved evidence. You can also study authorized Reference footage and compare it with your own pitch.",
      "Results describe measurements projected from the video image. They are not anatomical 3D measurements, medical advice, injury diagnosis or automatic coaching.",
      "For help, email us with the details below. Response times may vary.",
    ],
    contactLabel: "Email support",
    related: { label: "Asymmetri Motion Privacy Policy", href: "/privacy" },
    sections: [
      {
        id: "getting-started",
        heading: "Getting started",
        link: { label: "Follow the complete interactive tutorial", href: "/tutorial" },
        ordered: true,
        items: [
          "From My Pitches, choose Record Pitch to record a new video, or Import Video to select one from Photos.",
          "Select Camera View and Throwing Arm. Back View is footage from behind the pitcher; Side View is footage from beside the pitcher.",
          "Follow the review steps to mark Front Foot Contact and Ball Release. Side-view analysis also uses a Setup Reference. Confirm the exact frames.",
          "Select the pitcher if the app asks you to.",
          "Choose Analyze Pitch. Available results depend on the view, inputs and visible landmarks.",
          "Review results and annotated evidence.",
          "Reopen saved pitches from My Pitches, or use Explore your pitches for supported measurement history.",
        ],
      },
      {
        id: "device-recording-requirements",
        heading: "Device and recording requirements",
        paragraphs: [
          "Motion supports iPhone with iOS 17 or later. Direct recording requires a supported rear wide-angle camera mode at 240 or 120 frames per second. The app selects from supported formats; not every iPhone supports every mode. If no suitable mode is available, use Photos import with a compatible video.",
          "Back View recording is recommended in portrait and Side View in landscape. Keep the full pitcher visible. Direct recordings are video-only; imported originals may contain audio.",
        ],
      },
      {
        id: "permissions",
        heading: "Camera and Photos permissions",
        paragraphs: [
          "In iOS Settings, find Asymmetri Motion's permissions, or use Privacy & Security → Camera / Photos. Allow Camera access for recording and Photos access for the selected import. With limited Photos access, include that video in your selection. Saving copies to Photos also requires permission to add items.",
          "Parental controls or device-management restrictions may require help from the person managing the device. Permission problems do not require deleting the app.",
        ],
      },
      {
        id: "import-troubleshooting",
        heading: "Import troubleshooting",
        items: [
          "Confirm the original video is still available in Photos and accessible to the app.",
          "For iCloud media, check your connection and allow the original to download. Check that your iPhone has space for a local copy.",
          "Retry after resolving access/download problems. If import still fails, send the exact error and video format details if known.",
        ],
      },
      {
        id: "recording-troubleshooting",
        heading: "Recording and Photos-copy troubleshooting",
        items: [
          "Check Camera permission and the high-frame-rate capability message. A permission change cannot add an unsupported camera mode.",
          "Keep storage available and wait for recording to finish saving before leaving. Follow any error or retry guidance shown.",
          "If a Photos copy fails, check Photos permission and storage. A pitch successfully saved in the app remains in My Pitches; the Photos copy is separate.",
        ],
      },
      {
        id: "unavailable-results",
        heading: "Unavailable measurements or results",
        paragraphs: [
          "Available results depend on Camera View, Throwing Arm, the required references/events, pitcher selection and visible landmarks. Review those inputs and confirm the exact frames. Keep the full pitcher visible in the video; a view or landmark that is not visible can limit which measurements are available.",
          "If a result is still unavailable, include the app's exact message and the steps you took in your support request.",
        ],
      },
      {
        id: "notes-context-sharing",
        heading: "Notes, Pitch Context and sharing",
        paragraphs: [
          "Open Athlete Notes from My Pitches, or Pitch Notes and Pitch Context from Pitch Details. Context is optional and manually entered. Motion does not measure ball velocity, and the location chart is a manual record rather than a calibrated plate measurement.",
          "From Pitch Details, choose Share Analysis to prepare and preview a Pitch Review PDF. Select individual notes, the athlete display name and marked frames only when you want them included. Share Original Video is separate. Review the output before choosing a recipient in the iOS share sheet.",
        ],
      },
      {
        id: "reference-study-compare",
        heading: "Reference Study and comparisons",
        paragraphs: [
          "Open References, choose Add Reference, select Photos or Files, add any optional metadata and Save. Open Study Reference to review the clip, choose a study interval, mark events, add bookmarks and keep notes. Use authorized clips only; a user-entered label does not verify identity or imply endorsement.",
          "In Study Reference, choose Compare With My Pitch and select one exact personal pitch. Review independently, or mark the same observable Front Foot Contact or Ball Release event on each side and select Align. Linked playback compares source clip time; edited or replay timing can differ from physical capture time.",
          "Saved Comparisons reopen paused and need deliberate alignment. Deleting a saved Comparison removes the configuration without deleting either source. If a source is missing or changed, follow the recovery message and preserve your notes and configuration. Do not delete or reinstall the app as the first troubleshooting step; send support the exact version/build and error, with private information removed.",
        ],
      },
      {
        id: "reporting-a-problem",
        heading: "Reporting a problem",
        paragraphs: ["Include these details in your email:"],
        items: [
          "iPhone model and iOS version.",
          "App version/build from app Settings.",
          "Steps to reproduce the problem.",
          "Expected behavior and actual behavior.",
          "Exact error text, if shown.",
        ],
        closing: [
          "Start with a written description. A screenshot can help, but screenshots and clips are optional. Remove unnecessary personal or private information before sending support material.",
          "Do not send private athlete footage unless it is intentionally needed to investigate the problem and you are authorized and comfortable sharing it. Obtain parent or guardian authorization for identifiable footage involving a minor. A video is not required to ask for help.",
          "Support is handled by the app owner through Gmail. Use written reports, redacted screenshots and relevant logs; provide athlete video only when needed and authorized. Our support policy deletes attachments within 30 days after resolution and message threads within 90 days, and honors verified sender deletion requests. See the Privacy Policy for provider-copy limits and further details.",
        ],
        link: {
          label: site.company.contactEmail,
          href: `mailto:${site.company.contactEmail}`,
        },
      },
      {
        id: "before-deleting",
        heading: "Before deleting or reinstalling",
        paragraphs: [
          "Pitches, Athlete Profile information, Notes, Pitch Context, marks, analysis history, References and Saved Comparisons are stored locally. Deleting the app and its data can remove them; reinstalling alone does not guarantee recovery. A Photos video or exported evidence image does not preserve the complete app history. Contact support before deleting or reinstalling as a troubleshooting step.",
          "Deleting a pitch does not delete independent Photos, backup or shared copies. For privacy questions or requests about information sent to support, use the privacy contact on our Privacy Policy page.",
        ],
        link: { label: "Read the Privacy Policy", href: "/privacy" },
      },
    ],
  },
} satisfies Record<"privacy" | "support", UtilityPageContent>;

export type TutorialMedia = SiteImage & {
  kind: "App screenshot" | "Instructional illustration";
  caption: string;
};
export type TutorialStep = {
  id: string;
  title: string;
  path?: "record" | "import";
  view?: "back" | "side";
  paragraphs: string[];
  items?: string[];
  note?: string;
  media?: string;
};
export type TutorialModule = {
  id: string;
  label: string;
  title: string;
  intro: string;
  steps: TutorialStep[];
};

const tutorialImage = (
  name: string, width: number, height: number, alt: string, caption: string,
  kind: TutorialMedia["kind"] = "App screenshot",
): TutorialMedia => ({ src: `/images/motion/tutorial/${name}`, width, height, alt, caption, kind });

export const tutorialMedia: Record<string, TutorialMedia> = {
  acquisition: tutorialImage("acquisition.png", 370, 246, "My Pitches actions: Explore your pitches, Import Video and Record New Pitch.", "The acquisition actions in My Pitches. Choose the path that matches your video."),
  backSetup: tutorialImage("back-setup.webp", 1536, 1024, "An upright phone on a tripod behind a full-body pitcher facing the throwing target.", "Back View: place the phone behind the pitcher. Portrait is recommended. Positioning illustration, not calibrated geometry or prescribed technique.", "Instructional illustration"),
  sideSetup: tutorialImage("side-setup.webp", 1536, 1024, "A horizontal phone on a tripod beside a pitcher, with room for the entire stride.", "Side View: record from beside the pitcher. Landscape is recommended. Leave room for the whole delivery.", "Instructional illustration"),
  framing: tutorialImage("framing-guides.svg", 960, 650, "Portrait Back and landscape Side framing rectangles, each with a dashed vertical centre line and a full-body figure inside.", "The framing guide uses a rectangle and dashed centre line. This diagram follows the current guide proportions; it is not an app screen or calibration tool.", "Instructional illustration"),
  sequence: tutorialImage("recording-sequence.svg", 960, 320, "Four physical recording stages: a steady phone, a pitcher throwing, waiting for saving, and reviewing the saved pitch.", "Set up, record the delivery, stop and wait, then review. Illustration of the physical sequence; phone screens are abstract.", "Instructional illustration"),
  cameraView: tutorialImage("camera-view.png", 370, 498, "Camera View step with Back View selected and the Next button.", "An existing Back View pitch. Confirm the camera position used for your own video."),
  throwingArm: tutorialImage("throwing-arm.png", 370, 431, "Throwing Arm step with Right selected, guidance for Unknown, and Back and Next buttons.", "Choose the pitcher's throwing arm, regardless of where the arm appears in the image."),
  marking: tutorialImage("mark-ffc.png", 370, 698, "Saved Front Foot Contact at exact frame 1,212 of 1,643, with playback, fine adjustment and Move Front Foot Contact controls.", "An existing FFC mark. The exact selected frame and the saved frame are shown separately. This screenshot does not prescribe an event frame for another video."),
  analyze: tutorialImage("analyze.png", 370, 418, "Pitch Mechanics summary showing three of three results up to date and the Analyze Pitch button.", "An existing pitch with current results. Viewing this screen does not run a new analysis."),
  result: tutorialImage("results-back.png", 346, 387, "A saved 2D Trunk-Segment Orientation result of 7 degrees toward image left, with a Details and Annotated Image link.", "One real saved Back View result at FFC. The displayed value describes this image; it is not a target or grade."),
  evidence: tutorialImage("evidence.png", 315, 723, "The saved pitching frame annotated with trunk landmarks and a vertical reference, followed by Save to Photos and Share.", "The annotated evidence behind that result. The original image proportions, landmarks and saved value are unchanged."),
  explorer: tutorialImage("explorer-home.png", 370, 650, "Your pitching history with Review marked frames and Measurement history entry points.", "Start with the marked video frames or explore available measurements."),
  marked: tutorialImage("marked-history.png", 370, 690, "August 27 Front Foot Contact marks, List and Frames options, two saved pitch thumbnails and Choose A and Choose B buttons.", "Review the exact marks you saved. The number of marked pitches depends on the selected event and filters."),
  chooseB: tutorialImage("choose-b.png", 370, 580, "Choose pitch B sheet with one August 27 pitch already selected as A and another eligible August 27 FFC mark.", "Select a different pitch for B. Both sides compare the same marked event."),
  comparison: tutorialImage("comparison.png", 370, 661, "Two August 27 Front Foot Contact frames side by side, with Open A, Open B and Auto layout controls.", "A real pair with different camera views. The layout preserves image proportions; placing frames together does not make their perspectives equivalent."),
  chooser: tutorialImage("measurement-chooser.png", 370, 654, "The upper part of the measurement chooser, showing Back-view measures and the Side-view ankle-span ratio.", "Choose one measurement. This crop shows the upper part of the list; lead-knee bend at FFC and Ball Release are also available for Side View."),
  chart: tutorialImage("chart.png", 370, 571, "History Chart with individual recorded values in degrees and Chart, Table and Evidence tabs.", "Trunk-orientation history in Chart. These are actual saved observations, not benchmark or ideal values."),
  table: tutorialImage("table.png", 370, 535, "History Table showing two dated retained pitches and their saved degree values.", "Table makes individual contributors readable. A pitch date and the date the video was added can differ."),
  questions: tutorialImage("questions.png", 314, 235, "Explorer question menu: History, Two pitches, Grouped summary and Two periods.", "Four ways to ask a descriptive question of supported saved history."),
  filters: tutorialImage("filters.png", 370, 520, "Explorer options for pitch dates, camera view and throwing side, with Cancel and Apply.", "Options narrow the included history. Apply confirms your changes; Cancel leaves the current question unchanged."),
  dates: tutorialImage("date-range.png", 319, 367, "Date choices: Last 7 days, Last 30 days, Last 90 days, All, Custom and pitches without a pitch date.", "Choose a relative window, a custom range, all dates or pitches with no known pitch date."),
  savedView: tutorialImage("save-view.png", 382, 310, "Save as New View dialog with an empty view name, Cancel and Save buttons.", "A Saved View remembers a question and its settings. Its results refresh from current history when reopened."),
  settings: tutorialImage("settings.png", 370, 470, "Settings with About, Privacy Policy and Support.", "Settings provides version information and links to privacy and support."),
  about: tutorialImage("about.png", 370, 275, "About showing Asymmetri Motion version 1.0 (1).", "App version and build help support investigate a problem. Your installed version may differ."),
};

export const tutorial = {
  path: "/tutorial",
  canonical: "https://www.asymmetri.co/tutorial",
  title: "Asymmetri Motion Tutorial",
  metadata: {
    title: "Asymmetri Motion Tutorial | Asymmetri Sports",
    description: "Learn to measure pitching mechanics, build history, compare changes with recorded performance context, and return to the video and evidence in Asymmetri Motion.",
  },
  introduction: "Measure. Track. Compare. Learn. Build a pitching history, investigate changes alongside recorded context, and return to the evidence with your coach. Follow the steps or jump to what you need.",
  disclosure: "For the normal pitching workflow in the V1.2 candidate, which is preparing for release. App screenshots show real retained pitching media used with the owner's permission. Physical setup images are instructional illustrations. Screen details may vary by version.",
  link: { label: "Follow the Motion tutorial", href: "/tutorial" },
  modules: [
    {
      id: "start", label: "Start", title: "Measure once. Build a history.",
      intro: "One measurement tells you about one pitch. Repeating the same measurement across comparable pitches lets you see whether something is changing.",
      steps: [
        { id: "what-motion-is-for", title: "What Motion is for", paragraphs: ["A history lets you investigate whether a change is consistent, whether one pitch was an outlier, and what else changed during the same period.", "Motion gives you measurements and evidence. You and your coach decide what they mean. It does not tell you how you should throw."] },
        { id: "your-first-pitch", title: "The workflow you will repeat", paragraphs: ["Start in My Pitches. Choose Record Pitch for a fresh recording, or Import Video for a video already in Photos. The recording button says Record New Pitch when you already have a pitch."], items: ["Record or import comparable pitches; confirm Camera View and Throwing Arm.", "Mark the same meaningful events, one exact frame at a time.", "Choose Analyze Pitch and inspect the result.", "Repeat to build your saved history.", "Explore changes in the same measurement over time.", "Compare those changes with the performance context you recorded.", "Return to each pitch’s video and evidence, then discuss what you see with your coach."], media: "acquisition" },
        { id: "before-you-start", title: "What you need", paragraphs: ["Use an iPhone running iOS 17 or later. Direct recording needs a supported high-frame-rate rear camera mode. Import is also a first-class path into the same review workflow.", "Keep the full pitcher visible, with enough light and space for the delivery. A steady camera and clear landmarks make review more useful. For comparisons, aim to repeat the camera position, framing and event-selection approach. Athlete Profile is optional; you can start with a video."], note: "Results are projected 2D measurements from video images. They are not 3D anatomy, injury predictions, ball velocity, mechanics grades or automatic coaching. A coach supplies the context." },
      ],
    },
    {
      id: "record-or-import", label: "Record or Import", title: "Start with a clear video.",
      intro: "Choose your acquisition path below. Both paths create a saved pitch that you can review in the same way.",
      steps: [
        { id: "record-back-view", title: "Back View: behind the pitcher", path: "record", view: "back", paragraphs: ["In My Pitches, choose Record Pitch (or Record New Pitch), then Back View. Position the phone behind the pitcher, looking toward the throwing target. Portrait orientation is recommended.", "Keep the phone steady and outside the throwing path. Leave space around the head, throwing hand and both feet throughout the delivery. Check the actual camera preview before starting."], media: "backSetup" },
        { id: "record-side-view", title: "Side View: beside the pitcher", path: "record", view: "side", paragraphs: ["Choose Side View and position the phone beside the pitcher, looking across the delivery. Landscape orientation is recommended. Orientation is guidance, not a calibration step.", "Include the clear starting stance and the whole stride through release. Keep the nose, both ankle/foot regions, throwing arm and full body visible. Avoid moving or zooming the camera between the starting stance and Front Foot Contact."], media: "sideSetup" },
        { id: "framing-guide", title: "Use the guide to keep room around the pitcher", path: "record", paragraphs: ["Use Show Guide or Hide Guide in the capture controls. The rectangle and dashed centre line help you compose the recording. Keep the full delivery inside the usable image; the guide does not detect the pitcher or measure physical distance.", "The preview uses the rear wide camera at fixed 1×. Motion prefers a supported 240 fps format, with 120 fps as the fallback. Available modes depend on the iPhone. If no suitable mode is supported, use Import Video."], media: "framing" },
        { id: "recording-setups", title: "Optional: save a Recording Setup", path: "record", paragraphs: ["Open the capture details menu to use Recording Setup. Save New Setup remembers the selected view and guide visibility. You can give it a name, return to it later, edit it or delete it. Recording without a saved setup is fine.", "A setup can specify Back View, Side View or Use Video Shape. Reusing it supplies app preferences for a new recording. You still need to put the phone in the intended physical position and check the preview each time."], note: "A saved Recording Setup does not store or reproduce the tripod position, camera perspective, distance, lens, zoom or frame rate. It does not calibrate measurements or change previously saved pitches." },
        { id: "record-and-save", title: "Record, stop, wait for the saved pitch", path: "record", paragraphs: ["Allow Camera access when asked. Start with the red recording control, record the delivery, then use the stop control in the same place.", "Wait while the video finishes saving. The pitch is saved locally in the app; the Photos copy is a separate step. If that copy fails, a successfully saved app pitch remains in My Pitches. Follow the message on screen before retrying."], note: "Direct recordings are video-only. An imported original may contain audio.", media: "sequence" },
        { id: "import-from-photos", title: "Import an existing video", path: "import", paragraphs: ["From My Pitches, choose Import Video and select the original pitching video in Photos. With limited Photos access, include that video in the items the app can access.", "If the original is in iCloud, allow it to download and keep enough free storage for the local copy. Wait for import to finish, then open the saved pitch.", "If the same Photos item is already imported, Open Existing Pitch returns to that observation. Use as New Pitch intentionally creates a separate observation with its own review history. This is a choice about that Photos item, not a search for all visually similar clips."], media: "acquisition" },
      ],
    },
    {
      id: "set-up-the-pitch", label: "Set Up the Pitch", title: "Confirm what this video shows.",
      intro: "Setup belongs to each saved pitch. Review the actual recording, even if a saved setup or profile supplied a starting value.",
      steps: [
        { id: "camera-view", title: "Confirm Camera View", paragraphs: ["Choose Back View for a camera primarily behind the pitcher, looking toward the target. Choose Side View for a camera beside the pitcher.", "An imported video's shape can suggest a starting choice, but portrait or landscape alone does not establish the real camera position. Correct it if needed. Other / Not sure has no supported normal measurement results."], note: "Choosing a view does not calibrate the camera. Each video is analyzed independently; Motion does not combine Back and Side recordings into a 3D view.", media: "cameraView" },
        { id: "throwing-arm", title: "Confirm Throwing Arm", paragraphs: ["Select Right, Left or Unknown for the pitcher in this video. Use the arm that throws the ball, not the side where it appears on screen.", "Unknown is allowed. Results that depend on throwing arm remain unavailable, while independent results can still be analyzed. A profile default helps with new pitches; it does not rewrite the saved choice on older ones."], media: "throwingArm" },
        { id: "review-inputs", title: "Return with Review Pitch Inputs", paragraphs: ["Use Next and Back to follow the Guided steps. Back View continues to Front Foot Contact and Ball Release. Side View includes Setup Reference first.", "From a saved pitch, Review Pitch Inputs takes you through the same sequence. Existing values and marks remain saved until you explicitly change them. After changing an input, check Results and choose Analyze Pitch when you want to update the affected analysis." ] },
      ],
    },
    {
      id: "mark-the-moments", label: "Mark the Moments", title: "Find the frame. Then confirm it.",
      intro: "You identify the important moments. The selected sample and the saved mark are separate until you use Set or Move.",
      steps: [
        { id: "setup-reference", title: "Side View: mark Setup Reference first", view: "side", paragraphs: ["Find the latest clear starting-stance frame before the visible forward stride begins. The nose, both ankle/foot regions and full body need to be visible, with consistent framing through Front Foot Contact.", "Confirm the exact frame with Set Setup Reference. It must precede FFC. This is a reference image for the Side-view ankle-span ratio, not an extra pitching event or a physical height calibration." ] },
        { id: "front-foot-contact", title: "Mark Front Foot Contact (FFC)", paragraphs: ["Look for the earliest visible frame where the lead foot or its footwear contacts the surface after the stride. The lead foot is the foot that lands toward the target.", "Use playback and the coarse scrubber to get close. Pause, then use Fine-adjust frame or the previous/next frame controls to inspect nearby samples. Wait for the exact frame to finish loading before confirming."], items: ["Check the exact-frame number and the image together.", "Release the slider before using Set Front Foot Contact.", "For an existing mark, Move Front Foot Contact replaces its location only when you confirm.", "Use Go To to revisit an existing saved mark without changing it."], media: "marking" },
        { id: "ball-release", title: "Mark Ball Release", paragraphs: ["Continue to Ball Release. Find the earliest visible frame where the ball is spatially separated from the throwing hand. Use the same coarse and fine controls, then Set Ball Release.", "If the ball or hand is obscured, inspect nearby exact frames carefully. Do not treat a blurred guess as a precise event. Better source footage may be needed. Motion does not make an authoritative automatic event choice for you."], note: "Set / Move is unavailable while dragging or loading an exact frame. Changing a mark can make affected results out of date; explicit Analyze Pitch updates eligible results. Old analysis history is retained." },
        { id: "pitcher-selection", title: "If more than one person is visible", paragraphs: ["When Motion asks for Pitcher Selection, identify the intended pitcher in the image. Draw or adjust the region around the expected delivery area, or choose the intended numbered candidate when offered. Make the selection conclusive before saving.", "Use Edit to revise the region or Clear to remove it. Then explicitly retry analysis if requested. A selection can fail if the intended person's landmarks are not clearly detected; selecting a region does not manufacture missing landmarks."], note: "Pitcher Selection is spatial subject disambiguation. It is not face recognition, verified athlete identity or cross-frame tracking." },
      ],
    },
    {
      id: "analyze", label: "Analyze", title: "Turn the confirmed inputs into results.",
      intro: "Analysis is an explicit action. Available results depend on view, marks, throwing arm, pitcher selection and visible landmarks.",
      steps: [
        { id: "what-should-i-track", title: "What should I track?", paragraphs: ["Choose a question and a measurement you can revisit at the same event. Side View offers the ankle-span ratio at Front Foot Contact and separate lead-knee bend results at Front Foot Contact and Ball Release. Back View offers trunk orientation at Front Foot Contact and the two arm-related results at Ball Release.", "The results below use the current app’s names. For exact technical definitions, open Settings → About → Measurements. Keep each event’s result separate; these are observations to investigate, not targets to achieve."] },
        { id: "run-analysis", title: "Choose Analyze Pitch", paragraphs: ["At Results, check the Pitch Mechanics summary and choose Analyze Pitch. Let processing finish, then read the state of each result.", "Motion performs pose analysis on device. Eligible measurements can finish independently: one unavailable result does not mean every other result failed. Opening Results alone does not run a new analysis."], media: "analyze" },
        { id: "back-results", title: "Back View: three supported results", view: "back", paragraphs: ["These are measurements projected in the video image. Each belongs to a particular marked event."], items: motionMeasurements.groups.filter((group) => group.view === "Back View").flatMap((group) => group.items.map((item) => `${item.title} at ${group.event}: ${item.body}`)), note: "Image vertical is not ground or gravity vertical. Camera roll and perspective affect these values. They do not establish anatomical joint angles or arm slot.", media: "result" },
        { id: "side-results", title: "Side View: three supported results", view: "side", paragraphs: ["Side View uses the marked starting stance and events where each measurement requires them."], items: motionMeasurements.groups.filter((group) => group.view === "Side View").flatMap((group) => group.items.map((item) => `${item.title} at ${group.event}: ${item.body}`)), note: "The ratio is not physical stride length or percentage of actual body height. These Side-view descriptors remain experimental; availability in the app does not establish scientific accuracy or an ideal range. Higher or lower is not a score." },
        { id: "result-status", title: "Read the status before the number", paragraphs: ["Current results correspond to the saved inputs. If an input changed, review the affected result's status and analyze again. If a result is unavailable, follow its reason: missing marks, unknown throwing arm, ambiguous pitcher selection or missing landmarks may need attention.", "A failed new attempt does not make an older saved result a new success. Review the event, context and currentness before comparing values. No number is better than a number inferred from evidence that is not there." ] },
      ],
    },
    {
      id: "inspect-evidence", label: "Inspect Evidence", title: "A result should lead back to its evidence.",
      intro: "Use Details and Annotated Image to understand what contributed to a displayed value.",
      steps: [
        { id: "read-evidence", title: "Check the frame and its references", paragraphs: ["Open the result's evidence. Check that the marked event, camera view and intended pitcher match what you meant to analyze.", "Inspect the estimated landmarks and reference lines against the visible body. Read the projected value in that image's context. The ankle-span ratio uses two source frames, Setup and FFC; inspect both.", "The overlay makes the calculation inspectable. It does not guarantee that a pose estimate is correct. Occlusion, blur, perspective and event selection can change the result."], media: "evidence" },
        { id: "save-share-evidence", title: "Save or share deliberately", paragraphs: ["Save to Photos adds a copy of the evidence image, subject to Photos permission and storage. Share opens the native sharing options; choose the destination yourself.", "Review what the image includes before sending it. Share identifiable athlete footage only with appropriate permission. An evidence image is useful for discussion, but it is not a backup of the video, marks, profile or complete analysis history." ] },
      ],
    },
    {
      id: "saved-pitches", label: "Saved Pitches", title: "Return to the original observation.",
      intro: "My Pitches is your local library. A saved pitch keeps its own video, setup, marks and analysis history.",
      steps: [
        { id: "reopen-pitch", title: "Open a saved pitch", paragraphs: ["Return to My Pitches and use the thumbnail and date to find the observation. Open it to revisit Results, evidence or Review Pitch Inputs. Use the saved mark's Go To action when you want to inspect its frame.", "Pitch Date can come from the source or a date you specify. An Added date means when the video entered the app, not necessarily when the pitch was thrown. Keep that distinction in mind when exploring development over time."], media: "acquisition" },
        { id: "pitch-context", title: "Record what else was happening", paragraphs: ["In the saved pitch’s details, open Pitch Context to add or edit the context you know: Pitch Type, Velocity with its unit and reported source, Pitch Location on the chart, and Pitch Result. Save your changes.", "Mechanics history becomes more useful when you can investigate what else was happening during those pitches. Record context consistently and leave unknown information unrecorded. These are manual entries; Motion does not measure ball velocity or automatically determine an outcome."] },
        { id: "keep-history", title: "Understand what is local", paragraphs: ["Two imports kept as separate observations have separate review histories. Changing one does not turn it into a revision of the other.", "Deleting a pitch removes that app observation and its local video, marks, analysis and evidence. It does not delete an independent Photos copy or the Athlete Profile. Use deletion only when you intend to remove that observation."], note: "Deleting or reinstalling the app can remove local history. A Photos video or exported evidence image does not restore the complete app record. Contact support before deleting or reinstalling as troubleshooting." },
      ],
    },
    {
      id: "explore-history", label: "Explore History", title: "Ask a question of your saved pitches.",
      intro: "Use your history to investigate what changed, whether it persisted, and what changed alongside it. Choose Explore your pitches from My Pitches to begin.",
      steps: [
        { id: "why-repeat-measurements", title: "Why repeat measurements?", paragraphs: ["One pitch can be an outlier. A history lets you look for consistency across several pitches and training dates before deciding what a difference means."], items: ["Has my stride-related measurement changed?", "Is my Back View trunk position different now?", "Has my lead-leg position changed between training periods?", "Did those differences occur during the same period my recorded velocity changed?", "Are they consistent, or present in only one pitch?"], note: "Compare the same measurement and event, then check the camera perspective and evidence behind the difference." },
        { id: "history-entry", title: "Choose frames or measurements", paragraphs: ["Review marked frames lets you revisit the exact moments you confirmed, including pitches without a usable measurement. Measurement history uses supported saved results and their evidence."], media: "explorer" },
        { id: "marked-frames", title: "Review the same event across pitches", paragraphs: ["In Review marked frames, choose Front Foot Contact, Ball Release or Setup Reference. Switch between List and Frames. The count tells you how many included pitches have a saved mark for that event.", "Open a row or Show frame to inspect the exact saved image. Change the date and context filters when you want a narrower set."], media: "marked" },
        { id: "choose-pair", title: "Choose A, then choose B", paragraphs: ["Use Choose A and Choose B to select two different pitches with the matching marked event. Replace either side to try another pair. The choices are temporary unless you save the view."], media: "chooseB" },
        { id: "compare-frames", title: "Inspect the pair and open the originals", paragraphs: ["Auto, Side by side and Stacked change the layout while preserving each image's proportions. Tap a frame to enlarge it and use Done to return.", "Open A or Open B returns to the original saved pitch. Use Back to return to the comparison. Select another matching event when both pitches have the needed mark."], note: "Compare framing before comparing movement. Different camera positions, views or marking decisions can create visual differences. A side-by-side layout does not make the recordings equivalent.", media: "comparison" },
        { id: "measurement-history", title: "Choose one measurement", paragraphs: ["Open Measurement history and choose a supported measure. The same six normal results described in Analyze are available where saved records exist. An empty history can simply mean that no included pitch has an eligible result for that measure."], media: "chooser" },
        { id: "chart", title: "Chart: locate an observation", paragraphs: ["Use Chart to see the included recorded values across pitch dates. Touch a plotted item, or use Previous / Next, to choose an observation.", "Read the included count and context before interpreting the pattern. Large histories may be summarized into date bins; inspect the contributors and ranges instead of treating a summary as a new pitch."], media: "chart" },
        { id: "table-evidence", title: "Table and Evidence: inspect the contributors", paragraphs: ["Use Table for readable values, pitch dates and individual contributors. Open an observation to understand which pitch supplied it.", "Use Evidence to inspect the saved annotated image associated with the selected result. Return to the original pitch when you need the video or marked frame. If evidence or a source pitch is unavailable, follow the displayed state rather than assuming the missing item was included."], media: "table" },
        { id: "mechanics-and-performance", title: "Look at mechanics and performance together", paragraphs: ["Select an individual measurement in Chart, Table or Two pitches to inspect its recorded velocity, graphical pitch location, pitch type and result where available. For a grouped point, open an exact contributing pitch before treating its context as an individual observation.", "Use supported Pitch Context filters to compare the pitches relevant to your question. Ask whether a change in the measurement appeared during the same period as a change in recorded performance. Then return to the contributing pitch, marked frame and evidence."], note: "A relationship does not prove causation. Motion surfaces evidence for investigation; you and your coach decide what it means." },
        { id: "history-questions", title: "Choose the question", paragraphs: ["The question menu changes what you are investigating. These views describe recorded data; they do not estimate improvement or prescribe targets."], items: ["History: review individual observations over time.", "Two pitches: choose an exact A/B pair for one supported measurement.", "Grouped summary: compare groups using the available grouping, centre and weighting choices.", "Two periods: compare an earlier date interval with a later one; the earlier period must finish before the later period begins."], note: "A numerical difference requires compatible recorded meanings. If a difference is unavailable, inspect the reason and the individual evidence. Filtering cannot make incompatible records comparable.", media: "questions" },
        { id: "history-filters", title: "Narrow the recorded context", paragraphs: ["Open Options and choose Camera View and Throwing side filters. Apply confirms the draft choices; Cancel leaves the current view unchanged.", "For summaries, choose the centre, such as mean or median, and weighting. Each Pitch gives each included pitch weight. Each Pitch Date gives dates equal weight. A pitch date is not proof that all pitches came from one session."], media: "filters" },
        { id: "history-dates", title: "Set the date window", paragraphs: ["Choose Last 7 days, Last 30 days, Last 90 days, All or Custom. Pitches without a pitch date have a separate choice. Check the date boundaries and the time zone used for the question.", "Relative windows move with time. A custom range expresses specific dates. Inspect included pitch dates when a result or comparison seems unexpectedly empty."], note: "Angle differences use degrees. Differences between percentage-valued ankle-span ratios use percentage points. Neither unit makes a difference evidence of improvement.", media: "dates" },
        { id: "saved-views", title: "Save a question you want to revisit", paragraphs: ["Use the view controls to Save as New View, give it a useful name, and save. Reopen a Saved View to restore its question, filters, event and exact pitch selections where applicable.", "Update an existing view when you intend to replace its saved settings; Save as New keeps a separate view. Results refresh from current history, so a Saved View is not a frozen snapshot. Relative date windows stay relative. If a pinned pitch is no longer usable, select a replacement. Use Saved View actions to rename or delete a saved question; deleting a view does not delete its pitches."], note: "Camera position, event marking and pose estimation affect comparisons. A recorded difference is descriptive; discuss its meaning with a coach.", media: "savedView" },
      ],
    },
    {
      id: "profile-and-settings", label: "Profile & Settings", title: "Keep useful context close.",
      intro: "Profile information and app settings support the workflow. They are not measurement calibration.",
      steps: [
        { id: "athlete-profile", title: "Optional Athlete Profile", paragraphs: ["Open Athlete Profile from My Pitches. Current fields include name, date of birth with derived age, throwing arm, batting side, and primary and secondary positions.", "Height and weight support dated entries in metric or imperial units. Use Add Entry for a new measurement date. Use Correct Entry to correct an existing entry; Earlier Entries lets you review retained history.", "Profile throwing arm can supply a default for new pitches. Confirm each pitch's saved value. Editing a profile does not retroactively alter old pitch inputs or calibrate the projected measurements."] },
        { id: "settings-help", title: "Settings, Privacy and Support", paragraphs: ["Open Settings from My Pitches. About shows the installed app and version. Privacy Policy explains data handling, and Support provides help and contact details.", "Pitches and profile information are local to the app. Saving or sharing a copy is a deliberate action; review the destination and the information included."], media: "settings" },
        { id: "app-version", title: "Find the version before reporting an issue", paragraphs: ["In Settings → About, note the version and build shown on your device. Include them with the iPhone model, iOS version, exact message and the steps that led to the problem."], media: "about" },
      ],
    },
    {
      id: "troubleshooting", label: "Troubleshooting", title: "Find the next useful check.",
      intro: "Open the category that matches what you see. Preserve your saved work while resolving the problem.",
      steps: [
        { id: "get-help", title: "When you need more help", paragraphs: ["Start with a written description of the problem, what you expected and the exact message shown. A video is not required to ask for help. Screenshots or clips are optional; remove unnecessary personal information and share only material you are authorized to send.", "Use the support page for more detailed guidance. Avoid deleting the app or local pitches as a routine fix." ] },
      ],
    },
  ] satisfies TutorialModule[],
  troubleshooting: [
    { id: "cannot-record", title: "I can't record", body: "Check Camera permission in iOS Settings and read the supported-camera message. Direct capture needs a compatible rear wide high-frame-rate mode. Permission cannot add unsupported hardware capability. Use Import Video if no suitable mode exists; keep enough storage and wait for saving to finish." },
    { id: "cannot-import", title: "I can't import", body: "Confirm that the original still exists in Photos and is included in limited access. For iCloud media, check the connection and wait for the original download. Check free storage, then retry. Use Open Existing Pitch if you meant to return to an already imported Photos item." },
    { id: "cannot-mark", title: "Set / Move or Analyze is unavailable", body: "Pause playback, finish dragging and wait for the exact frame to load. Confirm Camera View, Throwing Arm and required marks. Side View needs a Setup Reference before FFC. Follow the displayed readiness message and explicitly choose Analyze Pitch when ready." },
    { id: "unavailable-result", title: "A result is unavailable or out of date", body: "Read the individual result's reason. Confirm its event, view, throwing arm and visible landmarks. Review Pitcher Selection if requested. After changing inputs, explicitly analyze again. A missing landmark or unsuitable view may require a clearer source video; do not substitute an invented value." },
    { id: "multiple-people", title: "More than one person is visible", body: "Use Pitcher Selection when prompted. Adjust the region or choose the intended candidate, then save and explicitly retry. Edit or Clear a prior selection if needed. A spatial selection is not identity recognition and cannot guarantee a usable pose." },
    { id: "photos-save-failed", title: "The Photos copy or evidence export failed", body: "Check permission to add to Photos and available storage, then follow the retry message. A pitch successfully saved in My Pitches is separate from its Photos copy. Check the library before assuming that a Photos error lost the local pitch." },
    { id: "permission-problem", title: "I need to change a permission", body: "In iOS Settings, find Asymmetri Motion or use Privacy & Security → Camera / Photos. Enable the needed access; limited Photos access must include the chosen video. Parental controls or managed-device restrictions may require the device manager's help. You do not need to delete the app to change permissions." },
    { id: "empty-history", title: "History, evidence or a comparison is missing", body: "Check the event or measurement, date window, camera view, throwing side and included count. Include unknown pitch dates if relevant. The chosen pair needs matching marks or compatible measurement records. Reopen each original pitch to inspect its saved inputs and current result. Replace missing Saved View selections when asked." },
  ],
} as const;

// Umbrella homepage, division copy and optional introduction media.
export const home = {
  metadata: {
    "title": "Asymmetri | Build an Asymmetric Advantage",
    "description": "Technology for outsized capability. Explore Asymmetri Sports and Motion, and Asymmetri Labs and its experimental open-source project BotSquad.",
    "socialHeadline": "Build an asymmetric advantage.",
    "socialSupport": "Technology for individuals and small teams."
  },
  origin: {
    eyebrow: "It began in baseball",
    headline: "A phone camera, and a lot of replaying.",
    body: "As a coach, I started recording pitches in slow motion and comparing them frame by frame. The useful part was looking at the same moment with a player. The slow part was finding it again. That experience led to Motion.",
    attribution: "From the founder",
    link: { label: "Read the story", href: "/sports#story" },
    caption: "Pitching is where our work began.",
  },

  divisionHeading: "Two divisions. One Asymmetri.",
  hero: {
    eyebrow: "Asymmetri.co",
    headline: "Build an asymmetric advantage.",
    support:
      "Technology that gives people and small teams more capability with the resources they already have.",
    about: { label: "Why Asymmetri", href: "/about" },
  },
} as const;

export const sportsNavigation: NavItem[] = [
  { label: "Story", href: "/sports#story" },
  { label: "Approach", href: "/sports#approach" },
  { label: "Motion", href: "/motion" },
  { label: "Contact", href: "/sports#contact" },
];

export const botsquad = {
  name: divisions.labs.product.name,
  path: divisions.labs.product.path,
  eyebrow: "Asymmetri Labs / Open-source experiment",
  headline: "What if your AI assistants could work as a team?",
  descriptor:
    "BotSquad is an open-source experiment in building persistent teams of AI workers. Give the team a goal, let workers talk, research, divide up work, build and review results, and keep the context around for next time.",
  status: "Experimental · Open source · Self-hosted",
  licenseUrl: "https://github.com/eugenelin89/bot_messenger/blob/main/LICENSE",
  licenseNote: "MIT licensed. Source, setup instructions and validation records are public.",
  metadata: {
    title: "BotSquad | Open-Source Persistent AI Teams",
    description:
      "An Asymmetri Labs experiment in persistent AI teams. Explore workers, conversations, research, software projects and reviews in a self-hosted Ubuntu workspace.",
  },
  source: {
    label: "View source on GitHub",
    href: "https://github.com/eugenelin89/bot_messenger",
  },
  gettingStarted: {
    label: "Set up BotSquad",
    href: "https://github.com/eugenelin89/bot_messenger#set-up-a-brand-new-botsquad-server",
  },
  whitePaper: {
    label: "Read the technical white paper",
    href: "https://github.com/eugenelin89/bot_messenger/blob/main/docs/WHITEPAPER.md",
  },
  roadmapLink: {
    label: "See the roadmap",
    href: "https://github.com/eugenelin89/bot_messenger/blob/main/docs/product/ROADMAP.md",
  },
  navigation: [
    { label: "The idea", href: "#the-goal" },
    { label: "Meet the team", href: "#how-it-works" },
    { label: "What works", href: "#capabilities" },
    { label: "An example", href: "#example" },
    { label: "Try it", href: "#availability" },
  ] satisfies NavItem[],
  goal: {
    eyebrow: "The experiment",
    headline: "The goal: an AI team, not a pile of chats.",
    problem:
      "One chat has the research. Another has the plan. A third has the code. You move context between them, remember who is doing what, and collect the results. The human becomes the coordinator.",
    ambition:
      "We’re exploring how much of that coordination can live inside the system. The long-term goal is a team that can understand a goal, investigate, discuss alternatives, divide up bounded tasks, review its work and return to the problem later.",
    boundary: "The human remains in control of the authority the team has.",
  },
  workerModel: {
    headline: "The workers stick around.",
    body:
      "Atlas is still Atlas tomorrow. Maya is still Maya. Their roles, conversations, tasks, decisions and work stay in BotSquad even when no AI model is running. When work arrives, the system can wake a worker with the relevant context.",
    continuity: "A Codex session can stop or be replaced without replacing the worker.",
    retained: ["Identity & role", "Conversations & tasks", "Artifacts & history"],
    runtime: "Model sessions come and go. The worker remains.",
  },
  team: {
    headline: "Meet BotSquad",
    owner: "You",
    ownerRole: "Set the goal and boundaries",
    lead: { name: "Atlas", portrait: { src: "/images/botsquad/atlas.webp", width: 384, height: 384, alt: "Illustrated portrait of Atlas, a BotSquad AI worker." }, role: "CEO", body: "Coordinates goals and decisions." },
    branches: [
      { name: "Maya", portrait: { src: "/images/botsquad/maya.webp", width: 384, height: 384, alt: "Illustrated portrait of Maya, a BotSquad AI worker." }, role: "Product Manager", body: "Turns ideas into questions and specifications.", reports: [] },
      { name: "Turing", portrait: { src: "/images/botsquad/turing.webp", width: 384, height: 384, alt: "Illustrated portrait of Turing, a BotSquad AI worker." }, role: "CTO", body: "Works through technical direction.", reports: [
        { name: "Linus", portrait: { src: "/images/botsquad/linus.webp", width: 384, height: 384, alt: "Illustrated portrait of Linus, a BotSquad AI worker." }, role: "Engineer", body: "Builds within an assigned scope." },
        { name: "Ada", portrait: { src: "/images/botsquad/ada.webp", width: 384, height: 384, alt: "Illustrated portrait of Ada, a BotSquad AI worker." }, role: "Engineer", body: "Builds a separate part in parallel." },
        { name: "Grace", portrait: { src: "/images/botsquad/grace.webp", width: 384, height: 384, alt: "Illustrated portrait of Grace, a BotSquad AI worker." }, role: "Reviewer", body: "Independently reviews submitted work." },
      ] },
      { name: "Scout", portrait: { src: "/images/botsquad/scout.webp", width: 384, height: 384, alt: "Illustrated portrait of Scout, a BotSquad AI worker." }, role: "Researcher", body: "Investigates public information when granted.", reports: [] },
      { name: "Nix", portrait: { src: "/images/botsquad/nix.webp", width: 384, height: 384, alt: "Illustrated portrait of Nix, a BotSquad AI worker." }, role: "DevOps", body: "Coordinates worker infrastructure with human approval.", reports: [] },
    ],
  },
  capabilities: {
    headline: "What can BotSquad actually do?",
    items: [
      { title: "Talk", body: "Have direct conversations with workers or let them exchange bounded replies. Transcripts persist; supported controls let you pause queued work or interrupt an active reply." },
      { title: "Think together", body: "Choose a working group or ask Atlas to organize one. Workers discuss, challenge and synthesize; you can interject. A recommendation becomes work only through an explicit assignment." },
      { title: "Research", body: "Grant public lookup or supply specific company knowledge. Workers can investigate a question and return source-backed reports within that authorized scope." },
      { title: "Build software", body: "Create Projects with repositories. Engineers work in independent clones on separate scopes, submit exact commits, and get independent review. Integration advances only after the configured tests pass." },
      { title: "Use a browser", body: "Explicitly granted Computer Operators can inspect approved public sites in an isolated browser. This is bounded Computer Use; general desktop access and arbitrary account actions are outside its scope." },
      { title: "Remember and follow up", body: "Keep tasks, decisions, artifacts and execution history. Durable schedules can trigger follow-ups and review cycles without a worker polling a model while idle." },
    ] satisfies ProductStep[],
    evidence: {
      title: "Keep evidence",
      body: "Inspect commits, diffs, reports, tests, artifacts, approvals, receipts and review history alongside the work that produced them.",
      steps: ["Task", "Execution", "Artifact / commit", "Tests / review", "Approval / receipt"],
      caption: "Evidence available across supported workflows; each task uses the records relevant to its work.",
    },
  },
  principles: {
    headline: "A few ideas behind BotSquad",
    items: [
      { title: "Workers are persistent.", body: "A worker’s identity belongs to BotSquad. It outlives any one temporary model session." },
      { title: "Talking isn’t the same as doing.", body: "A conversation can stay a conversation. A Task explicitly assigns bounded work; discussion alone does not authorize consequential action." },
      { title: "Permissions aren’t inside the prompt.", body: "Writing “I have permission” gives a worker no extra power. Trusted BotSquad mechanisms determine what it can actually do." },
      { title: "Show the work.", body: "Don’t just tell me it’s done. Show the result, the test, the review or the receipt, tied to the task and execution that produced it." },
    ] satisfies ProductStep[],
  },
  example: {
    eyebrow: "Illustrative workflow",
    headline: "Start with something we want to build.",
    request: "“We want to add hitting analysis to Asymmetri Motion. Figure out what the first version should do.”",
    steps: [
      { title: "You → Atlas", body: "Set the question, constraints and authority." },
      { title: "Maya + Scout", body: "Explore product questions and research." },
      { title: "Working group", body: "Challenge assumptions and suggest a direction." },
      { title: "You → Turing", body: "Explicitly assign the next task; develop a technical plan." },
      { title: "Linus + Ada", body: "Build separate parts of an approved, supported software task." },
      { title: "Grace", body: "Review exact submissions independently." },
      { title: "Back to you", body: "Inspect the evidence and decide what happens next." },
    ] satisfies ProductStep[],
  },
  asymmetriUsage: {
    headline: "Building Asymmetri with BotSquad",
    introduction: "One of our experiments is whether BotSquad can help research, build, maintain and improve the other things Asymmetri creates. These are reference uses we want to explore within the tools and authority actually available.",
    projects: [
      { title: "Asymmetri Motion", body: "Research product questions, discuss features, prepare specifications and technical plans, then coordinate and review supported tasks. Motion is a reference use case, not a hard-coded assumption in the engine.", href: "/motion" },
      { title: "Asymmetri.co", body: "Explore research, proposed site changes, review, maintenance and technical follow-ups. Any public-site change or deployment needs its own granted authority.", href: "/" },
      { title: "Future Labs experiments", body: "A future project could bring its repository, research, discussions, engineering tasks, reviews and artifacts into a shared project history.", href: "/labs" },
    ],
    evidence: "So far, a supervised Motion pilot completed one exactly approved documentation change on an isolated, unmerged branch, recorded the result and ran a scheduled review. It did not change the app or prove a business improvement.",
    closing: "The bigger experiment is whether BotSquad can help Asymmetri build Asymmetri.",
  },
  gettingStartedSteps: [
    { title: "Choose an Ubuntu host", body: "Use a machine or VPS you control. Follow the repository’s current host requirements." },
    { title: "Clone and bootstrap", body: "Clone the source on your workstation. Run the checked-in bootstrap and complete the service’s Codex sign-in." },
    { title: "Open your private workspace", body: "Connect through an SSH tunnel, then open BotSquad in your browser." },
    { title: "Give the team some work", body: "Talk to a worker, explicitly assign a task or start a working group. Inspect the result and decide what comes next." },
  ] satisfies ProductStep[],
  underTheHood: {
    headline: "Under the hood",
    body: "BotSquad runs as an always-on service on an Ubuntu machine you control. The browser workspace stays private and currently uses an SSH tunnel. There is no hosted SaaS login or native iOS app.",
    stack: ["TypeScript", "Node.js", "SQLite", "Codex", "Git", "Linux", "HTTP / SSE"],
    privacy: "Coordination state lives on your host. Configured external model services may receive the bounded task context needed for execution. Self-hosted does not mean entirely offline inference.",
  },
  roadmap: {
    headline: "Where we’re going",
    today: { title: "Today", body: "Persistent workers, conversations, working groups, granted research, bounded engineering and browser tools, review and scheduled follow-ups. Experimental, with supervised validation and clear limits." },
    focus: { title: "Current focus", label: "Personal Operator / Daily Driver", body: "Right now we’re focusing less on adding features and more on making one BotSquad dependable, understandable and pleasant enough to use every day. Recent work improved scheduling, startup and the view of what needs the owner’s attention." },
    later: { title: "Later, if useful", body: "Easier private remote access, multiple isolated companies, company-to-company collaboration, federation between separate HQs and more tool integrations remain possible directions. Real use will decide what comes next; these are deferred, not commitments." },
  },
  control: {
    headline: "You’re still in charge.",
    body: "AI workers can make mistakes. BotSquad separates reasoning from authority. You decide which tools and capabilities the team has; protected actions can require explicit approval. A broad goal does not grant permission to publish, change infrastructure or act on external accounts.",
  },
} as const;

const labsProjects: readonly LabsProject[] = [
  {
    name: botsquad.name,
    description: "An open-source experiment in giving AI workers a place to work together.",
    status: botsquad.status,
    detail: { label: "Explore BotSquad", href: botsquad.path },
    source: botsquad.source,
    license: { label: "MIT licensed", href: botsquad.licenseUrl },
  },
];

export const labs = {
  ...divisions.labs,
  metadata: {
    title: "Asymmetri Labs | A Playground for Ideas",
    description:
      "Asymmetri Labs is our playground for open-source experiments. Explore BotSquad and whatever we're curious enough to build next.",
  },
  headline: "A playground for ideas.",
  introduction:
    "This is where we experiment, prototype, and build things we're curious about.",
  openSource: "Everything we build in Labs is open source.",
  projectsHeading: "Currently playing with",
  projects: labsProjects,
  closing: "More experiments will show up here when they're worth sharing.",
} as const;

export const about = {
  metadata: {
    title: "About Asymmetri | Where the Work Began",
    description:
      "From reviewing pitching video to building tools for small teams. Read how Asymmetri began and why we’re building Motion and BotSquad.",
  },
  eyebrow: "Why Asymmetri",
  headline: "It started with time spent watching pitches.",
  introduction:
    "As a baseball coach and division coordinator, I recorded deliveries on my phone and went through them frame by frame. We would try a small adjustment, record again and compare. It helped us see things we could talk about at practice.",
  meaning:
    "Getting useful information out of those recordings took time. That led to Motion, and to the question behind Asymmetri: what could someone do with the tools they already have, if those tools were a little more useful?",
  principles: [
    {
      title: "Begin with a real task",
      body: "A pitch to review. A piece of software to build. Start there, and make the tool useful for the person doing it.",
    },
    {
      title: "Show how a result was reached",
      body: "Keep the source close to the result, whether that’s a video frame or an AI worker’s notes. Make it possible to check.",
    },
    {
      title: "Leave room for judgment",
      body: "A coach knows things a camera cannot. A person reviewing AI work can question its assumptions. The tool should help them make that call.",
    },
  ] satisfies ProductStep[],
  origin:
    "Asymmetri is named for the idea that a small team can find an advantage without simply getting bigger. We’re pursuing that through two areas: Asymmetri Sports, home to Motion, and Asymmetri Labs, where experimental projects such as BotSquad live. They share a philosophy of useful tools and human judgment, not a claim to one technical platform.",
} as const;

export const motionGallery = {
  eyebrow: "Inside the design process",
  headline: "Earlier Explorer sketches",
  description:
    "These early Explorer design studies show the thinking behind asking a question of saved pitching history, then returning to it. They are concept illustrations with synthetic content, not current app screenshots or scientific validation. For the current workflow, see the Motion tutorial.",
  images: [
    {
      src: "/images/motion/explorer-home-concept.webp",
      width: 523,
      height: 1106,
      alt: "Early Explorer design concept with options to explore observations, compare pitches and compare periods; synthetic content.",
      caption: "Explorer entry concept · September 2026",
    },
    {
      src: "/images/motion/explorer-saved-views-concept.webp",
      width: 523,
      height: 1106,
      alt: "Early Saved Views design concept showing two illustrative saved questions; not a current app capture.",
      caption: "Saved questions concept · September 2026",
    },
  ] satisfies (SiteImage & { caption: string })[],
} as const;

export const mediaDisclosure = {
  notice:
    "Loading this video connects to YouTube. Google's privacy policy applies.",
  privacy: {
    label: "Google privacy policy",
    href: "https://policies.google.com/privacy",
  },
  website: {
    label: "About website videos and privacy",
    href: "/privacy#website-media",
  },
};

export const introductions = {
  botsquad: {
    product: "BotSquad",
    videoId: "E5r_lOecC-M",
    source: "https://youtu.be/E5r_lOecC-M",
    headline: "A walkthrough of BotSquad",
    posterLine: "Give your AI workers a place to work together.",
    tone: "botsquad",
  },
  motion: {
    product: "Asymmetri Motion",
    videoId: "kaSatKC8HBg",
    source: "https://youtu.be/kaSatKC8HBg",
    headline: "A quick look at Motion",
    posterLine: "See your pitch more clearly.",
    description:
      "This short introduction gives a feel for Motion. It’s preparing for release; the workflow and measurement limits are explained below.",
    tone: "motion",
  },
} as const;

export type Introduction = (typeof introductions)[keyof typeof introductions];
