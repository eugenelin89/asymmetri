import { GuideSection, GuideFigure, GuideCode, GuideTable } from '@/components/investment/guide-layout';
import { hqGuideFigures as figures } from '@/content/site';

export const guideContents = [
  {
    "id": "overview",
    "title": "Start here"
  },
  {
    "id": "question",
    "title": "Start with the right question"
  },
  {
    "id": "hq-navigation",
    "title": "Open HQ and learn its navigation"
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
<p>{"BotSquad HQ is the private control and evidence interface for the Trade experiment. It lets the owner inspect the portfolio, scheduled stages, employee discussions, individual model executions, usage accounting and publication delivery. The public Trade site shows an approved projection of those records. HQ is where you investigate how that projection was produced and why work stopped."}</p>
<p>{"This is a companion to "}<a href="/botsquad/investment/guide">{"How BotSquad Trade works"}</a>{". That guide explains the experiment and its daily routine. This one explains how to examine a particular day, trace a failure across components, and decide what evidence is needed before any recovery action. It assumes comfort with processes, databases, APIs and state machines, but no prior knowledge of BotSquad's implementation."}</p>
<p className="guide-callout"><strong>{"Observation checkpoint: October 15, 2026, approximately 11:30–11:45 a.m. Vancouver / 18:30–18:45 UTC."}</strong>{" The screenshots are actual private HQ views captured through Computer Use. They are cropped to exclude private identifiers, transcripts and access details; their contents have not been rewritten. They document this version of the interface, not live status. No model call, source collection, restart, resume, approval or publication delivery was triggered to make this guide."}</p>
<p>{"The example is a useful real failure: research produced a HOLD proposal, its independent review failed, usage evidence remains incomplete, and the loop is held. The portfolio remains all cash. Meanwhile, publication can still deliver lifecycle heartbeats. Those facts are compatible because they describe different parts of the system."}</p>
</GuideSection>
<GuideSection id="question" title="Start with the right question">
<p>{"“Is it running?” is too broad for a system with several durable workflows. Break it into questions that have separate evidence:"}</p>
<GuideTable caption="Questions and their evidence" wide={true} headings={["Question", "First place to inspect", "Evidence you need"]} rows={[
[<>{"Can the browser reach HQ?"}</>,<>{"Connection indicator on the home page"}</>,<>{"A current connected view, then a successful refresh"}</>],
[<>{"Does anything require owner attention?"}</>,<>{"Attention"}</>,<>{"The specific item and its linked workflow"}</>],
[<>{"What does the portfolio own?"}</>,<>{"Investment run → Persistent observed-paper portfolios"}</>,<>{"Cash, holdings, orders and the latest valuation timestamp"}</>],
[<>{"What stage should run next?"}</>,<>{"The matching loop card and its schedule disclosure"}</>,<>{"Occurrence identity, due time, expiry, state and reason"}</>],
[<>{"Did a worker actually execute?"}</>,<>{"Executions; the loop's AI usage table"}</>,<>{"An attributable execution, timestamps and terminal outcome"}</>],
[<>{"What did the team use and conclude?"}</>,<>{"Working Groups"}</>,<>{"Shared evidence, contributions, synthesis and review records"}</>],
[<>{"Was a paper decision accepted?"}</>,<>{"Loop evidence / portfolio history"}</>,<>{"Matching proposal, independent review and submission"}</>],
[<>{"Did the website receive it?"}</>,<>{"Investment publication"}</>,<>{"A delivered batch receipt for the relevant records"}</>]
]} />
<p>{"A healthy HTTP service establishes reachability. It does not establish that the scheduler has eligible work, that a model finished, that a proposal passed review, or that the website received a new financial record. Investigate one assertion at a time."}</p>
<p>{"The server owns the scheduler and durable state. Your browser is a client. Closing a tab does not stop the daily loop, and reopening one does not replay a missed session. Idle employees do not continuously invoke a model. Reading existing screens does not ask Atlas or Maya to reason again. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/docs/architecture/SYSTEM_ARCHITECTURE.md">{"Architecture"}</a></p>
</GuideSection>
<GuideSection id="hq-navigation" title="Open HQ and learn its navigation">
<p>{"Use the private access method configured by the operator. In this installation, the owner reaches a loopback-bound HQ through an authenticated SSH tunnel. The public Asymmetri website is not that access point. If the browser cannot connect, check that the tunnel and server service are available before investigating investment logic. A connection failure is not evidence of an investment pause."}</p>
<p>{"This guide deliberately omits private hostnames, credentials and access links. Use the operator's existing access instructions. Do not expose the HQ listener publicly merely to make a documentation link work."}</p>
<GuideFigure figure={figures["01-hq-navigation"]} />
<p>{"The most useful entries have different responsibilities:"}</p>
<GuideTable caption="HQ navigation and responsibilities" wide={false} headings={["HQ entry", "What it is for"]} rows={[
[<><strong>{"Attention"}</strong></>,<>{"A deterministic list of unresolved owner-facing conditions, with links to existing controls"}</>],
[<><strong>{"Working Groups"}</strong></>,<>{"Bounded discussions, selected shared evidence, attributable contributions, questions and saved syntheses"}</>],
[<><strong>{"Executions"}</strong></>,<>{"Runtime attempts across the company, including working-group turns and Tasks"}</>],
[<><strong>{"Approvals"}</strong></>,<>{"Actual pending application approvals; an execution's status label alone does not create one"}</>],
[<><strong>{"Investment run"}</strong></>,<>{"The continuing portfolio, finite loop cards, occurrence schedules, usage and paper evidence"}</>],
[<><strong>{"Investment team"}</strong></>,<>{"Existing scoped responsibilities and permissions, plus a separate form for new scopes"}</>],
[<><strong>{"Investment publication"}</strong></>,<>{"Consent, outbox health, backlog and receiver acknowledgments"}</>],
[<><strong>{"Audit history"}</strong></>,<>{"Recorded company operations; useful supporting context alongside the domain-specific evidence"}</>]
]} />
<p>{"The "}<strong>{"Executive channel"}</strong>{" is a way to give work to Atlas. It is not the first diagnostic screen for an already recorded failure. Similarly, an empty Task queue does not imply that no investment work occurred: Trade uses working-group conversation executions. Company-wide execution counts can include unrelated projects."}</p>
<p>{"Open "}<strong>{"Attention"}</strong>{", refresh it, and follow "}<strong>{"Inspect Investment run"}</strong>{" for an investment item. At this checkpoint, Attention showed two items: one investment problem and an unrelated infrastructure coordination Task. Counting both as two investment failures would be incorrect. Attention is a projection over saved state, not a model-generated diagnosis, and it does not independently authorize recovery. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/control/attention.ts">{"Attention implementation"}</a></p>
</GuideSection>
<GuideSection id="identities" title="Identify the portfolio, scope and loop before comparing numbers">
<p>{"Open "}<strong>{"Investment run"}</strong>{". The top portfolio panel and the loop cards below it answer different questions. A persistent portfolio can be used by an original operating scope and a later recovery scope. Both can remain visible after one stops."}</p>
<p>{"The page does not currently have a dedicated “select current run” control. Its "}<strong>{"Approved team"}</strong>{" dropdown belongs to schedule creation; changing that dropdown does not filter the historical cards. Match the records you are inspecting, rather than assuming the first card or a familiar session date must be the correct one."}</p>
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
<p>{"One current UI limitation matters: the "}<strong>{"Refresh"}</strong>{" button at the top of the investment page reloads the loop cards. The portfolio panel is loaded independently. For a coherent fresh observation of both, reload the whole browser page and note the time. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/public/observed-investment.js">{"Portfolio interface"}</a></p>
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
<p>{"The current block mentions incomplete finite-HQ telemetry and exact owner resume. That wording does not promise that clicking Resume will pass. Resume must still satisfy all underlying checks, including usage and eligible future work. A free slot is not sufficient authority to replay old work."}</p>
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
<p>{"The loop's "}<strong>{"AI usage"}</strong>{" section is a convenient aggregate. The home page's "}<strong>{"Executions"}</strong>{" view lets you inspect runtime attempts across the company and use "}<strong>{"Usage & cost"}</strong>{" for an individual attempt. Match the working-group origin, worker and timestamp, then confirm the exact execution identifier privately."}</p>
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
<p>{"The "}<strong>{"Worker, cycle, day and activity breakdown"}</strong>{" helps locate the source of aggregate usage. The worker inspector's "}<strong>{"AI usage and cost"}</strong>{" is broader than one Trade loop. Likewise, both the predecessor and successor loop cards currently report ten invocations because their reports filter the same persistent portfolio. Do not add the two cards to claim twenty calls."}</p>
<p>{"Current worker profile settings are not historical execution settings. Inspect the execution's recorded model, reasoning level and runtime provenance when explaining what actually ran. Changes to a worker profile affect future work; they do not rewrite prior execution evidence. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/public/usage.js">{"Usage UI"}</a>{" · "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/control/usage/service.ts">{"Usage accounting"}</a></p>
</GuideSection>
<GuideSection id="discussions" title="Examine what the team actually saw and said">
<p>{"Return to "}<strong>{"Private HQ → Working Groups"}</strong>{". Choose the discussion matching the scope you recorded. The current and predecessor discussions can have the same topic. Confirm their identity and state rather than selecting by title alone."}</p>
<p>{"Read the charter, shared audience, facilitator, synthesizer, turn/round limits and deadline first. The company sidebar calls Atlas “CEO” and Maya “Product Manager.” Their investment scope gives them specific Trade responsibilities. Those scoped permissions are more relevant to this decision than their company-wide job titles."}</p>
<p>{"Then examine the evidence in this order:"}</p>
<ol><li><strong>{"Shared evidence packet"}</strong>{": which selected records were made available to the discussion? "}<strong>{"Inspect shared source"}</strong>{" shows the retained material. Membership alone does not expose private employee histories."}</li><li><strong>{"Attributable discussion"}</strong>{": who contributed, in what order, and against which transcript/evidence revisions? References connect claims to prior contributions and shared material."}</li><li><strong>{"Questions and responses"}</strong>{": which explicit questions were answered, and which remain unresolved?"}</li><li><strong>{"Saved synthesis"}</strong>{": what conclusion was actually retained, and was it marked incomplete?"}</li><li>{"The relevant execution evidence: did the turn that was supposed to produce a result finish and persist the required typed record?"}</li></ol>
<p>{"A current working-group counter of six used turns out of 24 is a discussion limit. It is not interchangeable with six loop turns out of 16 or the finite family's eleven-call effective ceiling. Multiple limits constrain the same workflow at different layers; the loosest one does not override the others."}</p>
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
<p>{"The current example shows why a single status label is insufficient. In "}<strong>{"Executions"}</strong>{", Maya's review appears as "}<strong>{"awaiting approval"}</strong>{", with a runtime message about an unavailable approval. In the loop's usage table, the same review has incomplete usage. The company "}<strong>{"Approvals"}</strong>{" count is zero."}</p>
<GuideFigure figure={figures["07-review-row"]} />
<p>{"An investigation should proceed as follows:"}</p>
<ol><li>{"Match the review execution to the correct occurrence and proposal context."}</li><li>{"Read its runtime error and usage explanation. The displayed token numbers do not by themselves establish complete terminal accounting."}</li><li>{"Check the committed review and submission collections. Both are empty here."}</li><li>{"Check "}<strong>{"Approvals"}</strong>{" for an actual actionable record. Do not manufacture an approval from the status text."}</li><li>{"Consult the retained tool/runtime receipt and deployed source when the UI cannot explain the failure precisely."}</li></ol>
<p>{"The prior technical investigation found a review-clock defect: the tool facade sampled "}<code>{"reviewedAt"}</code>{", then the journal sampled a slightly later "}<code>{"recordedAt"}</code>{" within the same "}<code>{"paper_review"}</code>{" call. The reducer required exact equality and rejected the mismatch. Frozen test clocks had hidden it. PR #102 now samples one trusted commit timestamp after validation for both the review and journal entry, while retaining live authorization and cutoff checks. A separate adapter catch had mislabeled the bounded tool exception as awaiting approval even though no approval request existed; that classification path was also repaired. The UI alone does not prove these causes; the diagnosis required the tool receipt and source analysis. The old execution label and incomplete usage remain historical evidence."}</p>
<p>{"Deploying the fix changes how a future eligible review is handled. It does not synthesize a missing review, mark an incomplete usage record complete, refund a provider call or replay an elapsed occurrence. This distinction is essential when verifying a repair: source and deployment evidence establish that the fix is installed; a later eligible execution is needed to demonstrate its live path. The complete formal decision/fill path remains unproven at this checkpoint. "}<a href="https://github.com/eugenelin89/bot_messenger/pull/102">{"Review-clock repair"}</a></p>
</GuideSection>
<GuideSection id="publication" title="Inspect publication separately from execution">
<p>{"Open "}<strong>{"Investment publication"}</strong>{" from the sidebar or investment page. Use "}<strong>{"Refresh status"}</strong>{" to inspect the existing channel. The source/destination header identifies the channel privately; it has been excluded from the screenshot."}</p>
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
<p>{"The current snapshot has no pending, uncaptured or uncertain jobs. That does not mean every private conversation has been published. The channel only covers approved record classes and derivatives. New explanations and artifacts can require another exact preview. “Uncaptured zero” is evaluated within that scope."}</p>
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
[<>{"Global Pause new dispatch"}</>,<>{"Holds company dispatch; it is a separate control from the investment loop's lifecycle"}</>],
[<>{"Group Finish / another bounded round / Request reply"}</>,<>{"Can authorize additional model work"}</>],
[<>{"Confirm Reload OFF / report funding configuration changed"}</>,<>{"Records a funding-state attestation or change; only use when factually justified"}</>],
[<>{"Capture / Deliver / Heartbeat / publication reconciliation"}</>,<>{"Changes publication state and may transmit approved data"}</>],
[<>{"Service restart or deployment"}</>,<>{"Changes process/code state; does not reset durable portfolio, call history or approval evidence"}</>]
]} />
<p>{"Pause is not time travel. Wall-clock windows and authority expiry continue to matter. On resume, elapsed pending work can become missed; cancelled orders and ended cycles do not revive. A stop or generation change also prevents an old asynchronous callback from being treated as current work. An active provider call may still require settlement or reconciliation after interruption."}</p>
<p>{"The existing Resume path requires an exact matching authority/digest, valid evidence and eligible future work. The current two-gap example cannot be repaired merely by pressing the visible buttons. A new scope or recovery amendment is a separate reviewed operation with retained history, not a fresh empty counter."}</p>
<p>{"There is no need to change any of these controls to collect the evidence described in this guide. The useful recovery question is precise: “Which failed condition has been repaired, what retained evidence proves that, and what future action is now authorized?” "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/public/investment-run.js">{"Loop controls"}</a></p>
</GuideSection>
<GuideSection id="beyond-ui" title="Escalate beyond the UI when the evidence stops">
<p>{"HQ is an inspection interface, not a complete debugger. Escalate when a display lacks terminal settlement detail, a collection was interrupted, a runtime classification is ambiguous, or a recovery invariant needs proof from the durable store."}</p>
<p>{"The operator's next read-only checks should establish the deployed revision and service status, then examine a narrow log window around the relevant UTC timestamps. Search with the exact private execution or occurrence identifier. Preserve the original failure before changing code or restarting a process. Record both the application outcome and provider-call outcome; a lost response does not prove that no call happened."}</p>
<p>{"For a database investigation, use an approved consistent backup or a read-only connection and queries appropriate to the deployed schema. Join the occurrence, execution, usage, finite reservation, proposal and review records described above. The portfolio database and independently retained finite authority are related evidence sources; inspecting only one can miss a constraint. Do not edit rows to make a status look complete, delete reservations to recover capacity, or copy an old approval onto a new proposal."}</p>
<p>{"Treat SQL results, runtime logs, expanded receipts and transcripts as private diagnostic material. They can contain identifiers, provider references and content that is not in the public projection. A public incident summary should state the stage, failure class, observed effect, repair and remaining uncertainty without dumping those raw records."}</p>
<p>{"A good repair verification has three distinct claims: the code change addresses the diagnosed cause; the intended revision is actually deployed; and a future eligible execution demonstrates the repaired behavior. Passing the first two does not justify claiming the third. Documentation screenshots establish what the interface displayed at capture time, not a successful end-to-end trade."}</p>
</GuideSection>
<GuideSection id="incident-record" title="Keep a compact incident record and a daily routine">
<p>{"Use the following template in private operator notes. Include exact IDs there, then remove them from any public version."}</p>
<GuideCode caption="Private incident-note template" text={"Observed at: UTC time + local timezone\nDeployed revision:\nPortfolio / scope / loop / authority / plan revision:\nExpected stage and due/expiry window:\nObserved state and exact reason:\nLast completed prerequisite:\nExecution: worker, activity, start/end, runtime status\nUsage: settled, completeness, reasons, pricing availability\nReservation: state, consumed/remaining limits, unresolved outcome?\nDecision chain: proposal / review / submission / order / fill\nPortfolio effect and latest valuation timestamp:\nPublication: consent, pending/uncertain jobs, relevant receipt kind\nWhat is proven / what remains unknown:\nActions already taken and their receipts:\nProposed next action, required authority and verification:"} />
<p>{"For a normal daily check, open Attention, identify the current loop and session, read the portfolio timestamp, and inspect the latest completed occurrence and execution. After research, verify the decision chain. After the close, verify the closing collection and valuation. Finally, inspect publication receipts and the public page's distinct financial and contact timestamps."}</p>
<p>{"If something is blocked, preserve the reason and follow its evidence chain before taking action. If nothing is scheduled, verify whether the finite operating scope has ended rather than assuming the always-on server is malfunctioning. Future daily operation needs an eligible schedule and authority; the continuing portfolio alone does not supply either."}</p>
<p>{"This routine makes an incident explainable in terms of recorded transitions: what was authorized, what was attempted, what committed, what was delivered, and where the chain stopped."}</p>
</GuideSection>
<GuideSection id="version" title="Version, evidence and known interface limits">
<p>{"This guide describes the HQ implementation deployed from revision "}<code>{"139a1c5"}</code>{" and the October 15 observation window stated above. Its source links are pinned where practical. The screenshots are cropped actual interfaces, not simulated training screens. Expanded private receipts and transcripts were inspected where needed but are not published here."}</p>
<p>{"Known limits of this version include the misleading permanent-limit denominator during recovery, shared portfolio-level usage repeated on different loop cards, a generic subscription warning alongside finite-authority state, incomplete refresh coordination between the portfolio panel and loop cards, and a historical awaiting-approval label that does not correspond to a current owner approval. The article explains these behaviors rather than presenting them as fixed."}</p>
<p>{"The broader experiment remains observed paper trading with no brokerage execution. Genuine research and closing valuation have occurred; a complete reviewed decision/submission/fill sequence has not yet been demonstrated. Read the "}<a href="/botsquad/investment/guide">{"Trade experiment guide"}</a>{" for the portfolio method, daily schedule, source restrictions and rerun semantics, and the "}<a href="/botsquad/investment">{"public Trade page"}</a>{" for the currently published evidence."}</p>
</GuideSection>
  </>;
}
