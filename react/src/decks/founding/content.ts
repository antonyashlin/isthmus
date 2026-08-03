/**
 * Founding-partner deck — third build (2026-08-02).
 *
 * Content is data. Nothing in `slides.tsx` inlines a number or a sentence, so
 * the whole argument can be read, reviewed and corrected here without touching
 * a component. Rewritten from the "Founding Deck Content + Visual Blueprint
 * v2" brief: identity -> market problem -> operating solution -> capability
 * scope -> commercial wedge -> defensibility -> delivery economics -> proof ->
 * expansion -> roadmap -> risks -> partnership decision -> close.
 *
 * PROVENANCE IS MANDATORY. Every datum carries a `source`:
 *   - a real citation string  -> renders as a source note under the frame
 *   - `ILLUSTRATIVE`          -> renders a visible "illustrative — not sourced"
 *                                band on the slide
 * A figure without provenance cannot be expressed in this file — a plausible
 * fabricated number in an investor document is the worst failure this deck
 * can produce. Per the blueprint's own data notes, most figures on the newer
 * slides (chord reuse weights, the market-sizing bands, the delivery-mix
 * stack, the production calendar, the risk matrix, every roadmap KPI and
 * every partnership term) are marked illustrative or left `TBD` — they are
 * management targets and frameworks, not reported history.
 */

export const ILLUSTRATIVE = "ILLUSTRATIVE" as const;
export type Source = string | typeof ILLUSTRATIVE;

export const isIllustrative = (s: Source): boolean => s === ILLUSTRATIVE;

export const TBD = null;
export type Figure = number | typeof TBD;

/* ---------------------------------------------------------------- deck meta */

export const DECK = {
  name: "Isthmus Meridian",
  proposition: "The private-markets back office,",
  propositionAccent: "built to think like the investment team.",
  subhead: "Tech-enabled execution across deals, funds, portfolios and investors.",
  meta: [
    { label: "Firm", body: "Isthmus Meridian" },
    { label: "Model", body: "Domain experts + governed technology" },
    { label: "Stage", body: "Founding partnership discussion" },
  ],
  /** The cover's quiet circular graph — eight workstreams orbiting the operating
   *  layer. `live` marks the three currently in production (brighter path). */
  orbit: [
    { key: "sourcing", label: "Sourcing", live: false },
    { key: "diligence", label: "Diligence", live: false },
    { key: "modeling", label: "Modeling", live: true },
    { key: "ic", label: "IC materials", live: false },
    { key: "fundops", label: "Fund ops", live: true },
    { key: "monitoring", label: "Monitoring", live: true },
    { key: "capital", label: "Capital formation", live: false },
    { key: "data", label: "Data & AI", live: false },
  ],
};

/* --------------------------------------------------------- II · what we are */

export const IDENTITY = {
  eyebrow: "WHAT WE ARE",
  title: "One operating layer",
  titleAccent: "from deal pipeline to LP reporting.",
  desc:
    "Isthmus Meridian combines embedded private-markets professionals with a governed workflow, data and automation platform. We execute recurring, high-stakes work; the client retains judgment, approvals and investment authority.",
  pillars: [
    { label: "Embedded expertise", body: "Analysts and operators who understand private-equity, venture and growth workflows." },
    { label: "Managed execution", body: "Named owners, service levels, review gates and an auditable delivery process." },
    { label: "Shared data layer", body: "Reusable company, fund, portfolio and investor data instead of repeated spreadsheet reconstruction." },
    { label: "Progressive automation", body: "AI-assisted drafting, extraction, reconciliation and monitoring, always paired with human review." },
  ],
  /** Sunburst, innermost ring first. */
  layers: [
    { key: "data", label: "Shared data foundation" },
    { key: "workflow", label: "Workflow + automation engine" },
    { key: "delivery", label: "Domain-expert delivery" },
    { key: "client", label: "Client decisions + approvals" },
  ],
  ring: ["Source", "Underwrite", "Invest", "Monitor", "Report", "Raise"],
  ownership: {
    isthmus: "What Isthmus owns: execution, quality control, process improvement.",
    client: "What the client owns: investment judgment, fiduciary decisions, approvals.",
  },
};

/* -------------------------------------------------------------- III · the gap */

