import { GuideSection, GuideFigure, GuideCode, GuideTable } from '@/components/investment/guide-layout';
import { hqGuideFigures as figures, hqUxGuideFigures as currentFigures } from '@/content/site';

export const guideContents = [
  {
    "id": "overview",
    "title": "Start here"
  },
  {
    "id": "hq-navigation",
    "title": "Open HQ and learn its navigation"
  },
  { "id": "first-task", "title": "Your first task with BotSquad" },
  { "id": "historical-checkpoint", "title": "Historical Trade investigation: October 15" },
  {
    "id": "question",
    "title": "Start with the right question"
  },
  {
    "id": "identities",
    "title": "Identify the portfolio, scope and loop before comparing numbers"
  },
  {
    "id": "portfolio",
    "title": "Read the portfolio before reading the discussion"
  },
  {
    "id": "loop-checks",
    "title": "Interpret a loop card as several independent checks"
  },
  {
    "id": "schedule",
    "title": "Trace the scheduled occurrence and its clocks"
  },
  {
    "id": "executions",
    "title": "Follow an execution and its usage evidence"
  },
  {
    "id": "discussions",
    "title": "Examine what the team actually saw and said"
  },
  {
    "id": "record-chain",
    "title": "Prove a decision by following the record chain"
  },
  {
    "id": "review-failure",
    "title": "Work through the October 15 review failure"
  },
  {
    "id": "publication",
    "title": "Inspect publication separately from execution"
  },
  {
    "id": "troubleshooting",
    "title": "Use a symptom-to-evidence troubleshooting path"
  },
  {
    "id": "controls",
    "title": "Know which controls change state"
  },
  {
    "id": "beyond-ui",
    "title": "Escalate beyond the UI when the evidence stops"
  },
  {
    "id": "tail-logs",
    "title": "Tail logs and follow Trade activity"
  },
  {
    "id": "incident-record",
    "title": "Keep a compact incident record and a daily routine"
  },
  {
    "id": "version",
    "title": "Version, evidence and known interface limits"
  }
] as const;

