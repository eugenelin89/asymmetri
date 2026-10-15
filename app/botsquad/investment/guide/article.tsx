import { GuideSection, GuideFigure, GuideFlow, GuideTable } from '@/components/investment/guide-layout';
import { tradeGuideFigures as figures } from '@/content/site';

export const guideContents = [
  {
    "id": "overview",
    "title": "Start here"
  },
  {
    "id": "purpose",
    "title": "What the experiment measures"
  },
  {
    "id": "botsquad",
    "title": "Where BotSquad fits"
  },
  {
    "id": "architecture",
    "title": "The architecture and data flow"
  },
  {
    "id": "persistent-state",
    "title": "The objects that persist"
  },
  {
    "id": "daily-schedule",
    "title": "What happens on a normal trading day"
  },
  {
    "id": "clocks",
    "title": "The clocks and the no-lookahead rule"
  },
  {
    "id": "market-evidence",
    "title": "What evidence the employees receive"
  },
  {
    "id": "decision-workflow",
    "title": "From a conversation to an accepted paper decision"
  },
  {
    "id": "portfolio-accounting",
    "title": "How the simulated portfolio is calculated"
  },
  {
    "id": "publication",
    "title": "How private work becomes a public record"
  },
  {
    "id": "budgets",
    "title": "Why finite budgets and usage records matter"
  },
  {
    "id": "recovery",
    "title": "What pause, restart and rerun actually mean"
  },
  {
    "id": "actual-outcomes",
    "title": "What actually happened on October 14 and 15"
  },
  {
    "id": "reading-the-site",
    "title": "How to read the website and operate a day"
  },
  {
    "id": "current-limits",
    "title": "What is proven and what remains limited"
  },
  {
    "id": "glossary",
    "title": "Glossary and implementation map"
  }
] as const;

