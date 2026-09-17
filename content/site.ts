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
      "Asymmetri Labs builds baseball technology for clearer pitching development. Meet Asymmetri Motion, our iPhone pitching video and projected 2D analysis app.",
    socialHeadline: "Better evidence for better pitching.",
    socialSupport:
      "Introducing Asymmetri Motion. Pitching evidence that supports coaching.",
  },
  navigation: [
    { label: "Story", href: "/#story" },
    { label: "Approach", href: "/#approach" },
    { label: "Product", href: "/#product" },
    { label: "Get in touch", href: "/#contact" },
  ] satisfies NavItem[],
  footerNavigation: [
    { label: "Privacy", href: "/privacy" },
    { label: "Support", href: "/support" },
  ] satisfies NavItem[],
  hero: {
    eyebrow: "Baseball technology",
    headline: "Better evidence for better pitching.",
    support:
      "Asymmetri Labs builds baseball technology that helps pitchers, coaches and parents see pitching development more clearly. Asymmetri Motion for iPhone is preparing for release.",
  },
  story: {
    eyebrow: "Where it began",
    headline: "It started with a phone camera.",
    paragraphs: [
      "As a baseball coach and division coordinator, I wanted a clearer way to understand how pitchers were moving. I began recording pitching deliveries in slow motion on a smartphone, comparing pitches frame by frame, and studying differences in movement and timing.",
      "Working with players, we identified possible areas for improvement, made small adjustments, recorded again, and compared new deliveries with earlier ones. Later, I experimented with affordable wearable sensors to capture evidence that video alone could not show as clearly.",
      "The goal was not to automate coaching. It was to make useful evidence easier to see. Coaches could then apply their judgment, players could better understand what they were working on, and changes could be tracked over time.",
      "The evidence was valuable. Extracting it was slow, manual, technically demanding, and dependent on knowing what to look for. Asymmetri Labs grew from a question: could everyday technology make pitching analysis clearer and easier to use while keeping coaches at the centre of development? That question became Asymmetri Motion.",
    ],
  },
  approach: {
    eyebrow: "From video to a clearer conversation",
    headline: "Capture. Understand. Improve.",
    introduction:
      "Motion brings this approach into one iPhone workflow, from recording a pitch to revisiting the evidence with a coach.",
    steps: [
      {
        title: "Capture",
        body: "Record high-frame-rate video on a supported iPhone or import from Photos. Back and Side framing guides and optional Recording Setups help prepare the next recording.",
      },
      {
        title: "Understand",
        body: "Confirm the exact pitching moments. On-device pose analysis connects available projected 2D measurements to annotated evidence, with camera view and throwing arm kept in context.",
      },
      {
        title: "Improve",
        body: "Revisit pitches, compare observations and notice patterns worth discussing. Coaches interpret the evidence and guide training; parents gain context to support the process.",
      },
    ],
    principle:
      "A recorded difference starts a conversation. Coaches bring the judgment and context.",
  },
  closing: {
    eyebrow: "Built around people",
    headline: "Great coaching stays human. Better evidence makes it stronger.",
    body: "We are preparing Asymmetri Motion for release and continuing to learn from the work of pitching development. If this approach speaks to your experience, we would like to hear from you.",
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

export const motion = {
  name: "Asymmetri Motion",
  path: "/motion",
  headline: "See your pitch more clearly.",
  descriptor: "Pitching video and projected 2D analysis for iPhone.",
  platform: "iPhone · iOS 17 or later",
  device: "iPhone",
  operatingSystem: "iOS 17 or later",
  releaseStatus: "Preparing for release",
  releaseStatement: "Asymmetri Motion for iPhone is preparing for release.",
  metadata: {
    title: "Asymmetri Motion | Pitching Video & 2D Analysis",
    description:
      "Record or import pitching video, confirm key frames, inspect projected 2D measurements and annotated evidence, and revisit your history. For iPhone, iOS 17 or later.",
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
    eyebrow: "An Asymmetri Labs product",
    support:
      "Pitching video, human-confirmed frame marking, projected 2D measurements, annotated evidence and pitching history. One iPhone workflow, built around evidence you can inspect.",
    link: { label: "How Motion works", href: "#how-it-works" },
  },
  gap: {
    eyebrow: "Everyday video, lasting evidence",
    headline: "Keep more than the clip.",
    paragraphs: [
      "Slow-motion video is easy to record. Turning it into something you can return to is harder. A pitch gets watched, scrubbed and discussed, then disappears into a camera roll.",
      "Laboratory motion capture can measure much more, but it is rarely part of everyday training. Motion makes phone video more structured, inspectable and useful over time, without treating it as a motion-capture laboratory.",
    ],
  },
  workflow: {
    eyebrow: "How it works",
    headline: "A pitch worth returning to.",
    steps: [
      {
        title: "Record or import",
        body: "Choose Record Pitch or Import Video from Photos. Back and Side View framing guides help you keep the pitcher in view. Optional Recording Setups reuse your view and guide choices.",
        note: "Direct recording uses supported 240 or 120 fps camera modes. Availability depends on the iPhone. A Recording Setup is guidance, not camera calibration.",
      },
      {
        title: "Mark the moments",
        body: "Choose the Camera View and Throwing Arm. Scrub and fine-adjust to the exact frame for Front Foot Contact and Ball Release. Side View also uses a Setup Reference. You choose and confirm each frame.",
      },
      {
        title: "Analyze the pitch",
        body: "Analyze Pitch calculates the available projected 2D measurements using on-device pose analysis. Results depend on the view, your inputs and visible landmarks. If several people appear, Pitcher Selection lets you identify the pitcher to analyze.",
      },
      {
        title: "Inspect the evidence",
        body: "Open the saved annotated images to inspect the selected frames, estimated landmarks and reference lines behind a result. Save an evidence image to Photos or share it through the iPhone share sheet.",
      },
      {
        title: "Revisit and compare",
        body: "Return to My Pitches for saved videos, marks and results. Explore your pitching history, compare exact marked frames or supported measurements, and save a view to revisit later.",
      },
    ] satisfies ProductStep[],
  },
  evidence: {
    eyebrow: "Evidence first",
    headline: "From the number back to the pitch.",
    support:
      "The goal is not just more numbers. It is keeping the result connected to the observation that produced it.",
    chain: [
      { title: "Source video", body: "The pitch you recorded or imported." },
      { title: "Exact selected frame", body: "A specific image you can return to." },
      { title: "Human-confirmed moment", body: "The pitching moment you marked." },
      { title: "Projected 2D measurement", body: "Geometry from the video image." },
      { title: "Annotated evidence", body: "The landmarks and lines behind the result." },
      { title: "Pitch history", body: "Saved observations to revisit and compare." },
    ] satisfies ProductStep[],
    closing:
      "You confirm the key frames. Motion connects measurements to those observations and keeps the annotated evidence available for later review.",
  },
  history: {
    eyebrow: "Built for the long view",
    headline: "See what changed. Inspect the pitches behind it.",
    support:
      "One pitch is a starting point. My Pitches and Explore let you return to the work over time without losing the detail behind a comparison.",
    items: [
      { title: "Return to the moment", body: "Review the exact frames you marked, alongside saved results and annotated evidence." },
      { title: "Put two pitches in view", body: "Use A/B comparison for marked frames or supported measurements. Inspect both pitches behind a difference." },
      { title: "Follow your history", body: "Browse supported measurement history and save an investigation as a Saved View." },
    ] satisfies ProductStep[],
    note:
      "Comparisons are descriptive. A difference does not establish improvement, and a trend does not prove a training change worked. Camera setup and marking choices still matter.",
  },
  limits: {
    eyebrow: "Designed to be honest about what it sees",
    headline: "Clarity includes the limits.",
    items: [
      { title: "The image is the reference", body: "Measurements describe projected 2D geometry in the video image. Camera position and perspective affect what you see. Motion does not produce anatomical 3D biomechanics or laboratory-calibrated measurements." },
      { title: "An estimate stays an estimate", body: "Pose landmarks are estimates, and you confirm the pitching moments. Missing landmarks or unresolved ambiguity can leave a measurement unavailable. Motion does not fill the gap with an invented result." },
      { title: "Interpretation stays human", body: "Motion does not score mechanics, predict injury or provide medical advice. It does not automatically coach an athlete or recommend a change to their delivery." },
    ] satisfies ProductStep[],
  },
  privacy: {
    eyebrow: "Local-first",
    headline: "Your pitching record, on your iPhone.",
    paragraphs: [
      "No account is required. Pitch videos, optional Athlete Profile details and analysis records are stored locally. Apple Vision performs pose analysis on the device.",
      "There is no app-owned advertising, tracking or analytics SDK, and no Asymmetri-operated upload or cloud-sync system for your local pitch records.",
      "Photos copies, iCloud, device backups and sharing follow the services and settings you use. You choose when to save or share annotated evidence; those separate copies have their own handling.",
    ],
    link: { label: "Read the Privacy Policy", href: "/privacy" },
  },
  coaching: {
    eyebrow: "Built for coaching conversations",
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
    effectiveDate: { label: "September 16, 2026", value: "2026-09-16" },
    introduction: [
      "Asymmetri Labs operates Asymmetri Motion, a pitching video and motion-analysis app for iPhone. This policy distinguishes information in the app from website visits, support email, and Apple or other services you choose to use.",
      "Asymmetri Labs does not sell personal information.",
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
        ],
        closing: [
          "Apple Vision processes analysis on your device. No account is required. The app has no Asymmetri-operated server-upload or cloud-sync feature for these records and does not send your videos, Athlete Profile or analysis records to Asymmetri Labs for remote analysis.",
          "The app has no app-owned analytics SDK, advertising or tracking system, or crash-reporting SDK. It does not sell your locally stored app data. Local diagnostic messages may still be produced; Apple may handle system diagnostics under its own services and your settings.",
        ],
      },
      {
        id: "camera-photos-sharing",
        heading: "Camera, Photos and sharing",
        paragraphs: [
          "Camera access enables rear-camera pitching video. Direct recording does not use the microphone; imported originals can contain audio.",
          "Photos access lets the app obtain your selected original video and copy it into app storage. After saving a recording locally, the app attempts to add a separate copy to Photos, subject to permission. You can also save annotated evidence to Photos. A failed Photos copy does not remove a locally saved pitch.",
          "Review Camera and Photos permissions in iOS Settings. Denying access can prevent the corresponding recording, import or Photos-save operation.",
          "Sharing sends an annotated image and its visible information to the recipient or service you choose through the system share sheet. Check the image before sharing; the recipient or service controls its copy.",
        ],
      },
      {
        id: "apple-services-backups",
        heading: "Apple services and device backups",
        paragraphs: [
          "Photos may download selected originals from iCloud, Photos copies may sync through iCloud Photos, and app data may be included in device backups. These behaviors depend on Apple services and your device/account settings. The app does not exclude its data from ordinary device backups.",
          "Apple, backup providers and services you choose for sharing handle their copies under their own privacy practices. Asymmetri Motion does not control those copies or guarantee deletion when you remove something in the app.",
        ],
      },
      {
        id: "retention-deletion",
        heading: "Retention and deletion",
        paragraphs: [
          "App records remain locally until you delete the relevant records or remove the app's local data. Deleting a pitch removes it from My Pitches and deletes its app-owned video, marks, analysis history and annotated evidence. If file cleanup cannot finish, the app explains that files remain and offers Try Cleanup Again.",
          "Deleting a pitch does not delete your separate Athlete Profile or independent Photos, backup or shared copies. Profile corrections can retain earlier entries.",
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
          "The website provides public information and email links. It does not set cookies or use analytics, advertising, marketing trackers, tracking pixels, or browser storage for tracking or profiling. It has no contact or support form, visitor accounts, or website database. It does not load third-party fonts, scripts or embeds.",
          "The website is hosted on a DigitalOcean server. Website hosting and server infrastructure may process standard technical request information, such as IP address, browser/request information, requested URLs and request times, as needed to deliver, operate and protect the website. This infrastructure processing is separate from the app's on-device records.",
        ],
      },
      {
        id: "support-email",
        heading: "Support email",
        paragraphs: [
          "Support uses email. If you email us, your email address, message and any attachments you choose to send are transmitted through email services and received for the support interaction. The app's on-device processing does not make that correspondence local to your phone.",
          "Start with a written description and remove unnecessary personal or private information. Screenshots or clips are optional. Do not send private athlete footage unless intentionally needed to investigate the issue and you are authorized and comfortable sharing it. Obtain parent or guardian authorization for identifiable footage involving a minor.",
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
        ],
      },
    ],
  },
  support: {
    title: "Asymmetri Motion Support",
    description:
      "Help with Asymmetri Motion for iPhone: getting started, Camera and Photos permissions, recording, import, results, and local data.",
    introduction: [
      "Asymmetri Motion for iPhone helps you record or import pitching videos, mark key moments, inspect projected 2D measurements and revisit saved results and evidence.",
      "Results describe measurements projected from the video image. They are not anatomical 3D measurements, medical advice, injury diagnosis or automatic coaching.",
      "For help, email us with the details below. Response times may vary.",
    ],
    contactLabel: "Email support",
    related: { label: "Asymmetri Motion Privacy Policy", href: "/privacy" },
    sections: [
      {
        id: "getting-started",
        heading: "Getting started",
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
          "V1 supports iPhone with iOS 17 or later. Direct recording requires a supported rear wide-angle camera mode at 240 or 120 frames per second. The app selects from supported formats; not every iPhone supports every mode. If no suitable mode is available, use Photos import with a compatible video.",
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
          "Pitches, Athlete Profile information, marks and analysis history are stored locally. Deleting the app and its data can remove them; reinstalling alone does not guarantee recovery. A Photos video or exported evidence image does not preserve the complete app history. Contact support before deleting or reinstalling as a troubleshooting step.",
          "Deleting a pitch does not delete independent Photos, backup or shared copies. For privacy questions or requests about information sent to support, use the privacy contact on our Privacy Policy page.",
        ],
        link: { label: "Read the Privacy Policy", href: "/privacy" },
      },
    ],
  },
} satisfies Record<"privacy" | "support", UtilityPageContent>;