export const GAP = {
  eyebrow: "THE GAP",
  title: "Private-market assets scaled.",
  titleAccent: "Operating capacity did not.",
  desc:
    "Global private-capital AUM reached approximately $13.4T by mid-2023. Yet many managers still rebuild critical work across spreadsheets, inboxes, point tools and a small number of overloaded specialists.",
  years: [2015, 2021, 2023],
  series: {
    aum: { label: "Global private-capital AUM", values: [4, 9.3, 13.43] },
  },
  source:
    "Preqin — North America private capital AUM (June 2023) and Preqin's 2015–2021 global private-capital AUM forecast, via S&P Global. “Roughly tripled” follows Preqin's published series; exact annual scope definitions may differ year to year.",
  friction: [
    { label: "Deal teams", body: "Data-room extraction, model updates, IC formatting." },
    { label: "Finance & operations", body: "Fragmented fund, portfolio and investor data." },
    { label: "Investor relations", body: "Rebuilds LP materials every cycle." },
    { label: "Leadership", body: "Key-person risk, no operating system." },
  ],
};

/* ------------------------------------------------------------- IV · what we do */

export const FUNCTIONS = {
  eyebrow: "WHAT WE DO",
  title: "Eight workstreams.",
  titleAccent: "One accountable operating partner.",
  desc:
    "Begin with one urgent workflow and expand without adding another vendor, data model or review process.",
  stages: ["Source", "Underwrite", "Invest", "Operate", "Report", "Raise"],
  items: [
    { n: "01", label: "Sourcing + market intelligence", outputs: "Target screens; market maps; research; CRM and pipeline hygiene", stage: 0, live: false, tag: null },
    { n: "02", label: "Due diligence", outputs: "Data-room review; trackers; commercial workstreams; red-flag synthesis", stage: 1, live: false, tag: null },
    { n: "03", label: "Modeling + valuation", outputs: "Operating and returns models; comps; sensitivities; valuation updates", stage: 1, live: true, tag: "FLAGSHIP" },
    { n: "04", label: "IC + investor materials", outputs: "Investment memos; committee decks; decision logs; investor presentations", stage: 2, live: false, tag: null },
    { n: "05", label: "Fund + investment operations", outputs: "Closing checklists; capital activity; cash-flow schedules; administrator coordination", stage: 3, live: true, tag: null },
    { n: "06", label: "Portfolio monitoring + LP reporting", outputs: "KPI packs; performance monitoring; quarterly reports; LP data requests", stage: 4, live: true, tag: null },
    { n: "07", label: "Capital formation", outputs: "Track records; DDQ/RFP support; data rooms; fundraising pipeline", stage: 5, live: false, tag: null },
    { n: "08", label: "Data operations, AI + automation", outputs: "Data models; integrations; workflow automation; fund-history copilot; controls", stage: null, live: false, tag: "DIFFERENTIATOR" },
  ],
  aiNote:
    "AI enablement: permission-aware search across prior deals and fund materials; precedent comparison; longitudinal founder/team tracking; fund-style drafting; evidence-linked, human-reviewed outputs.",
};

/* --------------------------------------------------- V · how we stack up · moat */

export const MOAT = {
  eyebrow: "HOW WE STACK UP · THE MOAT",
  title: "The moat compounds",
  titleAccent: "inside the work.",
  desc:
    "Every completed mandate strengthens the templates, controls, data model and automation used on the next one — while the human review layer captures exceptions that generic tools do not see.",
  pillars: [
    { label: "Workflow depth", body: "End-to-end process knowledge, including handoffs, approvals, edge cases and client-specific standards." },
    { label: "Proprietary operating data", body: "Structured execution data, exception patterns and reusable fund/portfolio context generated through delivery." },
    { label: "Embedded trust", body: "Recurring workflows, institutional memory and responsibility for client-ready outputs create durable relationships." },
    { label: "Quality system", body: "Expert review, checklists, audit trails and feedback loops improve accuracy while defining what can safely automate." },
  ],
  flywheel: [
    "Expert execution",
    "Structured workflow",
    "Reusable operating data",
    "Safe automation",
    "Faster, more consistent delivery",
  ],
  /** Chord diagram — data reuse across the workflow. Illustrative weights. */
  reuse: {
    nodes: ["Sourcing", "Diligence", "IC", "Monitoring", "LP reporting", "Fundraising"],
    edges: [
      { source: "Sourcing", target: "Diligence", value: 8 },
      { source: "Diligence", target: "IC", value: 9 },
      { source: "IC", target: "Monitoring", value: 6 },
      { source: "Monitoring", target: "LP reporting", value: 9 },
      { source: "Diligence", target: "LP reporting", value: 5 },
      { source: "LP reporting", target: "Fundraising", value: 7 },
      { source: "Sourcing", target: "Fundraising", value: 4 },
      { source: "IC", target: "LP reporting", value: 6 },
      { source: "Diligence", target: "Monitoring", value: 5 },
    ],
    source: ILLUSTRATIVE,
  },
  compare: {
    columns: ["Point software", "BPO / staffing", "Isthmus"],
    rows: [
      { label: "Outcome ownership", values: ["no", "partial", "yes"] },
      { label: "Domain experts embedded", values: ["no", "yes", "yes"] },
      { label: "Compounding workflow IP", values: ["no", "no", "yes"] },
      { label: "Reusable operating data", values: ["no", "no", "yes"] },
    ] as Array<{ label: string; values: ["no" | "partial" | "yes", "no" | "partial" | "yes", "no" | "partial" | "yes"] }>,
    source: "Comparative framework — our own assessment of category attributes, not a benchmarked index.",
  },
  footnote:
    "The moat is not that we can read documents with AI. It is that we see the complete workflow from inputs to approved output, including every exception and review step. That execution context becomes proprietary operating knowledge.",
};