export function GuideArticle() {
return <>
<GuideSection id="overview" title="Start here">
<p>{"BotSquad Trade is a forward-running trading experiment with a simulated portfolio. Two persistent AI employees, Atlas and Maya, use a controlled market-data packet to develop and challenge decisions. Trusted software checks their permissions, records any accepted simulated orders, computes the portfolio, and publishes selected evidence to Asymmetri. The experiment tests whether an AI team can do accountable, repeatable work over time. Investment returns are one outcome to measure, alongside the quality and reliability of that process."}</p>
<p>{"For a reader with a computer science background, the useful starting point is a "}<strong>{"durable workflow system with an LLM runtime and a deterministic financial ledger"}</strong>{". The model generates arguments and structured proposals. The application owns state transitions, clocks, budgets, accounting and publication. Understanding those responsibilities makes the daily process, and its current failures, much easier to follow."}</p>
<p className="guide-callout"><strong>{"Status checkpoint: October 15, 2026, 10:40 a.m. Vancouver / 17:40 UTC."}</strong>{" Genuine research has run. The October 14 closing valuation and benchmark allocation completed. October 15 produced a HOLD proposal, but its review failed before commitment. There is no completed independent review, submitted decision or portfolio trade. The investment loop is blocked; its prevention fix is deployed. This guide describes the implemented system and its intended routine, with actual outcomes identified separately. It does not announce a restarted experiment."}</p>
<GuideFigure figure={figures["01-trade-overview"]} />
</GuideSection>
<GuideSection id="purpose" title="What the experiment measures">
<p>{"The experiment asks two different questions. First, can a persistent AI organization use evidence, consider alternatives, preserve disagreement, make a decision, obtain independent review and learn from the result? Second, how does its simulated portfolio perform under a disclosed accounting method? A profit does not establish good reasoning, and a valid decision to hold cash can be more defensible than an unsupported trade."}</p>
<p>{"There is no brokerage connection and no real-money execution mode. The portfolio starts with simulated USD 100,000. Its market observations are real; its orders, fills, fees and positions are modeled. That distinction applies even when a screen calls the interface a “Live Trading Desk.” The desk displays published records; it does not send orders to an exchange."}</p>
<p>{"The selected configuration uses AAPL, MSFT, GOOGL, AMZN, JPM, JNJ, XOM and WMT as the equity universe, with SPY as the benchmark. The universe is a frozen experimental setting, not a stock recommendation. The current settings are long-only, no leverage, 15% maximum position weight and 35% maximum sector weight at new-risk admission, a 5% minimum cash requirement, at most two orders per session and six in a rolling seven-day window ending at the target session, zero modeled commission, and 10 basis points of adverse slippage. A 15% observed drawdown threshold stops new risk; it cannot guarantee a maximum loss during market moves."}</p>
<p>{"The portfolio can outlive one operating allowance. The initial operating scope selected October 14 and 15. Its finite authority expires on October 15 at 4:40 p.m. Vancouver. The saved portfolio calendar extends through the 2026 calendar horizon, but that does not authorize daily model work until year-end. Future sessions need a new eligible operating scope without resetting the existing book. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/docs/decisions/decision_047_persistent_observed_paper_investment.md">{"Persistent observed-paper design"}</a></p>
</GuideSection>
<GuideSection id="botsquad" title="Where BotSquad fits">
<p>{"BotSquad is the general coordination system underneath Trade. It provides durable workers, conversations, working groups, tasks, evidence, execution records, a dispatcher and scheduling. Trade adds a particular mandate, a market-data adapter, paper tools and a portfolio ledger to those general capabilities."}</p>
<p>{"An employee is a persistent application identity with a role and permissions. It is not a model process that thinks continuously. When idle, the employee does not poll an LLM. A permitted request causes the dispatcher to invoke the runtime for a bounded turn; the result and its provenance return to the durable company state. The investment path uses working-group conversation executions. A discussion is distinct from a Task, and an ordinary message is not automatically a new execution."}</p>
<p>{"In the selected experiment, Atlas develops research and alternatives, synthesizes conclusions and submits scoped paper decisions. Maya independently challenges the exact proposal, its evidence, downside and invalidation conditions. Those are responsibilities, not scripted opinions. The software does not require BUY, SELL or a profitable outcome."}</p>
<p>{"Independent review here means a different eligible worker and a separately attributable execution. It does not prove statistical independence between models, eliminate shared blind spots, or make the reviewer a human expert."}</p>
<GuideFigure figure={figures["03-worker-roster"]} />
<h3>{"Persistent identity and fresh model context"}</h3>
<p>{"Worker identity, discussion history, portfolio history and provider session identity are separate things. The current finite investment adapter starts fresh provider contexts for subsequent turns to obtain the required usage events. BotSquad carries forward bounded, attributed discussion and evidence through its database. A fresh model context therefore does not create a new employee or erase the previous decision."}</p>
<p>{"This is analogous to reconstructing a worker process from durable state after a restart. Continuity comes from explicit records and selected context, not from assuming a particular provider session will retain everything indefinitely. Ordinary BotSquad conversations may use different continuity rules. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/docs/architecture/SYSTEM_ARCHITECTURE.md">{"System architecture"}</a>{" · "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/control/investment-team/service.ts">{"Investment adapter and tools"}</a></p>
</GuideSection>
<GuideSection id="architecture" title="The architecture and data flow">
<p>{"The private HQ and the public website have different jobs. The HQ owns the experiment. The website owns a public archive and its presentation."}</p>
<figure className="guide-architecture"><figcaption>From a finite mandate to a public record</figcaption><ol>
<li><h3>Owner mandate and finite authority</h3><p>Configuration, people, permitted work, limits and selected sessions.</p></li>
<li><h3>Private BotSquad HQ</h3><p>The scheduler, dispatcher and durable SQLite state coordinate three distinct responsibilities.</p><ul className="guide-architecture-branches"><li><strong>Market gateway</strong><p>Controlled Yahoo requests and qualified evidence.</p></li><li><strong>Atlas and Maya</strong><p>Bounded research, proposal and review tools.</p></li><li><strong>Paper ledger</strong><p>Trusted admission, accounting and valuation.</p></li></ul><p>Evidence informs the employees. Their scoped requests are checked by the trusted ledger.</p></li>
<li><h3>Approved public projection and signed outbox</h3><p>Selected public fields leave HQ through authenticated, retryable delivery.</p></li>
<li><h3>Asymmetri receiver and archive</h3><p>Validated events and acceptance receipts preserve the public record.</p></li>
<li><h3>Trade pages and exact evidence</h3><p>Readers inspect accepted records through the public website.</p></li>
</ol></figure>
<GuideTable caption="Responsibilities and evidence boundaries" headings={["Component", "Owns", "Does not establish"]} rows={[
[<>{"Owner configuration"}</>,<>{"Mandate, universe, roles, method, limits and selected sessions"}</>,<>{"A completed decision or trade"}</>],
[<>{"Scheduler"}</>,<>{"Durable stage identities, due times, expiry and execution state"}</>,<>{"Permission beyond the approved scope"}</>],
[<>{"Dispatcher and runtime adapter"}</>,<>{"Eligible worker invocation, concurrency, tool delivery, interruption and usage capture"}</>,<>{"Correct investment judgment"}</>],
[<>{"Market gateway"}</>,<>{"Bounded requests, normalized evidence, provenance and price qualification"}</>,<>{"A model-selected replacement price"}</>],
[<>{"Paper ledger"}</>,<>{"Exact state transitions, risk checks, orders, fills and accounting"}</>,<>{"Real exchange execution"}</>],
[<>{"Publisher and receiver"}</>,<>{"Approved projection, authenticated delivery, ordering and receipts"}</>,<>{"Truth of the investment thesis"}</>],
[<>{"Public website"}</>,<>{"Read-only views of the accepted archive"}</>,<>{"Private HQ state or operational authority"}</>]
]} />
<p>{"The HQ runs as an always-on service on the operator's server. A browser tab or this documentation chat does not drive the daily loop. Closing the owner's laptop does not itself stop the server scheduler. Conversely, a healthy web server cannot make a blocked investment loop proceed."}</p>
<p>{"Public visitors do not receive a route for starting the private loop, increasing its budget or submitting paper orders. Ask BotSquad is a separate Q&A integration and remains disabled at this checkpoint. It is not an investment control channel. "}<a href="https://github.com/eugenelin89/asymmetri/blob/main/docs/BOTSQUAD_INTEGRATION.md">{"Cross-system integration"}</a></p>
</GuideSection>
<GuideSection id="persistent-state" title="The objects that persist">
<p>{"Several objects are casually called a “run.” Keeping their lifetimes separate avoids a common misunderstanding: restarting a process is not the same as repeating an experiment."}</p>
<GuideTable caption="Persistent records and their lifetimes" headings={["Object", "Meaning", "Lifetime"]} rows={[
[<>{"Portfolio run"}</>,<>{"Frozen experiment configuration and continuing financial history"}</>,<>{"Survives service restarts and eligible operating renewals"}</>],
[<>{"Operating scope or authority"}</>,<>{"Exact workers, model/routing conditions, allowed operations, limits, dates and expiry"}</>,<>{"Finite; may finish, stop, expire or become held"}</>],
[<>{"Working group"}</>,<>{"Participants, shared evidence and discussion contributions"}</>,<>{"Retained even after its activity stops"}</>],
[<>{"Session cycle"}</>,<>{"Employee work for one selected market session"}</>,<>{"Can run under an existing valid operating scope; it is not necessarily a renewal"}</>],
[<>{"Loop plan"}</>,<>{"Scheduled stages for selected market sessions"}</>,<>{"Versioned; old plans remain historical"}</>],
[<>{"Occurrence"}</>,<>{"One stage on one session under one plan, such as October 15 research"}</>,<>{"Durable identity with due time, expiry, state and attempts"}</>],
[<>{"Execution"}</>,<>{"One admitted worker turn"}</>,<>{"One consumed attempt with status, settlement and usage"}</>],
[<>{"Proposal and review"}</>,<>{"Exact typed decision revision and independent disposition"}</>,<>{"Immutable evidence for that revision"}</>],
[<>{"Order, fill and valuation"}</>,<>{"Accepted instruction, simulated accounting effect and marked snapshot"}</>,<>{"Separate financial records"}</>],
[<>{"Publication receipt"}</>,<>{"Evidence that a particular public batch was accepted"}</>,<>{"Separate from all private execution and financial receipts"}</>]
]} />
<p>{"SQLite transactions serialize competing mutations. Stable identities and request receipts make repeat delivery distinguishable from a new action. The loop's generation and plan revision prevent an old callback from committing work after stop or replacement. These are familiar concurrency techniques applied to an LLM workflow."}</p>
<p>{"There is also an independently retained finite-authority ledger and checkpoint outside the ordinary HQ snapshot. Restoring an old application database must not restore spent provider allowance. The protection is against accidental rollback and replay within the trusted deployment model; it is not a claim that a privileged host administrator can never alter the system."}</p>
</GuideSection>
<GuideSection id="daily-schedule" title="What happens on a normal trading day">
<p>{"The following is the "}<strong>{"configured October 15 schedule"}</strong>{", shown in Vancouver time with UTC beside it. It is a schedule, not a claim that every stage completed. At the checkpoint, collection completed and research blocked; the later stages had not run. The calendar owns the actual exchange dates, holidays and early closes. Do not copy fixed UTC offsets into a year-round cron job."}</p>
<GuideTable caption="Configured October 15 schedule, not a completion record" headings={["Vancouver on October 15", "UTC", "Stage", "Work performed"]} rows={[
[<>{"4:45 a.m."}</>,<>{"11:45"}</>,<>{"Collect research"}</>,<>{"Obtain the approved historical daily-data requests for eight equities and SPY; normalize and share the bounded packet"}</>],
[<>{"5:00 a.m."}</>,<>{"12:00"}</>,<>{"Research window starts"}</>,<>{"Invoke eligible employee turns; develop, challenge and formalize a decision"}</>],
[<>{"6:00 a.m."}</>,<>{"13:00"}</>,<>{"Decision cutoff"}</>,<>{"Close the original decision/review/order window, 30 minutes before the regular open"}</>],
[<>{"6:30 a.m."}</>,<>{"13:30"}</>,<>{"Market opening reference"}</>,<>{"The future price event against which a timely precommitted paper order may later be modeled"}</>],
[<>{"1:00 p.m."}</>,<>{"20:00"}</>,<>{"Regular close"}</>,<>{"The session finishes; same-session daily evidence can subsequently be qualified"}</>],
[<>{"1:05 p.m."}</>,<>{"20:05"}</>,<>{"Collect close evidence"}</>,<>{"Obtain the bounded same-session daily bars and validate original OPEN/CLOSE fields"}</>],
[<>{"1:20 p.m."}</>,<>{"20:20"}</>,<>{"Paper accounting"}</>,<>{"Process eligible precommitted orders and applicable benchmark/accounting work"}</>],
[<>{"1:25 p.m."}</>,<>{"20:25"}</>,<>{"Mark the portfolio"}</>,<>{"Compute matched portfolio/benchmark valuation and queue approved public records"}</>],
[<>{"4:30 p.m."}</>,<>{"23:30"}</>,<>{"Order expiry"}</>,<>{"Expire remaining eligible pending orders under the configured rules"}</>],
[<>{"4:40 p.m."}</>,<>{"23:40"}</>,<>{"Authority ends"}</>,<>{"No new operation can rely on this operating allowance"}</>]
]} />
<p>{"The ordinary session has three kinds of work. "}<strong>{"Source work"}</strong>{" makes explicitly bounded market-data requests. "}<strong>{"Model work"}</strong>{" consumes employee invocations. "}<strong>{"Deterministic work"}</strong>{" performs validation, bookkeeping and publication without asking an LLM what to do. A scheduler wake-up is not itself a model call."}</p>
<p>{"Temporary capacity exhaustion can delay a never-started research occurrence while its original window remains valid. October 15 actually began at about 5:01 a.m. after the rolling-window capacity check. That wait preserves the same occurrence; it does not change the cutoff or refund previous calls."}</p>
<p>{"An investment-loop block prevents ordinary dispatch of its remaining stages. Some narrowly defined expiry or publication-drain behavior can still be separate; “paused” should not be read as “every process on the server has stopped.” Due timestamps alone are insufficient evidence of completion. Inspect each occurrence's actual state and receipt. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/control/investment-loop/service.ts">{"Scheduler implementation"}</a>{" · "}<a href="https://www.nyse.com/trade/hours-calendars">{"NYSE calendar and hours"}</a></p>
</GuideSection>
<GuideSection id="clocks" title="The clocks and the no-lookahead rule">
<p>{"The original method is named "}<code>{"inv-real-open-v1"}</code>{". Its unusual but important feature is delayed accounting: the decision is committed before the target opening, but the trusted daily OPEN reference is retrieved after that session closes. The system then records a modeled fill using the already committed order. It does not claim to have obtained an executable opening quote or placed a market order in real time."}</p>
<GuideTable caption="The clocks in a recorded decision" headings={["Clock", "Question it answers"]} rows={[
[<>{"Evidence cutoff / commitment time"}</>,<>{"What was the employee allowed to know when making this decision?"}</>],
[<>{"Market time"}</>,<>{"When did the price event being modeled occur?"}</>],
[<>{"Provider availability time"}</>,<>{"When did the provider make it available? This can be unknown."}</>],
[<>{"Retrieval time"}</>,<>{"When did the gateway actually obtain the evidence?"}</>],
[<>{"Ledger effective time"}</>,<>{"Which economic instant does the simulated posting represent?"}</>],
[<>{"Recorded time"}</>,<>{"When did trusted software append the accounting record?"}</>],
[<>{"Public receipt time"}</>,<>{"When did the website's receiver accept the published record?"}</>]
]} />
<p>{"Using a future price after an earlier committed decision is the experiment's convention. Making a new decision at 10 a.m. and selecting that same day's already-known opening price would introduce lookahead. The model would benefit from information that was unavailable at the purported decision time. A correct rerun must choose a still-future price event and disclose any method change."}</p>
<p>{"October 14 had an explicitly approved, session-specific exception: new decisions and orders had to be locked before 12:30 p.m. Vancouver, then could use that day's 1 p.m. regular close. The amendment retained the missed morning and all existing history. It applied to October 14 only. Its existence does not make every later afternoon an automatically authorized closing-price session."}</p>
<GuideFigure figure={figures["06-benchmark-evidence"]} />
</GuideSection>
<GuideSection id="market-evidence" title="What evidence the employees receive">
<p>{"The current scheduled research path uses Yahoo Finance through a controlled daily-chart adapter associated with the pinned "}<code>{"yfinance"}</code>{" integration. Each instrument has an exact approved request. Research requests cover a ten-calendar-day historical window; the compact group packet carries the latest three daily rows per instrument, their evidence identities and retrieval times. The normalized retained record can contain more rows than the compact packet."}</p>
<p>{"This is a bounded daily-price evidence packet. It is not proof of a comprehensive analyst research process across current news, filings, earnings calls and fundamentals. Broader research capabilities elsewhere in BotSquad do not automatically become part of this run."}</p>
<p>{"The employees receive explicit limitations. Historical availability and historical adjustment basis are not silently asserted. Historical bars can support reasoning, but they cannot be substituted for the qualified price reference used to execute a paper order. The gateway checks the session, instrument, currency, original numeric fields, regular-session timestamps, completeness and consistency before admitting a same-session reference."}</p>
<p>{"Request authority is recorded by exact hashes and consumed durably. An uncertain request is not blindly repeated. Provider-wide spacing, response-size and timeout bounds, denial handling and a source circuit limit the collection. Cached evidence may be reused only when its provenance and scope match; an arbitrary cached bar cannot satisfy a different session's request."}</p>
<p>{"The incremental market-data budget is US$0. The owner reports Yahoo confirmation for the personal, noncommercial research, simulation and publication project; that remains owner-reported rather than independently verified permission. Raw response bodies are transient. Normalized evidence, hashes, qualifications and original decision history form the retained audit record. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/control/investment-team/observed-investment.ts">{"Observed data path"}</a>{" · "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/domain/market/observed-paper.ts">{"Price qualification"}</a></p>
</GuideSection>
<GuideSection id="decision-workflow" title="From a conversation to an accepted paper decision">
<p>{"A sentence such as “we should hold cash” is a discussion contribution. It is not yet a formal HOLD. A sentence recommending a purchase is likewise not an order. Trade has a typed path that turns a reasoned proposal into an independently checked action."}</p>
<GuideFlow caption="The typed decision path" steps={[{"title": "Research and discussion", "body": "Workers consider evidence and alternatives before formalizing a proposal."}, {"title": "Atlas proposes an exact revision", "body": "paper_propose records a proposal and hash. The proposer execution must complete successfully, with no unresolved work, before independent review."}, {"title": "Maya reviews that exact proposal", "body": "paper_review approves or rejects the same revision. The reviewer execution must complete successfully, with no unresolved work, before submission."}, {"title": "Atlas submits the approved proposal and review", "body": "paper_submit binds the exact prior records and passes current authority, deadline and deterministic admission checks."}, {"title": "The outcome branches", "body": "A submitted HOLD creates no order. An admitted BUY or SELL creates a pending order."}, {"title": "Trusted accounting uses the qualified future price", "body": "A pending order may fill, be rejected or expire. Discussion and approval alone do not establish a fill."}]} />
<p><code>{"paper_inspect"}</code>{" exposes bounded current context and handoff identities. "}<code>{"paper_read_proposal"}</code>{" returns the exact proposal and related records. "}<code>{"paper_propose"}</code>{" requires an allowed author, scoped evidence, rationale, alternatives, risks and an invalidation condition. Observed proposals also carry separately designated public-summary fields. BUY/SELL proposals include a concrete order; HOLD has no order."}</p>
<p><code>{"paper_review"}</code>{" requires an eligible worker different from the proposer. The reviewer must have received the exact proposal, and the proposal's execution must have completed successfully, with no unresolved provider work. The review binds the proposal's full hash and revision, with an approve/reject disposition, rationale and dissent. Changing the proposal requires a new revision and review. Approval of an earlier version does not float forward."}</p>
<p><code>{"paper_submit"}</code>{" requires the exact approved review and successfully completed prior producing executions, with no unresolved provider work. Mere settlement of a failed or interrupted turn is insufficient. Trusted code checks current scope, occurrence, deadline, ledger version, risk inputs, cash or holdings, price guard and applicable operation limits. Model-written claims about an available balance or completed approval cannot replace those checks. Even after admission, a later price gap, missing data or failed risk check can prevent a fill."}</p>
<p>{"The discussion lifecycle also has opening, facilitation, synthesis, review and finalization turns. Paper tools can be called within an appropriate turn before its terminal discussion action. The typed proposal/review/submission chain needs at least three separately attributable executions from scratch. A fresh two-person final discussion cycle ordinarily needs six turns because of its surrounding lifecycle. The October 15 continuation needed four turns; it failed during its third. “One more model call” is therefore not interchangeable with “finish the workflow.” "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/control/investment-team/service.ts">{"Paper-tool implementation"}</a></p>
</GuideSection>
<GuideSection id="portfolio-accounting" title="How the simulated portfolio is calculated">
<p>{"Financial state is computed by trusted code using fixed-point decimal arithmetic, with six-decimal serialized money and quantity values and defined rounding. It is not parsed from the employee's natural-language answer. The ledger retains journal identity, ordering, previous/resulting state and provenance. Weighted-average cost basis, cash reservations, holdings, fees and realized results follow deterministic transitions."}</p>
<p><strong>{"Illustrative arithmetic only, not an actual Trade order:"}</strong>{" suppose a timely reviewed order buys 10 shares against a qualified raw opening reference of $100. With 10 basis points, or 0.1%, adverse buy slippage, the modeled fill price is $100.10. With zero commission, cost is $1,001 and cash falls from $100,000 to $98,999. At a later qualified $102 mark, the position is worth $1,020, total equity is $100,019, and unrealized profit is $19. The slippage is already in the fill price; subtracting it again would double-count it."}</p>
<p>{"The actual portfolio at the checkpoint has no such purchase. It remains $100,000 cash with no holdings. Its zero reported return belongs to the last complete October 14 valuation. It should not be read as a fresh October 15 valuation."}</p>
<p>{"Splits, dividends and corrections also need explicit evidence. A supported split preserves cost basis while changing units. A dividend may create a receivable; an unknown payment date does not create cash. Unsupported actions or missing marks can block accounting or produce incomplete valuation. Unknown value is represented as unavailable, not as a zero-price asset."}</p>
<GuideFigure figure={figures["04-portfolio-snapshot"]} />
<h3>{"The SPY benchmark is a separate book"}</h3>
<p>{"The benchmark provides a comparison, not a portfolio holding. Under the October 14 amendment it stayed in cash until the same regular close, then allocated to SPY. The recorded allocation is 129.925815 SPY units with $0.000178 residual cash; the UI rounds that residual to $0.00. Benchmark allocation uses zero slippage and fees, while portfolio trades use the configured 10 basis points of adverse slippage. This is a cash-then-SPY comparator, not full-period SPY buy-and-hold and not the S&P 500 index itself."}</p>
<p>{"Portfolio and benchmark returns use matched valuations and the same initial capital. Excess return is the percentage-point difference between their returns. It is not automatically alpha. Drawdown compares equity with its prior peak; missing observations should remain visible gaps. A short history of cash and one benchmark allocation cannot establish investment skill. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/docs/experiments/investment/SIMULATION_RULES.md">{"Accounting and simulation rules"}</a></p>
</GuideSection>
<GuideSection id="publication" title="How private work becomes a public record">
<p>{"The HQ keeps private conversations, original evidence, proposals, reviews and operational records. A separate projection prepares the public fields permitted by an owner grant. The observed path uses designated employee thesis/review summaries and typed financial events; it does not copy the private transcript wholesale."}</p>
<p>{"A durable outbox sends signed, ordered batches to the isolated Asymmetri receiver. The receiver checks the allowed publisher, schema, scope, integrity and sequence and returns a receipt. Accepted records enter a public archive. The website renders that archive through bounded read-only interfaces; it does not query arbitrary private HQ tables."}</p>
<p>{"This is a distributed-systems boundary. If delivery is retried, exact identities and receipts let the system recognize the same batch. A missing response is not permission to invent a new event or silently skip a sequence. Publisher restart and receiver generation must reconcile. A valid signature authenticates the configured publisher key and signed bytes; it does not independently establish model authorship, a sound thesis or a correct external source."}</p>
<p>{"The visible desk polls a bounded record window. Its refresh button reloads public data; it does not ask Atlas to think again. Publisher heartbeats can continue while the investment loop is blocked, so recent contact is compatible with an old valuation. Source-event sequence and portfolio-journal sequence count different streams and need not be equal."}</p>
<p>{"At this checkpoint, genuine private employee turns exist but no public contributions or decisions are displayed. The missing committed review prevents the exact proposal/review pair from producing public summaries. Those paired summaries require successfully completed producing executions; submission is not itself a prerequisite for publishing the pair. Financial events have their own typed source records. Empty sections must remain empty rather than being filled with invented conversation. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/contracts/investment/v1/PROTOCOL.md">{"Public protocol"}</a>{" · "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/control/publication/observed-source.ts">{"Observed public projection"}</a></p>
<GuideFigure figure={figures["05-transaction-journal"]} />
</GuideSection>
<GuideSection id="budgets" title="Why finite budgets and usage records matter">
<p>{"Simulated capital and real AI resource consumption are different accounts. The $100,000 paper balance cannot pay for inference. The selected model policy permits a bounded number of actual invocations under a particular approved profile and account/routing context. The application records attempts before provider work so a crash or local rollback cannot make a call appear unspent."}</p>
<GuideTable caption="Selected finite operating limits" headings={["Selected control", "Limit or meaning"]} rows={[
[<>{"Original aggregate ceiling"}</>,<>{"16 calls"}</>],
[<>{"Recovery-family ceiling"}</>,<>{"11 calls across the original and successor authorities; this stricter ceiling currently controls"}</>],
[<>{"Calls consumed at checkpoint"}</>,<>{"10; failed/incomplete attempts remain consumed"}</>],
[<>{"Calendar-day limit"}</>,<>{"8 calls per New York day"}</>],
[<>{"Rolling-window limit"}</>,<>{"8 calls over the preceding 24 hours, independent of midnight"}</>],
[<>{"Cycle limit"}</>,<>{"7 calls"}</>],
[<>{"Per-worker limit"}</>,<>{"12 calls"}</>],
[<>{"Investment concurrency"}</>,<>{"1 active investment turn; the shared dispatcher has separate global capacity"}</>],
[<>{"Local duration"}</>,<>{"300 seconds per invocation; local interruption cannot guarantee an upstream billing cutoff"}</>]
]} />
<p>{"These limits are ceilings, not a plan to spend every available call. The planner reserves room for later review and finalization, so it may reject a new discussion turn even when a raw counter is below its maximum. Reaching midnight does not reset a rolling 24-hour counter. A new scope does not automatically refill a lineage's allowance."}</p>
<p>{"One invocation can contain multiple provider responses and tool interactions. A terminal runtime event tells the application something about completion, but complete usage accounting requires the corresponding authoritative response measurements. "}<strong>{"Settlement and telemetry completeness are separate flags."}</strong>{" A turn can be settled while its required usage data is incomplete. Missing usage must not be reported as zero."}</p>
<p>{"API-equivalent reference cost, where available, is also separate from actual subscription charges or purchased-credit deductions. The current controls bound local activity; they do not create an exact dollar billing ceiling or prove that provider-managed work stops immediately when the local process is interrupted."}</p>
<p>{"Conceptually, admission follows this sequence:"}</p>
<GuideFlow caption="Admission and settlement" steps={[{"title": "Check eligibility", "body": "Verify current authority, time window, identity and unresolved outcomes."}, {"title": "Reserve the attempt", "body": "Durably consume a one-use attempt and reserve required capacity."}, {"title": "Invoke the worker", "body": "Provide permitted scoped tools and evidence."}, {"title": "Collect distinct outcomes", "body": "Retain output, provider settlement and usage evidence separately."}, {"title": "Preserve consumption", "body": "The attempt remains consumed in every outcome."}, {"title": "Evaluate the next stage", "body": "Continue only if that stage’s own guards still pass."}]} />
<p><a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/control/usage/finite-hq.ts">{"Finite usage implementation"}</a>{" · "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/docs/operations/AI_USAGE.md">{"Usage semantics"}</a></p>
</GuideSection>
<GuideSection id="recovery" title="What pause, restart and rerun actually mean">
<p>{"“Rerun” can mean several operations with very different effects."}</p>
<GuideTable caption="Different meanings of restart and rerun" headings={["Operation", "Meaning and consequence"]} rows={[
[<>{"Refresh the website"}</>,<>{"Read the accepted public archive again; no model invocation"}</>],
[<>{"Recompute a ledger from retained inputs"}</>,<>{"Deterministic verification of recorded history; not a fresh investment decision"}</>],
[<>{"Retry an idempotent request"}</>,<>{"Return the existing receipt for the same action when its outcome is known"}</>],
[<>{"Restart the service"}</>,<>{"Replace an OS process while preserving state; recovery checks still apply"}</>],
[<>{"Resume an investment loop"}</>,<>{"Continue only eligible future work under still-valid authority"}</>],
[<>{"Repeat an LLM turn"}</>,<>{"A new invocation that can produce a different answer and consumes allowance"}</>],
[<>{"Create or renew an operating scope"}</>,<>{"New bounded authority, future windows and eligible evidence; retained portfolio and consumption stay intact"}</>],
[<>{"Start a different experiment"}</>,<>{"A visibly distinct configuration/history, not a way to hide failure in the existing run"}</>]
]} />
<p>{"Global model pause, investment-loop pause, a runtime interrupt and publication pause are also distinct controls. Stopping new model dispatch does not undo completed accounting. Interrupting a process does not establish that an external request never happened. Investment pause/stop affects pending scoped work and orders; completed effects remain history. Ordinary resume does not resurrect cancelled orders or elapsed windows."}</p>
<h3>{"What prevented an immediate October 15 rerun"}</h3>
<p>{"Four conditions overlapped. First, the family had used 10 of its 11 calls, leaving too little for independent review plus submission. Second, the failed review introduced another incomplete usage record. Third, the original morning cutoff had passed. Fourth, the implemented recovery exception allowed one specifically bound successor accepting one exact old telemetry gap. Its close-method amendment applied only to October 14, while its authority retained the original October 15 schedule. It was not a general-purpose “start another cycle now” mechanism."}</p>
<p>{"These conditions have different origins. Avoiding a decision at an already-known favorable price protects experimental validity. Call ceilings and incomplete-usage holds are chosen operational policies. The single-date recovery path is an implementation limitation. None means an LLM is inherently unable to analyze the same research again."}</p>
<p>{"A supported fresh-cycle operation would have to carry forward the portfolio, historical attempts and unresolved records; verify no active or uncertain provider work; obtain a concrete new allowance and future schedule; and record any method amendment before the selected price event. The deployed application does not yet implement that general recovery operation for this two-gap state. Editing a timestamp, clearing a hold flag or deleting usage rows would hide the problem rather than provide that operation. "}<a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/docs/decisions/decision_052_retained_research_close_recovery.md">{"Exact existing recovery boundary"}</a></p>
</GuideSection>
<GuideSection id="actual-outcomes" title="What actually happened on October 14 and 15">
<p>{"The history is useful because it separates genuine model behavior from application defects and accounting outcomes."}</p>
<GuideTable caption="Observed October 14 and 15 outcomes" headings={["Vancouver time", "Actual result", "What it establishes"]} rows={[
[<>{"October 14, 4:45 a.m. onward"}</>,<>{"Nine historical research requests completed"}</>,<>{"Real bounded source collection"}</>],
[<>{"October 14, about 5:00 to 5:02 a.m."}</>,<>{"Four genuine employee turns; the fourth lacked required complete usage telemetry"}</>,<>{"Genuine discussion and a retained usage hold; no formal decision"}</>],
[<>{"October 14, about 10:06 to 10:08 a.m."}</>,<>{"Three genuine turns under the one-time close recovery"}</>,<>{"Further discussion and provisional HOLD reasoning; no formal proposal or submission"}</>],
[<>{"October 14, 12:30 p.m."}</>,<>{"Close-method decision deadline elapsed without an order"}</>,<>{"No retrospective trade may be manufactured"}</>],
[<>{"October 14, 1:05 to 1:25 p.m."}</>,<>{"Nine close requests, benchmark allocation and complete valuation"}</>,<>{"Working source/accounting/publication path; portfolio still all cash"}</>],
[<>{"October 15, about 5:01 to 5:03 a.m."}</>,<>{"Two Atlas turns, then Maya review attempt"}</>,<>{"A genuine HOLD proposal was created; independent review did not commit"}</>],
[<>{"October 15, 10:25 a.m."}</>,<>{"Review-clock/runtime correction deployed and preservation checked"}</>,<>{"Prevention fix installed; no new model run or historical repair"}</>]
]} />
<p>{"The October 15 review failure was an application clock defect. The facade created "}<code>{"reviewedAt"}</code>{", then the journal sampled a slightly later "}<code>{"recordedAt"}</code>{". The reducer required exact equality, so a valid review request was rejected. Frozen test clocks had hidden the discrepancy. The repair uses one trusted timestamp for the review and its journal entry while retaining live deadline checks."}</p>
<p>{"A second defect mislabeled any bounded tool callback failure as an unavailable approval request. That produced an "}<code>{"awaiting_approval"}</code>{" label even though no genuine permission request occurred. The adapter now reports the actual tool failure. The original execution and its incomplete usage record remain retained; deploying better code does not retroactively complete that turn."}</p>
<p>{"At the checkpoint there are 27 collected instrument/request records: nine October 14 research captures, nine October 14 close captures and nine October 15 research captures. There are ten employee executions, one proposal, zero committed reviews and zero submissions. The portfolio has no discretionary trades. The last complete public valuation is still October 14. The end-to-end genuine proposal → approved review → submission → possible fill path remains unproven, even though its authored regression tests pass."}</p>
<GuideFigure figure={figures["02-run-status"]} />
<p><a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/docs/audits/2026-10-14/INVESTMENT-WORKFLOW-AUDIT.md">{"October 14 workflow evidence"}</a>{" · "}<a href="https://github.com/eugenelin89/bot_messenger/pull/102">{"Review-clock repair"}</a></p>
</GuideSection>
<GuideSection id="reading-the-site" title="How to read the website and operate a day">
<p>{"For a public reader, start with "}<strong>{"run state, snapshot quality and as-of time"}</strong>{". They answer different questions: whether work is authorized to proceed, whether a snapshot has sufficient inputs, and which market instant it describes. Then follow the decision and exact evidence links rather than inferring a trade from a discussion or a flat chart."}</p>
<p>{"The roster establishes who participates. The desk shows only published contributions in its loaded window. Decisions distinguish recommendations, reviews and accepted outcomes. Research links show registered public deliverables. The portfolio shows typed snapshots. The journal shows portfolio financial effects. Exact records preserve versions, timestamps, supporting links and public receipts. The methodology page binds those records to their original method and session amendments."}</p>
<p>{"An owner reviewing a day has a broader private view. Before a scheduled window, the owner verifies the selected dates, active authority, remaining capacity, account/profile eligibility, source permissions, prior settlement and publication health. During the research window, the owner checks actual occurrence and execution states, not just whether the service responds. After cutoff, the owner distinguishes a submitted HOLD, a rejected proposal, an admitted pending order and no submitted decision. After close, the owner reconciles source qualification, ledger results, valuation quality and receiver receipts. Before a later operating epoch, the owner verifies preservation and eligibility instead of assuming tomorrow is automatically authorized."}</p>
<p>{"In a healthy authorized scope, those scheduled stages run without manual clicking each morning. Owner attention is needed when a finite scope ends, a policy changes, evidence is incomplete or a failure requires a reviewed recovery. At the present checkpoint, the loop needs that intervention; this is not a claim of reliable unattended daily trading."}</p>
<p>{"A practical debugging order is: "}<strong>{"service health → current authority → occurrence → execution/settlement/usage → proposal/review/submission → source/ledger → outbox/receiver → public rendering"}</strong>{". Each step has its own evidence. A green HTTP health check proves much less than a completed investment cycle."}</p>
</GuideSection>
<GuideSection id="current-limits" title="What is proven and what remains limited">
<GuideTable caption="Evidence and limits at the October 15 checkpoint" headings={["Area", "Evidence at the checkpoint"]} rows={[
[<>{"Persistent HQ and genuine workers"}</>,<>{"Deployed; real research turns and retained execution history"}</>],
[<>{"Scheduled source collection"}</>,<>{"Genuine morning and October 14 close records"}</>],
[<>{"Formal employee workflow"}</>,<>{"October 15 proposal exists; genuine approved-review/submission chain incomplete"}</>],
[<>{"Paper accounting and benchmark"}</>,<>{"October 14 benchmark allocation and complete cash-only portfolio valuation reconciled"}</>],
[<>{"Public publication"}</>,<>{"Accepted records, exact evidence pages and retained history visible"}</>],
[<>{"Reliability fixes"}</>,<>{"Timestamp and error-classification fixes deployed; advancing-clock and focused Linux regressions pass"}</>],
[<>{"Autonomous daily completion"}</>,<>{"Not established; current finite loop blocked"}</>],
[<>{"Investment effectiveness"}</>,<>{"No portfolio trades or meaningful return history to evaluate"}</>],
[<>{"General repeat-recovery support"}</>,<>{"Not implemented for the current two-gap state"}</>],
[<>{"Data breadth and finality"}</>,<>{"Daily-price evidence is narrow; retained qualification does not independently prove the vendor will never revise a bar"}</>],
[<>{"Public Ask"}</>,<>{"Disabled; no visitor-to-employee service claimed"}</>]
]} />
<p>{"Testing proves particular properties under its inputs. Fixture tests can verify rounding, stale-review rejection, cutoff enforcement and replay behavior. Genuine runtime receipts establish that actual employees were invoked. Source receipts establish real data collection. Accounting and public receipts establish later transitions. None can substitute for all the others."}</p>
</GuideSection>
<GuideSection id="glossary" title="Glossary and implementation map">
<dl className="guide-glossary"><div><dt>{"Authority"}</dt><dd>{"A trusted, finite permission envelope; prose from a worker cannot enlarge it"}</dd></div><div><dt>{"Scope"}</dt><dd>{"The exact run, group, people, tools and bounds to which work belongs"}</dd></div><div><dt>{"Occurrence"}</dt><dd>{"One durable scheduled stage, with identity, due time and expiry"}</dd></div><div><dt>{"Invocation / execution"}</dt><dd>{"One admitted model turn, not one token or one tool call"}</dd></div><div><dt>{"Settlement"}</dt><dd>{"Trusted evidence about the provider turn's terminal outcome"}</dd></div><div><dt>{"Usage completeness"}</dt><dd>{"Whether required authoritative usage measurements were captured"}</dd></div><div><dt>{"Idempotency"}</dt><dd>{"Recognizing a repeated request as the same action and retaining its original receipt"}</dd></div><div><dt>{"Generation"}</dt><dd>{"A version used to reject callbacks belonging to replaced or stopped work"}</dd></div><div><dt>{"Proposal hash"}</dt><dd>{"Integrity binding over the exact proposal that a reviewer must assess"}</dd></div><div><dt>{"Paper fill"}</dt><dd>{"A modeled financial effect using a qualified reference and frozen rules"}</dd></div><div><dt>{"Mark / valuation"}</dt><dd>{"Pricing the current book at a particular market as-of time"}</dd></div><div><dt>{"Outbox"}</dt><dd>{"Durable pending publication jobs, separate from financial execution"}</dd></div><div><dt>{"Watermark"}</dt><dd>{"A cursor describing how far a record stream has been accepted"}</dd></div><div><dt>{"Projection"}</dt><dd>{"A deliberately selected public representation of private source records"}</dd></div><div><dt>{"Fail closed"}</dt><dd>{"Refuse further guarded work when required authority or evidence is missing"}</dd></div><div><dt>{"No lookahead"}</dt><dd>{"A decision must not benefit from information unavailable at its committed time"}</dd></div></dl>
<p>{"Readers who want to connect the explanation to code can start with these implementation areas. The HQ references are pinned to the deployed review-clock repair, so later source changes do not silently change this guide's technical basis."}</p>
<GuideTable caption="Implementation source map" headings={["Topic", "Source"]} rows={[
[<>{"Persistent observed configuration and collection"}</>,<><a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/control/investment-team/observed-investment.ts">{"observed-investment.ts"}</a></>],
[<>{"Scheduling, admission and stage transitions"}</>,<><a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/control/investment-loop/service.ts">{"investment-loop/service.ts"}</a></>],
[<>{"Scoped paper tools and exact review"}</>,<><a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/control/investment-team/service.ts">{"investment-team/service.ts"}</a></>],
[<>{"Runtime failure and usage handling"}</>,<><a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/runtime/codex.ts">{"runtime/codex.ts"}</a></>],
[<>{"Price qualification"}</>,<><a href="https://github.com/eugenelin89/bot_messenger/blob/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/domain/market/observed-paper.ts">{"market/observed-paper.ts"}</a></>],
[<>{"Deterministic accounting"}</>,<><a href="https://github.com/eugenelin89/bot_messenger/tree/139a1c537d759e4c88edbc628fab14bd1d4e6a51/src/domain/investment">{"domain/investment"}</a></>],
[<>{"Canonical public contract"}</>,<><a href="https://github.com/eugenelin89/bot_messenger/tree/139a1c537d759e4c88edbc628fab14bd1d4e6a51/contracts/investment/v1">{"contracts/investment/v1"}</a></>],
[<>{"Website receiver and archive"}</>,<><a href="https://github.com/eugenelin89/asymmetri/tree/main/receiver">{"Asymmetri receiver"}</a></>]
]} />
<p>{"The experiment becomes convincing through a sustained, inspectable sequence of genuine decisions, independent reviews, valid accounting and candid failures. Its present value is an observable engineering experiment. Its current record supports that narrower description, not a claim that an AI team has already demonstrated profitable or reliable daily trading."}</p>
</GuideSection>
</>;
}
