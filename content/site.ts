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
    { label: "Tutorial", href: "/tutorial" },
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
  cameraView: tutorialImage("camera-view.png", 370, 483, "Camera View step with Back View selected and the Next button.", "An existing Back View pitch. Confirm the camera position used for your own video."),
  throwingArm: tutorialImage("throwing-arm.png", 370, 421, "Throwing Arm step with Right selected, guidance for Unknown, and Back and Next buttons.", "Choose the pitcher's throwing arm, regardless of where the arm appears in the image."),
  marking: tutorialImage("mark-ffc.png", 370, 698, "Saved Front Foot Contact at exact frame 831 of 1,296, with playback, fine adjustment and Move Front Foot Contact controls.", "An existing FFC mark. The exact selected frame and the saved frame are shown separately. This screenshot does not prescribe an event frame for another video."),
  analyze: tutorialImage("analyze.png", 370, 418, "Pitch Mechanics summary showing three of three results up to date and the Analyze Pitch button.", "An existing pitch with current results. Viewing this screen does not run a new analysis."),
  result: tutorialImage("results-back.png", 346, 387, "A saved 2D Trunk-Segment Orientation result of 4 degrees toward image left, with a Details and Annotated Image link.", "One real saved Back View result at FFC. The displayed value describes this image; it is not a target or grade."),
  evidence: tutorialImage("evidence.png", 315, 723, "The saved pitching frame annotated with trunk landmarks and a vertical reference, followed by Save to Photos and Share.", "The annotated evidence behind that result. The original image proportions, landmarks and saved value are unchanged."),
  explorer: tutorialImage("explorer-home.png", 370, 650, "Your pitching history with Review marked frames and Measurement history entry points.", "Start with the marked video frames or explore available measurements."),
  marked: tutorialImage("marked-history.png", 370, 690, "Marked frames for Front Foot Contact, List and Frames options, saved pitch thumbnail and Choose A and Choose B buttons.", "Review the exact marks you saved. The number of marked pitches depends on the selected event and filters."),
  chooseB: tutorialImage("choose-b.png", 370, 580, "Choose pitch B sheet with one retained pitch already selected as A and another eligible FFC mark.", "Select a different pitch for B. Both sides compare the same marked event."),
  comparison: tutorialImage("comparison.png", 370, 661, "Two retained Front Foot Contact frames side by side, with Open A, Open B and Auto layout controls.", "A real pair with different camera views. The layout preserves image proportions; placing frames together does not make their perspectives equivalent."),
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
    title: "Asymmetri Motion Tutorial | Asymmetri Labs",
    description: "Learn how to record or import a pitch, mark pitching moments, inspect projected 2D results and evidence, and explore your saved pitching history in Asymmetri Motion.",
  },
  introduction: "From your first video to a useful conversation with a coach. Follow the steps in order, or jump straight to the part you need.",
  disclosure: "For the normal V1 iPhone workflow. App screenshots show real retained pitching media used with the owner's permission. Physical setup images are instructional illustrations. Screen details may vary by version.",
  link: { label: "Follow the Motion tutorial", href: "/tutorial" },
  modules: [
    {
      id: "start", label: "Start", title: "One pitch. Evidence you can revisit.",
      intro: "You choose the video, confirm the moments and decide what to examine. Motion keeps the saved pitch and its evidence together.",
      steps: [
        { id: "your-first-pitch", title: "The path through a pitch", paragraphs: ["Start in My Pitches. Choose Record Pitch for a fresh recording, or Import Video for a video already in Photos. The recording button says Record New Pitch when you already have a pitch."], items: ["Record or import a video.", "Confirm Camera View and Throwing Arm.", "Mark the required moments, one exact frame at a time.", "Choose Analyze Pitch.", "Open a result and inspect its evidence.", "Reopen the saved pitch or explore your history."], media: "acquisition" },
        { id: "before-you-start", title: "What you need", paragraphs: ["Use an iPhone running iOS 17 or later. Direct recording needs a supported high-frame-rate rear camera mode. Import is also a first-class path into the same review workflow.", "Keep the full pitcher visible, with enough light and space for the delivery. A steady camera and clear landmarks make review more useful. Athlete Profile is optional; you can start with a video."], note: "Results are projected 2D measurements from video images. They are not 3D anatomy, injury predictions, ball velocity, mechanics grades or automatic coaching. A coach supplies the context." },
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
        { id: "run-analysis", title: "Choose Analyze Pitch", paragraphs: ["At Results, check the Pitch Mechanics summary and choose Analyze Pitch. Let processing finish, then read the state of each result.", "Motion performs pose analysis on device. Eligible measurements can finish independently: one unavailable result does not mean every other result failed. Opening Results alone does not run a new analysis."], media: "analyze" },
        { id: "back-results", title: "Back View: three supported results", view: "back", paragraphs: ["These are measurements projected in the video image. Each belongs to a particular marked event."], items: ["2D Trunk-Segment Orientation at FFC: the trunk segment relative to image vertical, including the displayed direction.", "2D Shoulder-Upper Arm Angle at Ball Release: the included angle formed by the shoulder line and throwing upper arm in the image.", "2D Throwing-Side Shoulder-Wrist Orientation at Ball Release: the shoulder-to-wrist direction relative to image vertical."], note: "Image vertical is not ground or gravity vertical. Camera roll and perspective affect these values. They do not establish anatomical joint angles or arm slot.", media: "result" },
        { id: "side-results", title: "Side View: three supported results", view: "side", paragraphs: ["Side View uses the marked starting stance and events where each measurement requires them."], items: ["2D FFC Ankle-Span Ratio: projected ankle separation at FFC relative to the projected nose-to-ankle reference from Setup, expressed as a percentage.", "2D Lead-Knee Bend Angle at FFC: projected bend from the estimated lead hip, knee and ankle.", "2D Lead-Knee Bend Angle at Ball Release: the same kind of projected bend at the separate release event."], note: "The ratio is not physical stride length or percentage of actual body height. These Side-view descriptors remain experimental; availability in the app does not establish scientific accuracy or an ideal range. Higher or lower is not a score." },
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
        { id: "keep-history", title: "Understand what is local", paragraphs: ["Two imports kept as separate observations have separate review histories. Changing one does not turn it into a revision of the other.", "Deleting a pitch removes that app observation and its local video, marks, analysis and evidence. It does not delete an independent Photos copy or the Athlete Profile. Use deletion only when you intend to remove that observation."], note: "Deleting or reinstalling the app can remove local history. A Photos video or exported evidence image does not restore the complete app record. Contact support before deleting or reinstalling as troubleshooting." },
      ],
    },
    {
      id: "explore-history", label: "Explore History", title: "Ask a question of your saved pitches.",
      intro: "Choose Explore your pitches from My Pitches. Review marked frames for a visual question, or Measurement history for a numerical one.",
      steps: [
        { id: "history-entry", title: "Choose frames or measurements", paragraphs: ["Review marked frames lets you revisit the exact moments you confirmed, including pitches without a usable measurement. Measurement history uses supported saved results and their evidence."], media: "explorer" },
        { id: "marked-frames", title: "Review the same event across pitches", paragraphs: ["In Review marked frames, choose Front Foot Contact, Ball Release or Setup Reference. Switch between List and Frames. The count tells you how many included pitches have a saved mark for that event.", "Open a row or Show frame to inspect the exact saved image. Change the date and context filters when you want a narrower set."], media: "marked" },
        { id: "choose-pair", title: "Choose A, then choose B", paragraphs: ["Use Choose A and Choose B to select two different pitches with the matching marked event. Replace either side to try another pair. The choices are temporary unless you save the view."], media: "chooseB" },
        { id: "compare-frames", title: "Inspect the pair and open the originals", paragraphs: ["Auto, Side by side and Stacked change the layout while preserving each image's proportions. Tap a frame to enlarge it and use Done to return.", "Open A or Open B returns to the original saved pitch. Use Back to return to the comparison. Select another matching event when both pitches have the needed mark."], note: "Compare framing before comparing movement. Different camera positions, views or marking decisions can create visual differences. A side-by-side layout does not make the recordings equivalent.", media: "comparison" },
        { id: "measurement-history", title: "Choose one measurement", paragraphs: ["Open Measurement history and choose a supported measure. The same six normal results described in Analyze are available where saved records exist. An empty history can simply mean that no included pitch has an eligible result for that measure."], media: "chooser" },
        { id: "chart", title: "Chart: locate an observation", paragraphs: ["Use Chart to see the included recorded values across pitch dates. Touch a plotted item, or use Previous / Next, to choose an observation.", "Read the included count and context before interpreting the pattern. Large histories may be summarized into date bins; inspect the contributors and ranges instead of treating a summary as a new pitch."], media: "chart" },
        { id: "table-evidence", title: "Table and Evidence: inspect the contributors", paragraphs: ["Use Table for readable values, pitch dates and individual contributors. Open an observation to understand which pitch supplied it.", "Use Evidence to inspect the saved annotated image associated with the selected result. Return to the original pitch when you need the video or marked frame. If evidence or a source pitch is unavailable, follow the displayed state rather than assuming the missing item was included."], media: "table" },
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