export function HqGuideArticle() {
  return <>
<GuideSection id="overview" title="Start here">
<p>BotSquad HQ is your private workspace for assigning work and checking what the team recorded. An AI employee is a persistent, named team member with a responsibility. Atlas coordinates ordinary tasks; other employees may receive related assignments.</p>
<p>Start with the current navigation and the <a href="#first-task">first-task exercise</a>. The later investigation sections explain Trade’s portfolio, schedules, work sessions, usage and publication. The public Trade site shows an approved selection of records; private HQ is the place to inspect their operational context.</p>
<p className="guide-callout"><strong>Current instructions: HQ UX-01.</strong> The five current interface captures use a disposable backend, isolated authored sample records and fake-runtime responses. They demonstrate controls and recorded states, not genuine employee work or live investment outcomes. The retained October 15 incident and seven older captures are explicitly historical.</p>
<p>This is a companion to <a href="/botsquad/trade/guide">How BotSquad Trade works</a>. Use the operator’s existing private connection instructions to open HQ. This public guide does not provide a private access endpoint.</p>
</GuideSection>
<GuideSection id="hq-navigation" title="Open HQ and learn its navigation">
<p>Use the private access method configured by the operator. In this installation, HQ is reached through an authenticated SSH tunnel. Check that connection and the HQ service if the browser cannot connect. A connection failure alone does not establish an investment pause.</p>
<GuideFigure figure={currentFigures["home-1440"]} />
<GuideTable caption="Current HQ navigation" wide={false} headings={["Destination", "Related views and purpose"]} rows={[
[<>Home</>,<>Current work, owner attention, completed tasks and the AI team</>],
[<>Tasks</>,<>All tasks · Needs your attention · Browser work</>],
[<>Team</>,<>Employees · Conversations · Discussions</>],
[<>Activity</>,<>Recent activity · Team updates · Work sessions · Advanced audit</>],
[<>Projects</>,<>Software projects · Ongoing goals · Investment</>],
[<>Settings</>,<>Overview · Approvals · Infrastructure · Devices</>]
]} />
<p>On a phone, the six main destinations appear above the page. <strong>Needs you</strong> in the header opens owner attention. <strong>New task</strong> opens the ordinary assignment form. The connection indicator and loading banner distinguish current records from a disconnected or stale view; <strong>Retry loading</strong> refreshes that view.</p>
<GuideTable caption="Finding familiar tools after UX-01" wide={false} headings={["Former label", "Current location"]} rows={[
[<>Executive channel</>,<>Activity → Team updates retains shared messages and the original composer. Use New task for an ordinary assignment.</>],
[<>Attention</>,<>Tasks → Needs your attention, or Needs you in the header</>],
[<>Working Groups</>,<>Team → Discussions</>],
[<>Executions</>,<>Activity → Work sessions</>],
[<>Audit history</>,<>Activity → Advanced audit</>],
[<>Investment run / team / publication</>,<>Projects → Investment, then Portfolio &amp; work / Team permissions / Publication</>]
]} />
<p>The three existing private Investment routes remain <code>/investment-run</code>, <code>/investment-team</code> and <code>/investment-publication</code>. The Investment navigation also returns to Home and Projects. <strong>Other research and legacy setup tools</strong> is an advanced disclosure on the Investment page. Opening an inspection view does not grant permission to operate its controls.</p>
</GuideSection>
<GuideSection id="first-task" title="Your first task with BotSquad">
<h3>1. Describe a small result</h3>
<p>Choose <strong>New task</strong>. In <strong>What would you like done?</strong>, paste this supplied-text exercise:</p>
<GuideCode caption="A small first-task request" wrap text={'Read this text and summarize it in three plain-English bullet points: “BotSquad keeps tasks, messages and results. Atlas coordinates assignments. The owner reviews outcomes and controls permissions.” Use only the text in this request. Do not browse, change software or publish anything.'} />
<GuideFigure figure={currentFigures["new-task-1440"]} />
<p>Choose <strong>Start task</strong> once. This requests real AI work under the installation’s existing limits and account availability. No web research, software access or publication is needed for the exercise. A task’s text cannot grant extra authority. If the team is paused, a task can remain queued; review all waiting work before using <strong>Settings → Resume queued work</strong>, which affects the team.</p>
<h3>2. Follow the task and its employee</h3>
<p>Open <strong>Tasks → All tasks</strong>, find your description and choose <strong>Open task</strong>. Read <strong>What you asked for</strong>, the responsible employee, <strong>What happens next</strong> or <strong>What needs checking</strong>, <strong>Results and files</strong> and <strong>Recorded progress</strong>. <strong>Related assignments</strong> shows any parent or child work. Atlas may do the task or delegate; do not assume a particular sequence.</p>
<GuideTable caption="Task status and next action" wide={false} headings={["Status", "What to do"]} rows={[
[<>Waiting to start</>,<>Check the pause banner and existing eligibility; the task is queued.</>],
[<>In progress</>,<>Follow recorded activity. A work session is one employee attempt, rather than the entire task.</>],
[<>Waiting for related tasks</>,<>Read the related assignments; avoid submitting another copy.</>],
[<>Waiting for approval</>,<>Open Needs you and inspect the exact request and scope.</>],
[<>Could not finish / Waiting · review reason</>,<>Read the reason, previous attempts and any saved results before retrying.</>],
[<>Completed</>,<>Read and evaluate the recorded outcome and any saved file.</>]
]} />
<p>Choose the employee’s name, or <strong>Team → Employees → Open profile</strong>, to see responsibilities and recorded work. <strong>No session running</strong> does not promise eligibility for a new task. AI settings and <strong>Permissions &amp; research</strong> are separate controls; opening a profile does not change them.</p>
<GuideFigure figure={currentFigures["employee-390"]} />
<h3>3. Find and check the answer</h3>
<p>When the original task is <strong>Completed</strong>, open <strong>Results and files</strong> and read its <strong>Recorded outcome</strong>. If a file was saved, select its title. A separate file is optional; related assignments may hold their own results. Finish this exercise only after you can read three sensible points grounded in the supplied text.</p>
<GuideFigure figure={currentFigures["task-result-1440"]} />
<GuideFigure figure={currentFigures["saved-result-1440"]} />
<h3>4. Use the next view when you need it</h3>
<p><strong>Team → Conversations</strong> opens employee conversations. <strong>Send passive message</strong> saves context; <strong>Send &amp; request reply</strong> requests bounded AI work. <strong>Team → Discussions</strong> contains working groups. <strong>Activity → Recent activity</strong> shows milestones, <strong>Work sessions</strong> shows individual attempts and usage, and <strong>Advanced audit</strong> retains the loaded original events. Task <strong>Advanced details</strong> exposes original records for troubleshooting.</p>
<p>If creation confirmation is lost, use <strong>Check Tasks</strong> before trying again. If the form says <strong>Task created</strong> but loading failed, use <strong>Open Tasks</strong> or <strong>Retry loading</strong> to find the existing task. If work needs approval or failed, inspect the reason and prior results. <strong>Retry inspected task</strong> appears only where the existing policy permits it and requires acknowledging that review.</p>
<p>The maintained <a href="https://github.com/eugenelin89/bot_messenger/blob/main/docs/tutorials/first-assignment.md">Your First Task with BotSquad tutorial</a> has the same exercise and private connection instructions. The validation uses structured review and isolated browser tests; it does not claim testing with nontechnical participants or genuine provider work.</p>
</GuideSection>
<GuideSection id="historical-checkpoint" title="Historical Trade investigation: October 15">
<p className="guide-callout"><strong>Historical case, before UX-01.</strong> The following incident values and seven older screenshots were observed October 15, 2026, approximately 11:30–11:45 a.m. Vancouver / 18:30–18:45 UTC. They retain the original interface and are not a statement of current balances, usage, authority or operating state. Navigation instructions use the current locations above; older labels remain visible in the historical images and pinned source.</p>
<p>In that observation, research produced a HOLD proposal, the independent review failed, usage evidence was incomplete and the loop was held. The portfolio was all cash while publication could still deliver lifecycle heartbeats. The case explains how those separate records can coexist. No restart, approval, model call or recovery action was performed to capture the historical guide.</p>
<GuideFigure figure={figures["01-hq-navigation"]} />
</GuideSection>
<GuideSection id="question" title="Start with the right question">
<p>{"“Is it running?” is too broad for a system with several durable workflows. Break it into questions that have separate evidence:"}</p>
<GuideTable caption="Questions and their evidence" wide={true} headings={["Question", "First place to inspect", "Evidence you need"]} rows={[
[<>{"Can the browser reach HQ?"}</>,<>{"Connection indicator on the home page"}</>,<>{"A current connected view, then a successful refresh"}</>],
[<>{"Does anything require owner attention?"}</>,<>{"Tasks → Needs your attention (or Needs you in the header)"}</>,<>{"The specific item and its linked workflow"}</>],
[<>{"What does the portfolio own?"}</>,<>{"Projects → Investment → Portfolio & work"}</>,<>{"Cash, holdings, orders and the latest valuation timestamp"}</>],
[<>{"What stage should run next?"}</>,<>{"The matching loop card and its schedule disclosure"}</>,<>{"Occurrence identity, due time, expiry, state and reason"}</>],
[<>{"Did a worker actually execute?"}</>,<>{"Activity → Work sessions; the loop’s AI usage table"}</>,<>{"An attributable execution, timestamps and terminal outcome"}</>],
[<>{"What did the team use and conclude?"}</>,<>{"Team → Discussions"}</>,<>{"Shared evidence, contributions, synthesis and review records"}</>],
[<>{"Was a paper decision accepted?"}</>,<>{"Loop evidence / portfolio history"}</>,<>{"Matching proposal, independent review and submission"}</>],
[<>{"Did the website receive it?"}</>,<>{"Projects → Investment → Publication"}</>,<>{"A delivered batch receipt for the relevant records"}</>]
]} />
<p>{"A healthy HTTP service establishes reachability. It does not establish that the scheduler has eligible work, that a model finished, that a proposal passed review, or that the website received a new financial record. Investigate one assertion at a time."}</p>
<p>{"The server owns the scheduler and durable state. Your browser is a client. Closing a tab does not stop the daily loop, and reopening one does not replay a missed session. Idle employees do not continuously invoke a model. Reading existing screens does not ask Atlas or Maya to reason again. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/docs/architecture/SYSTEM_ARCHITECTURE.md">{"Architecture"}</a></p>
</GuideSection>
<GuideSection id="identities" title="Identify the portfolio, scope and loop before comparing numbers">
<p>{"Open "}<strong>{"Projects → Investment → Portfolio & work"}</strong>{". The top portfolio panel and the loop cards below it answer different questions. A persistent portfolio can be used by an original operating scope and a later recovery scope. Both can remain visible after one stops."}</p>
<p>{"At the historical checkpoint the page did not have a dedicated “select current run” control. Its "}<strong>{"Approved team"}</strong>{" dropdown belongs to schedule creation; changing that dropdown does not filter the historical cards. Match the records you are inspecting, rather than assuming the first card or a familiar session date must be the correct one."}</p>
<p>{"Expand "}<strong>{"Schedule, reservations, measured usage and receipts"}</strong>{" on the relevant card when you need exact identity. In your private incident notes, record:"}</p>
<GuideTable caption="Private identity fields" wide={false} headings={["Field", "Meaning"]} rows={[
[<><code>{"loop_id"}</code></>,<>{"The particular scheduled operating loop"}</>],
[<><code>{"scope_id"}</code></>,<>{"The permissions and working-group context used by that loop"}</>],
[<><code>{"owner.team.runId"}</code></>,<>{"The persistent portfolio to which the scope belongs"}</>],
[<><code>{"activity.finite.authorityId"}</code></>,<>{"The independent finite operating allowance"}</>],
[<><code>{"generation"}</code>{" and "}<code>{"plan_revision"}</code></>,<>{"The control generation and schedule revision used to reject stale work"}</>],
[<><code>{"state"}</code>{" and "}<code>{"reason"}</code></>,<>{"The loop's present state and its recorded explanation"}</>]
]} />
<p>{"Keep those identifiers private. They are useful join keys for an operator, not necessary public documentation. The public site's run identifier can be a different projection identifier; do not assume it is the private portfolio's database key."}</p>
<p>{"At the checkpoint there is a blocked successor and a stopped predecessor, both associated with October 14–15 and the same portfolio. Their existence does not mean that two independent portfolios were funded or that usage should be added twice. The predecessor is retained evidence of what happened before recovery. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/control/investment-loop/service.ts">{"Loop inspection and controls"}</a></p>
</GuideSection>
<GuideSection id="portfolio" title="Read the portfolio before reading the discussion">
<p>{"Start with economic state: lifecycle, cash, holdings, pending orders and the latest valuation. This establishes whether a failure changed the book or only interrupted a proposed decision."}</p>
<GuideFigure figure={figures["02-portfolio-metrics"]} />
<p>{"Read the timestamp and quality before interpreting the numbers. A complete valuation means complete under the recorded valuation rules for that snapshot. It does not promise that newer market observations have arrived. Likewise, zero realized P&L, zero drawdown and no holdings describe this portfolio history; they do not prove a successful autonomous trading day."}</p>
<p>{"For a flat portfolio, inspect whether the system recorded an accepted HOLD or whether work stopped before submission. Both can leave cash unchanged, but they are different experimental outcomes. Here there is a proposal but no committed review or submission. “The team successfully chose to hold” would overstate the evidence."}</p>
<p>{"The portfolio panel also shows trading metrics, holdings, sector exposure and valuation rows. Read return fractions and excess-return percentage points according to their labels; do not silently format both as the same unit. The benchmark has its own accounting path. A benchmark allocation does not mean the strategy portfolio bought a stock."}</p>
<p>{"The "}<strong>{"Original decisions, source evidence, cash flows and immutable ledger"}</strong>{" disclosure exposes reconstructed portfolio evidence. Treat it as an inspection view, not a promise that every raw database journal row or every historical source record is printed there. Some displayed collections are bounded. Use the retained database and journal for an exhaustive audit."}</p>
<p>{"A refresh limitation in the historical capture matters: the "}<strong>{"Refresh"}</strong>{" button at the top of the investment page reloads the loop cards. The portfolio panel is loaded independently. For a coherent fresh observation of both, reload the whole browser page and note the time. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/public/observed-investment.js">{"Portfolio interface"}</a></p>
</GuideSection>
<GuideSection id="loop-checks" title="Interpret a loop card as several independent checks">
<GuideFigure figure={figures["03-loop-and-authority"]} />
<p>{"The card combines scheduling, approval, provider-call reservations and usage health. Read the reason text and each layer separately:"}</p>
<GuideTable caption="Reading the observed loop card" wide={false} headings={["Display at the checkpoint", "Correct interpretation"]} rows={[
[<><strong>{"blocked"}</strong></>,<>{"This loop cannot continue ordinary scheduled work in its current state"}</>],
[<><strong>{"6/16 turns reserved"}</strong></>,<>{"Six turns belong to the successor loop; four original turns are outside this local count"}</>],
[<><strong>{"Independent authority: present"}</strong></>,<>{"A retained approval matches the inspected configuration; dispatch can still fail other checks"}</>],
[<><strong>{"10/16 permanent; remaining 1"}</strong></>,<>{"Ten calls are consumed across the retained original/recovery family; a stricter recovery ceiling applies"}</>],
[<><strong>{"rolling 24h: 3/8; remaining 5"}</strong></>,<>{"A separate recent-call limit; it does not refund permanent calls or repair telemetry"}</>],
[<><strong>{"active/unknown: 0/1"}</strong></>,<>{"No currently counted active or unresolved provider reservation; settled but incomplete usage can still block"}</>],
[<><strong>{"expiry"}</strong></>,<>{"The absolute end of this authority, independent of whether useful work was completed"}</>],
[<><strong>{"Reload-OFF attestation"}</strong></>,<>{"A recorded owner attestation about the funding configuration, not a generic acknowledgment button"}</>]
]} />
<p>{"The permanent denominator is particularly easy to misread. The original policy displays a maximum of 16, but this recovery permits at most seven additional calls after four original calls. The effective ceiling is "}<code>{"min(16, 4 + 7) = 11"}</code>{". With ten consumed calls, only one remains. Subtracting 10 from the displayed 16 gives the wrong answer."}</p>
<p>{"The historical block mentions incomplete finite-HQ telemetry and exact owner resume. That wording does not promise that clicking Resume will pass. Resume must still satisfy all underlying checks, including usage and eligible future work. A free slot is not sufficient authority to replay old work."}</p>
<p>{"Also distinguish the page's generic included-only subscription warning from the actual finite mode. The inspected scope uses "}<code>{"credit_approved_finite_hq"}</code>{"; the generic warning describes a different execution mode. Inspect the selected scope's policy rather than treating every banner as a new diagnosis of this loop. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/control/usage/finite-hq.ts">{"Finite authority checks"}</a></p>
</GuideSection>
<GuideSection id="schedule" title="Trace the scheduled occurrence and its clocks">
<p>{"Expand "}<strong>{"Schedule, reservations, measured usage and receipts"}</strong>{". The "}<code>{"occurrences"}</code>{" array is the most direct answer to “what was supposed to happen today?” An occurrence is one stage, for one session, in one plan. It is not a worker and not necessarily a model call."}</p>
<GuideTable caption="Occurrence fields and clocks" wide={false} headings={["Occurrence field", "What to check"]} rows={[
[<><code>{"occurrence_id"}</code>{", "}<code>{"session"}</code>{", "}<code>{"stage"}</code></>,<>{"Which exact scheduled event you are examining"}</>],
[<><code>{"due_at"}</code>{", "}<code>{"expires_at"}</code></>,<>{"The allowed time window in UTC"}</>],
[<><code>{"state"}</code>{", "}<code>{"reason"}</code></>,<>{"Pending, running, complete, blocked, missed or cancelled, and why"}</>],
[<><code>{"attempts"}</code>{", "}<code>{"retry_at"}</code></>,<>{"Recorded attempts and any bounded retry timing"}</>],
[<><code>{"result"}</code></>,<>{"Stage-specific result; some results are encoded as a JSON string"}</>],
[<><code>{"generation"}</code>{", "}<code>{"plan_revision"}</code></>,<>{"Whether this event belongs to the current control generation and plan"}</>]
]} />
<p>{"Walk through the session chronologically: research collection → research → cutoff → close collection → delayed paper accounting → marking → expiry. In the observed-paper schedule, the internal "}<code>{"open"}</code>{" stage is delayed accounting at 20:20 UTC, not execution at the market opening. Consult the saved schedule for exact dates and times; do not infer them from a weekday or a browser's local clock. At this October checkpoint, Vancouver is seven hours behind UTC, so 20:00 UTC is 1:00 p.m. local time."}</p>
<p>{"For a pending stage, compare its due time with the server's current time and then check all prerequisite stages. For a blocked stage, read its reason and follow the associated execution or collection evidence. For a missed stage, the window has passed; it is not a queue item waiting for a convenient retry. A cancelled stage is likewise not restored automatically by Resume."}</p>
<p>{"The phrase "}<strong>{"No future eligible research session"}</strong>{" in the card means the view found no later pending research timestamp. The opposite message would not prove that every dispatch condition passes. The application still checks authority, source readiness, concurrency, usage, worker eligibility and deadlines when dispatching."}</p>
<p>{"The schedule disclosure shows the inspected plan's occurrences. It is not an exhaustive list of superseded plan history. Preserve the plan revision in an incident report so two people do not accidentally compare different schedules."}</p>
<p>{"Three clocks often explain a surprising pause: the market session, the occurrence's dispatch window, and the authority's absolute expiry. Provider executions add start/finish times; publication adds delivery times. A new heartbeat cannot extend a research cutoff, and a restart cannot move an expired occurrence back into its original window. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/control/investment-loop/service.ts">{"Scheduler state transitions"}</a></p>
</GuideSection>
<GuideSection id="executions" title="Follow an execution and its usage evidence">
<p>{"The loop's "}<strong>{"AI usage"}</strong>{" section is a convenient aggregate. The "}<strong>{"Activity → Work sessions"}</strong>{" view lets you inspect runtime attempts across the company and use "}<strong>{"Usage & cost"}</strong>{" for an individual attempt. Match the working-group origin, worker and timestamp, then confirm the exact execution identifier privately."}</p>
<GuideFigure figure={figures["04-usage-and-invocations"]} />
<p>{"Do not merge these independent dimensions:"}</p>
<GuideTable caption="Independent execution and usage dimensions" wide={true} headings={["Dimension", "Example", "Meaning"]} rows={[
[<>{"Runtime status"}</>,<><code>{"completed"}</code>{", failed, interrupted, "}<code>{"awaiting_approval"}</code></>,<>{"How the execution ended or was classified"}</>],
[<>{"Usage settlement"}</>,<><code>{"settled"}</code></>,<>{"Whether the accounting path has a terminal settlement"}</>],
[<>{"Usage completeness"}</>,<>{"complete / incomplete"}</>,<>{"Whether the required terminal evidence and categories are present"}</>],
[<>{"Price availability"}</>,<>{"priced / unpriced"}</>,<>{"Whether an exact model/rate mapping can produce the stated estimate"}</>],
[<>{"Provider reservation"}</>,<>{"reserved, admitted, transmitted, settled or unknown"}</>,<>{"The independently retained call admission and outcome evidence"}</>]
]} />
<p>{"A final text response does not establish complete usage. A complete usage record does not establish a good proposal. An unpriced record does not mean zero cost. In this snapshot, all ten calls are unpriced, while two have incomplete usage; those are separate counts."}</p>
<p>{"Expand "}<strong>{"Execution details"}</strong>{" to see the execution, run/cycle references, provider request/thread/turn references, model, timestamps, token categories, pricing restrictions and explanatory unknowns. This smaller disclosure does not display every accounting field. For "}<code>{"settled"}</code>{", inspect "}<code>{"aiUsage.executions"}</code>{" in the larger schedule/receipts JSON."}</p>
<p>{"Cached input is a subset of input, and reasoning tokens may be included within output. Do not add those subsets a second time to construct a total. Estimates labeled API-equivalent are not actual subscription charges. HQ does not learn the owner's remaining subscription quota merely because it has a token count. Exact model pricing must not be substituted with a similarly named model's price."}</p>
<p>{"The "}<strong>{"Worker, cycle, day and activity breakdown"}</strong>{" helps locate the source of aggregate usage. The worker inspector's "}<strong>{"AI usage and cost"}</strong>{" is broader than one Trade loop. Likewise, both the predecessor and successor loop cards in the historical capture report ten invocations because their reports filter the same persistent portfolio. Do not add the two cards to claim twenty calls."}</p>
<p>{"Current worker profile settings are not historical execution settings. Inspect the execution's recorded model, reasoning level and runtime provenance when explaining what actually ran. Changes to a worker profile affect future work; they do not rewrite prior execution evidence. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/public/usage.js">{"Usage UI"}</a>{" · "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/control/usage/service.ts">{"Usage accounting"}</a></p>
</GuideSection>
<GuideSection id="discussions" title="Examine what the team actually saw and said">
<p>{"Return to "}<strong>{"Private HQ → Team → Discussions"}</strong>{". Choose the discussion matching the scope you recorded. The current and predecessor discussions can have the same topic. Confirm their identity and state rather than selecting by title alone."}</p>
<p>{"Read the charter, shared audience, facilitator, synthesizer, turn/round limits and deadline first. The historical company sidebar called Atlas “CEO” and Maya “Product Manager.” Their investment scope gives them specific Trade responsibilities. Those scoped permissions are more relevant to this decision than their company-wide job titles."}</p>
<p>{"Then examine the evidence in this order:"}</p>
<ol><li><strong>{"Shared evidence packet"}</strong>{": which selected records were made available to the discussion? "}<strong>{"Inspect shared source"}</strong>{" shows the retained material. Membership alone does not expose private employee histories."}</li><li><strong>{"Attributable discussion"}</strong>{": who contributed, in what order, and against which transcript/evidence revisions? References connect claims to prior contributions and shared material."}</li><li><strong>{"Questions and responses"}</strong>{": which explicit questions were answered, and which remain unresolved?"}</li><li><strong>{"Saved synthesis"}</strong>{": what conclusion was actually retained, and was it marked incomplete?"}</li><li>{"The relevant execution evidence: did the turn that was supposed to produce a result finish and persist the required typed record?"}</li></ol>
<p>{"The historical working-group counter of six used turns out of 24 is a discussion limit. It is not interchangeable with six loop turns out of 16 or the finite family's eleven-call effective ceiling. Multiple limits constrain the same workflow at different layers; the loosest one does not override the others."}</p>
<p>{"Private discussion text can help diagnose a failure, but it is not automatically approved for public publication. The public desk may show a selected derivative rather than the complete transcript. These screenshots therefore keep private contributions and expanded evidence out of view."}</p>
<p>{"Avoid using "}<strong>{"Resume"}</strong>{", "}<strong>{"Finish with current evidence"}</strong>{", "}<strong>{"Authorize another bounded round"}</strong>{" or "}<strong>{"Request reply"}</strong>{" as inspection tools. They can authorize additional work. Even saving an owner interjection changes the shared record and can affect later authorized turns. Read the existing evidence before asking a worker to explain it again. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/public/groups.js">{"Working-group interface"}</a></p>
</GuideSection>
<GuideSection id="record-chain" title="Prove a decision by following the record chain">
<p>{"The key diagnostic skill is joining records across layers. A prose statement such as “I recommend HOLD” is not equivalent to a submitted paper decision. A proposal is not an order, and an order is not a fill."}</p>
<GuideCode caption="The private record chain and public delivery path" text={"Persistent portfolio\n  └─ operating scope + finite authority\n       └─ loop plan / occurrence\n            └─ worker execution ── provider reservation + usage\n                 └─ proposal revision + proposal hash\n                      └─ independent review of that exact hash\n                           └─ accepted submission\n                                └─ order, when the command requires one\n                                     └─ fill / cash-flow / valuation evidence\n\nApproved public projection → outbox job → receiver receipt → public page"} />
<p>{"The schedule/receipts JSON provides several useful join points:"}</p>
<GuideTable caption="Join points in the saved records" wide={false} headings={["Collection", "Fields to compare privately"]} rows={[
[<><code>{"aiUsage.executions"}</code></>,<><code>{"execution_id"}</code>{", "}<code>{"cycle_id"}</code>{", "}<code>{"worker_id"}</code>{", "}<code>{"status"}</code>{", "}<code>{"settled"}</code>{", "}<code>{"completeness"}</code>{", "}<code>{"reasons"}</code></>],
[<><code>{"occurrences"}</code></>,<>{"Match an execution's "}<code>{"cycle_id"}</code>{" to "}<code>{"occurrence_id"}</code></>],
[<><code>{"activity.finite.reservations"}</code></>,<>{"Match "}<code>{"executionId"}</code>{"; inspect "}<code>{"occurrenceId"}</code>{", "}<code>{"state"}</code>{", "}<code>{"status"}</code>{", "}<code>{"complete"}</code>{", "}<code>{"reservedAt"}</code>{", "}<code>{"deadline"}</code></>],
[<><code>{"owner.proposals"}</code></>,<><code>{"proposal_id"}</code>{", "}<code>{"revision"}</code>{", "}<code>{"execution_id"}</code>{", "}<code>{"proposal_hash"}</code>{", command, narrative and provenance"}</>],
[<><code>{"owner.reviews"}</code></>,<><code>{"proposal_id"}</code>{", "}<code>{"execution_id"}</code>{", "}<code>{"proposal_hash"}</code>{", "}<code>{"disposition"}</code></>],
[<><code>{"owner.submissions"}</code></>,<><code>{"proposal_id"}</code>{", "}<code>{"review_id"}</code>{", "}<code>{"execution_id"}</code>{", "}<code>{"journal_version"}</code>{", "}<code>{"result"}</code></>],
[<><code>{"orders"}</code></>,<>{"Actual accepted orders and their current status"}</>]
]} />
<p>{"An illustrative trace might be: occurrence O has execution E1; E1 produced proposal P at hash H; a different eligible worker's execution E2 produced review R of H; submission S names P and R. These letters are explanatory placeholders, not live identifiers. If the proposal changes to a new hash, an old review is not evidence that the new revision passed."}</p>
<p>{"For HOLD, a valid accepted decision may create no order. For BUY or SELL, look for the accepted order and then the relevant simulated fill evidence. Reading only an order intention in the transcript skips the trusted admission step. A late or failed review cannot be inferred from a plausible synthesis."}</p>
<GuideFigure figure={figures["05-evidence-and-controls"]} />
<p>{"Here the evidence stops between proposal and review. That explains the unchanged portfolio without inventing a successful HOLD decision. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/control/investment-team/service.ts">{"Investment team admission"}</a></p>
</GuideSection>
<GuideSection id="review-failure" title="Work through the October 15 review failure">
<p>{"The historical example shows why a single status label is insufficient. In "}<strong>{"Activity → Work sessions"}</strong>{", Maya's review appears as "}<strong>{"awaiting approval"}</strong>{", with a runtime message about an unavailable approval. In the loop's usage table, the same review has incomplete usage. The company "}<strong>{"Settings → Approvals"}</strong>{" count is zero."}</p>
<GuideFigure figure={figures["07-review-row"]} />
<p>{"An investigation should proceed as follows:"}</p>
<ol><li>{"Match the review execution to the correct occurrence and proposal context."}</li><li>{"Read its runtime error and usage explanation. The displayed token numbers do not by themselves establish complete terminal accounting."}</li><li>{"Check the committed review and submission collections. Both are empty here."}</li><li>{"Check "}<strong>{"Settings → Approvals"}</strong>{" for an actual actionable record. Do not manufacture an approval from the status text."}</li><li>{"Consult the retained tool/runtime receipt and deployed source when the UI cannot explain the failure precisely."}</li></ol>
<p>{"The prior technical investigation found a review-clock defect: the tool facade sampled "}<code>{"reviewedAt"}</code>{", then the journal sampled a slightly later "}<code>{"recordedAt"}</code>{" within the same "}<code>{"paper_review"}</code>{" call. The reducer required exact equality and rejected the mismatch. Frozen test clocks had hidden it. PR #102 now samples one trusted commit timestamp after validation for both the review and journal entry, while retaining live authorization and cutoff checks. A separate adapter catch had mislabeled the bounded tool exception as awaiting approval even though no approval request existed; that classification path was also repaired. The UI alone does not prove these causes; the diagnosis required the tool receipt and source analysis. The old execution label and incomplete usage remain historical evidence."}</p>
<p>{"Deploying the fix changes how a future eligible review is handled. It does not synthesize a missing review, mark an incomplete usage record complete, refund a provider call or replay an elapsed occurrence. This distinction is essential when verifying a repair: source and deployment evidence establish that the fix is installed; a later eligible execution is needed to demonstrate its live path. The complete formal decision/fill path remains unproven at this checkpoint. "}<a href="https://github.com/eugenelin89/bot_messenger/pull/102">{"Review-clock repair"}</a></p>
</GuideSection>
<GuideSection id="publication" title="Inspect publication separately from execution">
<p>{"Open "}<strong>{"Projects → Investment → Publication"}</strong>{" from Projects or the Investment navigation. Use "}<strong>{"Refresh status"}</strong>{" to inspect the existing channel. The source/destination header identifies the channel privately; it has been excluded from the screenshot."}</p>
<GuideFigure figure={figures["06-publication-health"]} />
<p>{"Read the health fields independently:"}</p>
<GuideTable caption="Publication health fields" wide={false} headings={["Field", "Diagnostic use"]} rows={[
[<>{"State and consent expiry"}</>,<>{"Whether this channel still has the relevant consent"}</>],
[<>{"Pending and bytes"}</>,<>{"Staged work waiting in the durable outbox"}</>],
[<>{"Uncaptured"}</>,<>{"Eligible source material not yet staged under the current capture rules"}</>],
[<>{"Uncertain"}</>,<>{"Requests whose remote outcome needs reconciliation before a replacement is safe"}</>],
[<>{"Oldest backlog age"}</>,<>{"Whether queued work has exceeded its attention threshold"}</>],
[<>{"Generation / restore requirement"}</>,<>{"Whether local and receiver recovery state require coordinated fencing"}</>],
[<>{"Budget/delivery/new-risk flags"}</>,<>{"Whether configured limits or retained conditions block progress"}</>]
]} />
<p>{"Expand "}<strong>{"Delivery receipts and backlog"}</strong>{" privately. It shows health details and jobs with fields such as "}<code>{"kind"}</code>{", "}<code>{"state"}</code>{", "}<code>{"digest"}</code>{", "}<code>{"retryAt"}</code>{" and "}<code>{"receipt"}</code>{". A delivered record batch can include accepted record identifiers, a receiver cursor and a watermark. A heartbeat receipt proves acceptance of a lifecycle contact, not acceptance of a new decision or valuation."}</p>
<p>{"The historical snapshot has no pending, uncaptured or uncertain jobs. That does not mean every private conversation has been published. The channel only covers approved record classes and derivatives. New explanations and artifacts can require another exact preview. “Uncaptured zero” is evaluated within that scope."}</p>
<p>{"To investigate a missing public record, first establish that the private typed record exists. Then check whether it is eligible under the publication consent, whether it was captured into a job, whether that job was acknowledged, and whether the public view is displaying the corresponding run and record. A website refresh cannot create a private review that never committed."}</p>
<p>{"Do not use the "}<code>{"publicationHealth: { disabled: true }"}</code>{" value in an observed/private-paper loop's JSON as proof that the separate public publisher is off. Inspect the publication channel itself. Also treat older generic page copy about a “synthetic source” as insufficient to classify the selected source: this channel uses the observed-paper portfolio adapter, with its own evidence mode and publication boundary."}</p>
<p><strong>{"Capture approved future financial records"}</strong>{", "}<strong>{"Deliver or reconcile one request"}</strong>{" and "}<strong>{"Queue one lifecycle heartbeat"}</strong>{" perform operations. They are not aliases for Refresh. A restored-publisher reconciliation or generation fence needs the operator's recovery procedure and receiver evidence. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/public/publication.js">{"Publisher interface"}</a>{" · "}<a href="https://github.com/eugenelin89/asymmetri/blob/main/docs/BOTSQUAD_INTEGRATION.md">{"Publication protocol"}</a></p>
</GuideSection>
<GuideSection id="troubleshooting" title="Use a symptom-to-evidence troubleshooting path">
<GuideTable caption="Symptoms and the next evidence to inspect" wide={true} headings={["Symptom", "Examine next", "What would be an unsupported conclusion?"]} rows={[
[<>{"Public site says paused"}</>,<>{"Matching HQ portfolio and loop reason; public record timestamp"}</>,<>{"“The website is causing the pause”"}</>],
[<>{"Connected HQ, no active executions"}</>,<>{"Current occurrence, future schedule, authority and dispatch state"}</>,<>{"“Connected means work should be running continuously”"}</>],
[<>{"No new discussion today"}</>,<>{"Collection occurrence, research window, group and execution origin"}</>,<>{"“The model forgot to wake itself up”"}</>],
[<>{"Completed execution, incomplete usage"}</>,<>{"Terminal settlement, completeness reasons and reservation"}</>,<>{"“Completed text means all accounting is complete”"}</>],
[<>{"Awaiting-approval label, no Approvals item"}</>,<>{"Runtime receipt, exact failed tool and historical classification"}</>,<>{"“Clicking a generic approval button will recover this review”"}</>],
[<>{"Cash unchanged after a persuasive discussion"}</>,<>{"Proposal → review → submission → order chain"}</>,<>{"“The team successfully submitted HOLD”"}</>],
[<>{"Ten invocations on two cards"}</>,<>{"Shared portfolio identifier and aggregate filter"}</>,<>{"“Twenty calls were consumed”"}</>],
[<>{"Recent publisher contact, old valuation"}</>,<>{"Heartbeat receipt versus financial-record receipt"}</>,<>{"“The portfolio was revalued when the heartbeat arrived”"}</>],
[<>{"Unpriced usage"}</>,<>{"Exact model pricing availability and restrictions"}</>,<>{"“The call was free”"}</>],
[<>{"No future eligible research session"}</>,<>{"Selected plan's pending future occurrences and absolute expiry"}</>,<>{"“Resume will restart the whole day”"}</>]
]} />
<p>{"If the source-collection stage is blocked, inspect its retained result before reaching for a different feed or manually entering a price. Determine whether the problem was a request limit, source response, qualification rule, interrupted collection or an expired window. The market-data budget remains US$0 incremental, and automated access/publication permissions remain part of the source boundary. A model-generated substitute price would destroy the experiment's evidence trail. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/docs/decisions/decision_029_zero_cost_market_data.md">{"Market-data decision"}</a></p>
<p>{"If information seems inconsistent between panels, record observation times, perform one full page reload, and compare identities and scopes before changing anything. Historical cards, bounded views and separate refresh behavior explain some discrepancies. A persistent discrepancy belongs in an incident report with the exact fields, not an improvised state reset."}</p>
<p>{"For a pause that needs live observation, "}<a href="#tail-logs">{"tail the service journal and follow the selected Trade scope"}</a>{" in separate terminals. A running service, a moving stage and a reviewed submission answer different questions. Preserve the loop's exact reason before attempting recovery."}</p>
</GuideSection>
<GuideSection id="controls" title="Know which controls change state">
<p>{"Investigation and recovery are different phases. Most mistakes come from using an action button to find out what it does. The current interface includes controls with materially different effects:"}</p>
<GuideTable caption="Controls and their effects" wide={false} headings={["Control or activity", "Effect"]} rows={[
[<>{"Navigate, expand a disclosure, Refresh, full page reload, Usage & cost"}</>,<>{"Inspect existing state; no new employee reasoning is requested"}</>],
[<>{"Use portfolio for new finite authority"}</>,<>{"Prefills a local setup form; does not itself renew authority"}</>],
[<>{"Preview exact scope/schedule/portfolio or Build exact preview"}</>,<>{"Can persist a draft or exact preview; does not necessarily invoke a model or transmit data, but is not purely read-only"}</>],
[<>{"Approve/save consent or scope"}</>,<>{"Changes durable authorization/configuration"}</>],
[<>{"Start / Resume"}</>,<>{"Attempts to authorize eligible future work under current checks"}</>],
[<>{"Loop Pause / Stop"}</>,<>{"Changes loop control state and fences stale work; unfilled orders are cancelled while completed fills remain"}</>],
[<>{"Settings → Pause new work / Resume queued work"}</>,<>{"Holds company dispatch; it is a separate control from the investment loop's lifecycle"}</>],
[<>{"Group Finish / another bounded round / Request reply"}</>,<>{"Can authorize additional model work"}</>],
[<>{"Confirm Reload OFF / report funding configuration changed"}</>,<>{"Records a funding-state attestation or change; only use when factually justified"}</>],
[<>{"Capture / Deliver / Heartbeat / publication reconciliation"}</>,<>{"Changes publication state and may transmit approved data"}</>],
[<>{"Service restart or deployment"}</>,<>{"Changes process/code state; does not reset durable portfolio, call history or approval evidence"}</>]
]} />
<p>{"Pause is not time travel. Wall-clock windows and authority expiry continue to matter. On resume, elapsed pending work can become missed; cancelled orders and ended cycles do not revive. A stop or generation change also prevents an old asynchronous callback from being treated as current work. An active provider call may still require settlement or reconciliation after interruption."}</p>
<p>{"The existing Resume path requires an exact matching authority/digest, valid evidence and eligible future work. The historical two-gap example cannot be repaired merely by pressing the visible buttons. A new scope or recovery amendment is a separate reviewed operation with retained history, not a fresh empty counter."}</p>
<p>{"There is no need to change any of these controls to collect the evidence described in this guide. The useful recovery question is precise: “Which failed condition has been repaired, what retained evidence proves that, and what future action is now authorized?” "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/public/investment-run.js">{"Loop controls"}</a></p>
</GuideSection>
<GuideSection id="beyond-ui" title="Escalate beyond the UI when the evidence stops">
<p>{"HQ is an inspection interface, not a complete debugger. Escalate when a display lacks terminal settlement detail, a collection was interrupted, a runtime classification is ambiguous, or a recovery invariant needs proof from the durable store."}</p>
<p>{"The operator's next read-only checks should establish the deployed revision and service status, then examine a narrow log window around the relevant UTC timestamps. Search with the exact private execution or occurrence identifier. Preserve the original failure before changing code or restarting a process. Record both the application outcome and provider-call outcome; a lost response does not prove that no call happened."}</p>
<p>{"The "}<a href="#tail-logs">{"log-tailing commands below"}</a>{" show how to collect that evidence without restarting HQ or asking an employee to run again."}</p>
<p>{"For a database investigation, use an approved consistent backup or a read-only connection and queries appropriate to the deployed schema. Join the occurrence, execution, usage, finite reservation, proposal and review records described above. The portfolio database and independently retained finite authority are related evidence sources; inspecting only one can miss a constraint. Do not edit rows to make a status look complete, delete reservations to recover capacity, or copy an old approval onto a new proposal."}</p>
<p>{"Treat SQL results, runtime logs, expanded receipts and transcripts as private diagnostic material. They can contain identifiers, provider references and content that is not in the public projection. A public incident summary should state the stage, failure class, observed effect, repair and remaining uncertainty without dumping those raw records."}</p>
<p>{"A good repair verification has three distinct claims: the code change addresses the diagnosed cause; the intended revision is actually deployed; and a future eligible execution demonstrates the repaired behavior. Passing the first two does not justify claiming the third. Documentation screenshots establish what the interface displayed at capture time, not a successful end-to-end trade."}</p>
</GuideSection>
<GuideSection id="tail-logs" title="Tail logs and follow Trade activity">
<p>{"Tailing means keeping a terminal open to show new diagnostic output as it arrives. Use two views: the systemd journal for the HQ process, and saved Trade events for employee and stage activity. They have different sources and neither replaces the "}<a href="#record-chain">{"proposal, review and submission record chain"}</a>{"."}</p>
<h3>{"Start with authorized SSH access"}</h3>
<p>{"Run these commands from your own terminal. The name "}<code>{"botsquad"}</code>{" is an SSH alias already configured by this installation's operator, normally in "}<code>{"~/.ssh/config"}</code>{". You need the approved account, key and permission to read the relevant journal or private database. The public website does not provide that access. On another installation, use its operator-approved alias and service name. A hostname-resolution or permission error is an access problem, not evidence that Trade stopped."}</p>
<h3>{"Follow the service journal"}</h3>
<GuideCode caption="Live HQ service journal" text={"ssh botsquad 'journalctl -u botsquad.service -f --output=short-iso'"} />
<p><code>{"-u"}</code>{" selects the HQ service; "}<code>{"-f"}</code>{" displays recent entries and keeps following new ones. "}<code>{"--output=short-iso"}</code>{" gives each journal entry a timestamp with its UTC offset. Press "}<kbd>{"Ctrl+C"}</kbd>{" to leave the viewer. This does not stop or restart "}<code>{"botsquad.service"}</code>{", pause the Trade loop, or cancel an employee's model call."}</p>
<p>{"To inspect a recent failure without leaving a follower running:"}</p>
<GuideCode caption="The last 15 minutes of service history" text={"ssh botsquad 'journalctl -u botsquad.service --since \"15 minutes ago\" --no-pager --output=short-iso'"} />
<p>{"The time filter is evaluated on the server. "}<code>{"--no-pager"}</code>{" prints the matching history and exits. An empty result means no retained entries matched that window. In this installation, "}<code>{"StandardOutput=journal"}</code>{" and "}<code>{"StandardError=inherit"}</code>{" route the service's output into the system journal. In practice, this view is most useful for startup, shutdown and runtime errors. It is not a transcript of every Atlas or Maya action."}</p>
<h3>{"Follow the October 15 renewal's Trade activity"}</h3>
<p>{"Employee runtime events are append-only SQLite audit records, not a plain-text log file that can be watched with "}<code>{"tail -f"}</code>{". For the October 15, 2026 owner-authorized renewal, the operator installed this small read-only follower:"}</p>
<GuideCode caption="Follow the dated Trade activity helper" text={"ssh botsquad 'python3 -u /var/tmp/botsquad-owner-renewal-20261015/tail-trade.py'"} />
<p className="guide-callout"><strong>{"Incident-specific operator helper."}</strong>{" This dated path is not a permanent BotSquad product command. It follows only the renewal scope selected by that incident's retained configuration. It may be absent on another host or after a later deployment. A missing file does not mean the service is down; use HQ's current inspection views and ask the operator for the appropriate supported diagnostic tool."}</p>
<p>{"The helper opens SQLite in read-only mode and polls every two seconds. It begins with a bounded window of matching recent events, then prints new Atlas/Maya event types and their execution IDs, plus changes in loop/stage state and reasons, execution-status counts, and proposal/review/submission counts. It does not print the full discussion, invoke a model, write database rows or grant authority. "}<code>{"python3 -u"}</code>{" makes output appear promptly instead of waiting in an output buffer."}</p>
<p>{"For one current state snapshot, with any matching recent events, add "}<code>{"--once"}</code>{":"}</p>
<GuideCode caption="Read one Trade activity snapshot and exit" text={"ssh botsquad 'python3 -u /var/tmp/botsquad-owner-renewal-20261015/tail-trade.py --once'"} />
<p>{"Press "}<kbd>{"Ctrl+C"}</kbd>{" to leave the continuous viewer. The follower prints state only when it changes, so silence is not a heartbeat failure. Its recent-event window is not a complete historical export. Use HQ and the retained records when you need to reconstruct an older attempt."}</p>
<h3>{"Interpret the evidence before declaring success"}</h3>
<GuideTable caption="What diagnostic output establishes" wide={true} headings={["Signal", "What it establishes", "What to inspect next"]} rows={[
[<>{"Service started or ready"}</>,<>{"The HQ process reached that startup point"}</>,<>{"Current loop, due times, prerequisites and authority; startup alone does not establish eligible work"}</>],
[<>{"A stage is running, complete or blocked"}</>,<>{"A recorded scheduler transition and its reason"}</>,<>{"That exact occurrence's result; completed collection is not completed research"}</>],
[<>{"An Atlas/Maya event or completed execution"}</>,<>{"An attributable runtime event or terminal execution status"}</>,<>{"Saved output, usage settlement and completeness, then the required typed records"}</>],
[<>{"Proposal or review counts increased"}</>,<>{"Records exist within this scope"}</>,<>{"The same proposal revision/hash, independent reviewer and review disposition; a review count can include rejection"}</>],
[<>{"A submission count increased"}</>,<>{"A submission record exists"}</>,<>{"Its accepted result and matching proposal/review; an order or fill, when required, and a separate public-delivery receipt"}</>]
]} />
<p>{"If the loop becomes blocked, capture its exact stage and reason. A source-quality failure, expired research window and incomplete usage settlement are different diagnoses even if the public status says paused in each case. Do not infer a successful decision from a reassuring service log, a persuasive response or a nonzero counter. Follow the "}<a href="#troubleshooting">{"symptom-to-evidence path"}</a>{" and verify the linked records."}</p>
<h3>{"Keep timestamps and diagnostic output unambiguous"}</h3>
<p>{"The helper prints UTC timestamps. The verified HQ server uses UTC too, so its journal currently shows a "}<code>{"+0000"}</code>{" offset. On a different host, journal output can use that server's local timezone; add "}<code>{"--utc"}</code>{" to either journal command when you need UTC explicitly. Compare the full date and offset, not just the clock time. On October 15, 2026, 21:00 UTC is 2:00 p.m. in Vancouver (UTC−07:00). Convert other dates with "}<code>{"America/Vancouver"}</code>{" rather than assuming a fixed offset for every historical date."}</p>
<p>{"Keep execution IDs and raw diagnostic output in authorized private operator notes. Do not enable verbose logging of tokens, authentication headers or full private prompts, and do not paste raw logs or receipts into a public report. Share a redacted stage, failure class, timestamp and verified outcome instead. These commands observe existing work; running them does not establish that a new decision has completed."}</p>
<p>{"Command references: "}<a href="https://man.openbsd.org/ssh_config#Host">{"OpenSSH host configuration"}</a>{" and the "}<a href="https://github.com/systemd/systemd/blob/v249/man/journalctl.xml">{"journalctl manual source"}</a>{". You can also read "}<code>{"man journalctl"}</code>{" on the server. The incident helper was inspected separately; it is not supplied by either tool."}</p>
</GuideSection>
<GuideSection id="incident-record" title="Keep a compact incident record and a daily routine">
<p>{"Use the following template in private operator notes. Include exact IDs there, then remove them from any public version."}</p>
<GuideCode caption="Private incident-note template" text={"Observed at: UTC time + local timezone\nDeployed revision:\nPortfolio / scope / loop / authority / plan revision:\nExpected stage and due/expiry window:\nObserved state and exact reason:\nLast completed prerequisite:\nExecution: worker, activity, start/end, runtime status\nUsage: settled, completeness, reasons, pricing availability\nReservation: state, consumed/remaining limits, unresolved outcome?\nDecision chain: proposal / review / submission / order / fill\nPortfolio effect and latest valuation timestamp:\nPublication: consent, pending/uncertain jobs, relevant receipt kind\nWhat is proven / what remains unknown:\nActions already taken and their receipts:\nProposed next action, required authority and verification:"} />
<p>{"For a normal daily check, open Tasks → Needs your attention, identify the current loop and session, read the portfolio timestamp, and inspect the latest completed occurrence and execution. After research, verify the decision chain. After the close, verify the closing collection and valuation. Finally, inspect publication receipts and the public page's distinct financial and contact timestamps."}</p>
<p>{"If something is blocked, preserve the reason and follow its evidence chain before taking action. If nothing is scheduled, verify whether the finite operating scope has ended rather than assuming the always-on server is malfunctioning. Future daily operation needs an eligible schedule and authority; the continuing portfolio alone does not supply either."}</p>
<p>{"This routine makes an incident explainable in terms of recorded transitions: what was authorized, what was attempted, what committed, what was delivered, and where the chain stopped."}</p>
</GuideSection>
<GuideSection id="version" title="Version, evidence and known interface limits">
<p>{"The historical investigation documents the former HQ implementation at revision "}<code>{"139a1c5"}</code>{" and the October 15 observation window stated above. Its historical source links remain pinned. The seven older screenshots are cropped actual interfaces; the five UX-01 screenshots are actual redesigned interfaces using explicitly authored sample data and a fake runtime. Expanded private receipts and transcripts were inspected where needed but are not published here."}</p>
<p>{"The "}<a href="#tail-logs">{"Tail logs section"}</a>{" was added later on October 15 after checking the service's journal settings and the renewal-specific read-only helper. It documents an inspection method, not the outcome of that renewal. The earlier screenshots and failure example remain a dated checkpoint."}</p>
<p>{"The historical version exhibited the misleading permanent-limit denominator during recovery, shared portfolio-level usage repeated on different loop cards, a generic subscription warning alongside finite-authority state, incomplete refresh coordination between the portfolio panel and loop cards, and a historical awaiting-approval label that does not correspond to a current owner approval. Those observations are retained as historical evidence. Consult the current installed records before diagnosing the same issue today."}</p>
<p>{"At the screenshot checkpoint, genuine research and closing valuation had occurred; a complete reviewed decision/submission/fill sequence had not been demonstrated. The experiment uses observed paper trading with no brokerage execution. Read the "}<a href="/botsquad/trade/guide">{"Trade experiment guide"}</a>{" for the portfolio method, daily schedule, source restrictions and rerun semantics, and the "}<a href="/botsquad/trade">{"public Trade page"}</a>{" for the currently published evidence."}</p>
</GuideSection>
  </>;
}