/* ---------------------------------------------------------- VI · commercial wedge */

export const WEDGE = {
  eyebrow: "COMMERCIAL WEDGE",
  title: "A large existing spend pool —",
  titleAccent: "fragmented across payroll, advisers, administrators and software.",
  desc:
    "Isthmus does not require a new budget category. It consolidates work that managers already fund through internal analysts and operators, specialist contractors, fund-administrator add-ons and disconnected point solutions.",
  beachhead: "Emerging and mid-market managers with institutional expectations but no fully built operating platform.",
  triggers: "New fund, first institutional LP, deal-flow growth, portfolio expansion or an operating-control gap.",
  landExpand: "Baseline one visible recurring workflow, then add adjacent work that reuses the same data and review system.",
  /** Three concentric bands, illustrative relative proportions — a market-sizing
   *  framework, not a TAM, until a validated account list and pricing exist. */
  bands: [
    { key: "beachhead", label: "Beachhead accounts", value: 1 },
    { key: "serviceable", label: "Serviceable manager segments", value: 4 },
    { key: "universe", label: "Broader private-markets universe", value: 12 },
  ],
  spendPools: [
    { label: "Internal headcount", body: "Already on payroll, doing this work." },
    { label: "Specialist advisers", body: "Contractors, per deal or cycle." },
    { label: "Administrator add-ons", body: "Fund admins' bolt-on modules." },
    { label: "Point software", body: "Another interface, not an outcome." },
  ],
  source: ILLUSTRATIVE,
};

/* ---------------------------------------------------------------- VII · the model */

export const MODEL = {
  eyebrow: "THE MODEL",
  title: "Land with expert-led delivery.",
  titleAccent: "Scale with software economics.",
  desc:
    "The delivery model progresses in three stages. Revenue begins before full automation; margin, speed and consistency improve as repeatable work is standardized and automated.",
  stages: [
    { n: "1", label: "Embed", body: "Experts run the workflow, establish the baseline, document decisions and own the output." },
    { n: "2", label: "Standardize", body: "Common inputs, templates, controls, SLAs and exception categories become a repeatable operating product." },
    { n: "3", label: "Automate", body: "Extraction, reconciliation, drafting, monitoring and routing are automated where confidence and controls permit." },
  ],
  commercialModel: "Core retainer / platform fee + recurring workflow modules + scoped transaction or transformation work.",
  /** Stacked-area delivery mix, % of hours by category at each stage checkpoint. */
  mix: {
    categories: ["Expert judgment", "Analyst production", "Workflow automation", "Pure software execution"],
    checkpoints: ["Embed", "Standardize", "Automate"],
    series: [
      [70, 25, 5, 0],
      [40, 35, 20, 5],
      [15, 20, 40, 25],
    ],
  },
  source: "Management target — modeled from the automation cadence in the roadmap, not AND Capital's actual revenue or delivery cost. Updates once real monthly data is available.",
};

/* ------------------------------------------------------------- VIII · where we are */

/* ---------------------------------------- IX · go-to-market + operating footprint */

export const GTM = {
  eyebrow: "GO-TO-MARKET + OPERATING FOOTPRINT",
  title: "One anchor proves the system.",
  titleAccent: "Each fund expands the advantage.",
  desc:
    "Commercial expansion leads with design-partner credibility and relationship-led selling into managers with the same workflow pain. Footprint follows customer, talent and capital — not the other way round.",
  expansion: {
    root: "Customer zero",
    archetypes: ["Emerging PE", "Venture", "Growth", "Multi-strategy"],
    anchors: ["Fund 2", "Fund 3", "Fund 4"],
    source: ILLUSTRATIVE,
  },
  nodes: [
    { key: "calgary", label: "Calgary", note: "Initial client · operating base", coord: [-114.07, 51.05], kind: "client" },
    { key: "delaware", label: "Delaware", note: "Parent · IP · contracting", coord: [-75.53, 39.16], kind: "parent" },
    { key: "london", label: "London", note: "Capital · ecosystem access", coord: [-0.13, 51.51], kind: "client" },
    { key: "difc", label: "Dubai", note: "Gulf clients · regional delivery", coord: [55.28, 25.2], kind: "hub" },
  ],
  routes: [
    ["calgary", "delaware"],
    ["london", "delaware"],
    ["delaware", "difc"],
  ],
  legend: [
    { kind: "parent", label: "Parent entity" },
    { kind: "hub", label: "Client-facing entity" },
    { kind: "client", label: "Capital & clients" },
  ],
  caption:
    "Schematic. Node placement is geographic; route curvature is not. Legal, tax, regulatory and data-residency design requires counsel before any structure is final.",
};

/* -------------------------------------------------------- X · 18-month plan */

export const ROADMAP = {
  eyebrow: "18-MONTH PLAN",
  title: "Eighteen months",
  titleAccent: "to a repeatable second fund.",
  desc:
    "The roadmap proves four things in sequence: the company is formed, the first workflows are measurable, delivery expands without linear headcount, and a second anchor adopts the model.",
  phases: [
    { at: "M0–M3", label: "Instrument", body: "Close the founding structure; baseline current workflows; automate the first two repeatable steps; define security and QA controls." },
    { at: "M4–M6", label: "Productize", body: "Standardize intake, templates, data model, review gates and SLA reporting; establish the Gulf entity only if commercially required." },
    { at: "M7–M12", label: "Expand", body: "Move five workstreams into stable production; demonstrate improving unit economics; build a qualified anchor-fund pipeline." },
    { at: "M13–M18", label: "Replicate", body: "Deploy the core operating layer for a second anchor; document implementation time, quality and gross-margin performance." },
  ],
  months: ["M0", "M3", "M6", "M9", "M12", "M15", "M18"],
  /** Gantt rows — one per workstream. Each `start` is a month-index (into
   *  `months`) marking when Baseline / Standardize / Production / Automate
   *  begins for that row. Proposed target dates, not a reported schedule. */
  gantt: [
    { label: "Sourcing + market intel", start: [0, 3, 9, 15] },
    { label: "Due diligence", start: [0, 3, 9, 15] },
    { label: "Modeling + valuation", start: [0, 0, 3, 9] },
    { label: "IC + investor materials", start: [0, 3, 6, 12] },
    { label: "Fund + investment ops", start: [0, 0, 6, 12] },
    { label: "Portfolio & LP reporting", start: [0, 0, 3, 9] },
    { label: "Capital formation", start: [0, 6, 12, 18] },
    { label: "Data ops, AI + automation", start: [0, 3, 9, 12] },
  ],
  milestones: [
    { at: "M0", label: "Delaware C corp incorporated" },
    { at: "M3", label: "First two workflows automated" },
    { at: "M6", label: "DIFC entity live" },
    { at: "M18", label: "Second anchor fund signed" },
  ],
  kpis: [
    { label: "Automation coverage", from: TBD as Figure, m6: TBD as Figure, m18: TBD as Figure },
    { label: "Turnaround", from: TBD as Figure, m6: TBD as Figure, m18: TBD as Figure },
    { label: "First-pass acceptance", from: TBD as Figure, m6: TBD as Figure, m18: TBD as Figure },
    { label: "Gross margin", from: TBD as Figure, m6: TBD as Figure, m18: TBD as Figure },
  ],
  source:
    "Proposed roadmap — target dates, subject to signing and counsel. Every KPI needs a current baseline, M6 target and M18 target from management before this deck is investor-ready.",
};

/* ------------------------------------------------------ XI · what could go wrong */

export const RISKS = {
  eyebrow: "WHAT COULD GO WRONG",
  title: "Name the risks early.",
  titleAccent: "Instrument the controls from day one.",
  desc:
    "The partnership manages the risks created by concentration, services intensity, sensitive data, automation, specialist talent and cross-border operations.",
  scaleNote: "Likelihood, impact and control maturity scored 1 (low) – 3 (high) — our own qualitative framework, not a benchmarked index.",
  items: [
    {
      risk: "Customer concentration",
      control: "Milestone-based diversification plan; no fixed-cost growth ahead of contracted revenue.",
      indicator: "% revenue from largest client; qualified pipeline coverage",
      likelihood: 2, impact: 3, maturity: 2,
    },
    {
      risk: "Services gravity",
      control: "Standard scope, reusable components, change control and automation eligibility criteria.",
      indicator: "Hours/output; custom work share; gross margin by workflow",
      likelihood: 2, impact: 2, maturity: 2,
    },
    {
      risk: "Data rights + confidentiality",
      control: "Contractual rights matrix, least-privilege access, segregation, retention rules and audit logs.",
      indicator: "Access exceptions; unclassified data; security incidents",
      likelihood: 1, impact: 3, maturity: 3,
    },
    {
      risk: "AI / vendor dependency",
      control: "Human approval gates, model evaluation, fallback procedures and portability for critical workflows.",
      indicator: "Override rate; hallucination/error rate; vendor concentration",
      likelihood: 2, impact: 2, maturity: 2,
    },
    {
      risk: "Talent + quality",
      control: "Role-based review, documented standards, training and capacity planning.",
      indicator: "First-pass acceptance; rework; utilization; key-person exposure",
      likelihood: 2, impact: 2, maturity: 2,
    },
    {
      risk: "Cross-border complexity",
      control: "Counsel-led entity, tax, employment, regulatory and data-residency design.",
      indicator: "Unresolved legal dependencies; cross-border data flows",
      likelihood: 2, impact: 2, maturity: 1,
    },
  ],
  footnote:
    "The risk is not that services are involved; the risk is failing to convert delivery into standardized, measurable workflows. The leading indicators make that visible before it becomes an economics or quality problem.",
};

/* -------------------------------------------------------- XII · partnership proposal */

export const ASK = {
  eyebrow: "THE PARTNERSHIP PROPOSAL",
  title: "Build the operating company",
  titleAccent: "together.",
  desc:
    "Isthmus Meridian contributes a live operating environment, workflow IP, a proprietary delivery system and the initial customer relationship. The founding partners contribute capital, commercial reach, governance and the capacity to secure the next anchor funds.",
  contributions: {
    ours: {
      label: "ISTHMUS CONTRIBUTES",
      items: [
        "Customer-zero access (subject to agreement)",
        "Operating playbooks, templates and evaluation sets",
        "Product and data architecture",
        "Delivery leadership",
      ],
    },
    theirs: {
      label: "PARTNERS CONTRIBUTE",
      items: [
        "Committed capital",
        "Introductions and active sponsorship",
        "Governance",
        "Senior hiring support and access to fund two, three and four",
      ],
    },
  },
  terms: [
    { label: "Vehicle", value: TBD as Figure, unit: "" },
    { label: "Capital required", value: TBD as Figure, unit: "" },
    { label: "Ownership split", value: TBD as Figure, unit: "" },
    { label: "Target close", value: TBD as Figure, unit: "" },
  ],
  decisions: "Also to agree: board composition, reserved matters, IP/data rights, founder vesting and funding tranches.",
  useOfFunds: [
    { label: "Product & automation", value: TBD as Figure },
    { label: "Domain delivery hires", value: TBD as Figure },
    { label: "Security, legal & entity setup", value: TBD as Figure },
    { label: "Commercial development", value: TBD as Figure },
    { label: "Contingency", value: TBD as Figure },
  ],
  nextStep: "Immediate next step: a two-week diligence sprint ending in a signed term sheet and 90-day operating plan.",
  warning: "The vehicle, capital amount, ownership split and close date are yours to set — we won't presume them.",
  cta: "Start the conversation",
};

/* ----------------------------------------------------------------- XIII · close */

export const CLOSING = {
  statement: "Build the operating layer",
  statementAccent: "private markets have been missing.",
  subline: "A live foundation. A repeatable workflow system. A path from expert delivery to software economics.",
  steps: [
    "Confirm the founding-partner diligence scope.",
    "Agree the capital and governance framework.",
    "Launch the 90-day operating plan and second-anchor pipeline.",
  ],
  crossing: { near: "Live customer zero", far: "Repeatable multi-fund operating layer" },
  meta: [
    { label: "Structure", body: "Delaware · Dubai operating corridor" },
    { label: "Contact", body: "info@isthmusmeridian.com" },
  ],
};
