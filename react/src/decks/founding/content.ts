/**
 * Founding-partner deck — all copy and every figure.
 *
 * Content is data. Nothing in `slides.tsx` inlines a number or a sentence, so
 * the whole argument can be read, reviewed and corrected here without touching
 * a component.
 *
 * PROVENANCE IS MANDATORY. Every datum carries a `source`:
 *   - a real citation string  -> renders as a source note under the frame
 *   - `ILLUSTRATIVE`          -> renders a visible "illustrative — not sourced"
 *                                band on the slide
 * There is no third option, and no default. A figure without provenance cannot
 * be expressed in this file, which is the point: a plausible fabricated number
 * in an investor document is the worst failure this deck can produce.
 *
 * Lines quoted verbatim from the reference deck (`deck reference/small changes
 * isthumus.pdf`) are marked REF. Do not casually reword them — they are the
 * deck's existing voice and several are already load-bearing.
 */

export const ILLUSTRATIVE = "ILLUSTRATIVE" as const;
export type Source = string | typeof ILLUSTRATIVE;

export const isIllustrative = (s: Source): boolean => s === ILLUSTRATIVE;

/** Placeholder for a figure the client has not supplied. Renders as a gap. */
export const TBD = null;
export type Figure = number | typeof TBD;

/* ---------------------------------------------------------------- deck meta */

export const DECK = {
  name: "Isthmus Meridian",
  /** REF — cover subtitle */
  proposition: "The private-markets back office,",
  propositionAccent: "becoming the brain that runs it.",
  classification: "A JOINT VENTURE FOR AND CAPITAL",
  confidential: "CONFIDENTIAL",
  place: "DELAWARE · DUBAI",
  date: "JULY 2026",
  /** REF — cover footer and closing line */
  tagline: "The crossing, and the line you cross it by.",
};

/* -------------------------------------------------------- II · the thesis */

export const THESIS = {
  eyebrow: "THE THESIS",
  /** REF, adapted — "AI companies" / "vertical-AI startups" reworded: the
   * deck no longer pitches an outside AI-company narrative, so the parallel
   * now runs against technology startups generally. */
  title: "We started with the part that kills most startups",
  titleAccent: "already solved.",
  lede:
    "Most software startups raise money, then hunt for customers and beg for data. We begin with all three in hand.",
  cards: [
    {
      key: "anchor",
      title: "A live, paying anchor",
      /** REF */
      body: "Customer zero is already invoicing — real revenue, not a pilot.",
    },
    {
      key: "recurring",
      title: "Recurring revenue",
      /** REF */
      body: "The services business funds the build — no venture burn to survive.",
    },
    {
      key: "data",
      title: "A proprietary dataset",
      /** REF */
      body: "A continuously refreshing corpus of real private-markets deals.",
    },
  ],
  /** REF — pull quote */
  quote: "We don't burn capital to survive.",
  quoteAccent: "We get paid to build the moat.",
};

/* ------------------------------------------------------- III · the problem */

export const PROBLEM = {
  eyebrow: "THE PROBLEM",
  /** REF */
  title: "Every fund runs a six-figure back office",
  titleAccent: "by hand.",
  /** REF */
  lede:
    "Modeling, diligence, investor materials, portfolio monitoring, fund ops — artisanal, manual, expensive, and rebuilt from scratch on every deal.",
  /** Adapted from the reference deck's AI-tools aside — reworded off "AI
   * tools" / "foundation-model labs" / named model subscriptions so the
   * critique reads as a general software-category argument, not an
   * AI-vs-AI comparison. */
  asideTitle: "GENERIC SOFTWARE DOESN'T FIX IT",
  points: [
    "Software watches from the outside — no proprietary data, no ownership of the work.",
    "Every category commoditizes into a subscription — a seat license any GP can cancel.",
    "The market has turned brutal on tools that own no outcome, only a workflow.",
  ],
};

/* ----------------------------------------------------- IV · the backdrop ◆ */

/**
 * NEW SLIDE. The reference deck asserts "every fund runs a six-figure back
 * office by hand" without evidence. This is that evidence — and it is the
 * dislocation the thesis has to be earned against.
 *
 * Both series are ILLUSTRATIVE. Real replacements: Preqin or McKinsey Global
 * Private Markets Review for AUM and fund count; there is no clean public
 * series for back-office headcount, so that one may have to become a survey
 * citation or come off the slide entirely.
 */
export const BACKDROP = {
  eyebrow: "THE BACKDROP",
  title: "The capital scaled.",
  titleAccent: "The operating layer never did.",
  lede:
    "Private-markets AUM and fund count compounded for a decade. The way the work behind them gets done did not change.",
  years: [2015, 2017, 2019, 2021, 2023, 2025],
  series: {
    /** Indexed to 2015 = 100 */
    aum: { label: "Private-markets AUM", values: [100, 128, 165, 214, 252, 288] },
    /** Indexed to 2015 = 100 */
    ops: { label: "Back-office capacity per fund", values: [100, 103, 106, 108, 111, 114] },
  },
  annotation: {
    at: 2021,
    label: "The gap stops being a staffing problem and becomes a structural one",
  },
  axisNote: "Indexed to 2015 = 100",
  source: ILLUSTRATIVE,
};

/* ---------------------------------------------------------- V · the wedge */

/**
 * Rewritten for AND Capital's own founding partners, not a third-party
 * investor being introduced to a customer case study. The deck now speaks to
 * them directly — this is the proposal to convert what's already running
 * into joint ownership, not a pitch about a stranger's back office.
 */
export const WEDGE = {
  eyebrow: "THE WEDGE",
  title: "We don't sell you a tool.",
  titleAccent: "We already run the work.",
  panel: {
    eyebrow: "ALREADY LIVE",
    title: "Isthmus Meridian already runs your back office.",
    body:
      "Institutional decks, deal models, diligence and portfolio materials for AND Capital's Calgary growth-capital business in energy transition, real assets and health & wellness — with proprietary CIS deal flow already running through it.",
  },
};

/* ------------------------------------------------- VI · the operating layer */

export const FUNCTIONS = {
  eyebrow: "THE OPERATING LAYER",
  /** REF */
  title: "Eight functions.",
  titleAccent: "One operating layer.",
  /** REF — the line that is the whole thesis in one sentence */
  footnote: "Every function is manual labor today. Every function is a candidate for automation —",
  footnoteAccent: "customer-funded R&D, one workflow at a time.",
  /**
   * Consolidated from the client's definitive scope list (2026-07-29):
   * Back-Office Operations, Financial Modeling, Valuation, Due Diligence
   * Support, Investment Committee Materials, Fund Operations, Portfolio
   * Monitoring, LP Reporting, Investor Materials, Capital Formation, Market
   * Research, Deal Sourcing Support, Investment Operations, Data Operations,
   * AI Enablement, Workflow Automation — grouped to eight so the rail still
   * carries eight (a grid of eight cards can't). Every named capability
   * appears in exactly one item's label.
   */
  items: [
    { n: "01", label: "Deal sourcing support", tag: null },
    { n: "02", label: "Due diligence support", tag: null },
    { n: "03", label: "Financial modeling & valuation", tag: "FLAGSHIP" },
    { n: "04", label: "Capital formation, investor & IC materials", tag: null },
    { n: "05", label: "Fund & investment operations", tag: null },
    { n: "06", label: "Portfolio monitoring & LP reporting", tag: null },
    { n: "07", label: "Data ops, automation & AI enablement", tag: "DIFFERENTIATOR" },
    { n: "08", label: "Market research", tag: null },
  ],
};

/* ---------------------------------------------------------- VII · the model */

export const FLYWHEEL = {
  eyebrow: "THE MODEL · PAID TO BUILD THE MOAT",
  title: "Enter at a services multiple.",
  titleAccent: "Exit at a software one.",
  hub: "MOAT",
  /** REF — all six steps */
  steps: [
    { n: 1, text: "Run the back office →", accent: "recurring revenue", tail: "funds the build." },
    { n: 2, text: "Every deal deposits", accent: "proprietary data + an encoded workflow.", tail: "" },
    { n: 3, text: "That corpus", accent: "automates the next deal", tail: "— cheaper, faster." },
    { n: 4, text: "Automation converts labor cost into", accent: "software margin.", tail: "" },
    { n: 5, text: "Proven workflows", accent: "productize", tail: "— sold to the next fund." },
    { n: 6, text: "More funds → more data → better product →", accent: "repeat.", tail: "" },
  ],
};

/* ------------------------------------------------------------ VIII · moat */

export const MOAT = {
  eyebrow: "THE MOAT",
  /** REF */
  title: "A moat you can't scrape",
  titleAccent: "from the outside.",
  wrappers: {
    label: "THE WRAPPERS",
    /** REF */
    rows: [
      "Point at documents from the outside",
      "Public + user-supplied data",
      "A cancellable seat license",
      "Exposed to whichever platform ships next",
    ],
  },
  ours: {
    label: "ISTHMUS MERIDIAN",
    /** REF */
    rows: [
      "Run the work from the inside",
      "Proprietary end-to-end execution data",
      "The operating layer itself",
      "Defended by data the labs can't see",
    ],
  },
  /** REF, adapted — "the AI is how we do it" reworded off AI language. */
  footnote:
    "We do the work — technology and domain expertise are how we do it, at expanding margin. That's the 18–36-month defensibility the market now demands, built from the one place it can't be copied: the inside.",
};

/* -------------------------------------------------- IX · the economics ◆ */

/**
 * NEW SLIDE. "Enter at a services multiple, exit at a software one" is the
 * deck's central financial claim and the reference deck offers no arithmetic
 * behind it. This is that arithmetic.
 *
 * ENTIRELY ILLUSTRATIVE until the client supplies AND Capital revenue, delivery
 * cost and the automation rate actually observed per workflow.
 */
export const ECONOMICS = {
  eyebrow: "THE ECONOMICS",
  title: "Labour cost converts to software margin,",
  titleAccent: "one workflow at a time.",
  lede:
    "Each function crosses from manual to automated on its own clock. Gross margin is the running total of those crossings.",
  /** Workflows automated, cumulative */
  quarters: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8"],
  series: {
    margin: { label: "Gross margin", values: [34, 38, 44, 49, 56, 62, 67, 71] },
    automated: { label: "Workflows automated", values: [1, 2, 4, 6, 9, 12, 16, 21] },
  },
  bands: [
    { label: "Services multiple", from: 0, to: 3 },
    { label: "Software multiple", from: 5, to: 7 },
  ],
  annotation: { at: "Q5", label: "Margin crosses the services/software line" },
  source: ILLUSTRATIVE,
};

/* --------------------------------------------------------- X · the market */

/**
 * The one slide in the reference deck with real, checkable figures. They are
 * stamped "comps early 2026" and it is now July 2026 — VERIFY BEFORE SENDING.
 * The ARR multiple range has no citation at all and is marked accordingly.
 */
export const MARKET = {
  eyebrow: "THE MARKET",
  /** REF */
  title: "The market is already paying for this —",
  titleAccent: "richly.",
  compsLabel: "RECENT DEAL-INTELLIGENCE PLATFORM VALUATIONS",
  comps: [
    { name: "Rogo", note: "Series C", value: 750, display: "$750M" },
    { name: "Hebbia", note: "", value: 700, display: "~$700M" },
  ],
  compsAxis: [250, 500, 750, 1000],
  /** REF — verbatim source note from the reference deck */
  compsSource:
    "Rogo: $75M raised Jan 2026 — Sequoia, Henry Kravis, Wells Fargo, J.P. Morgan. Hebbia claims ~⅓ of top global asset managers by AUM.",
  compsStale: "Comps stamped early 2026 — re-verify before sending.",
  multiple: {
    label: "WHERE COMPS TRADE · ARR MULTIPLE",
    display: "20–38×",
    low: 20,
    high: 38,
    scaleMax: 50,
    caption: "One of the richest-funded categories in the market.",
    source: ILLUSTRATIVE,
  },
  /** REF */
  footnote: "Those companies sell tools from the outside.",
  footnoteAccent: "We own the operating layer from the inside",
  footnoteTail:
    "— and thousands of GPs run the same manual back office AND Capital does.",
};

/* ------------------------------------------------------- XI · structure ◆ */

/**
 * REVISED from the reference deck's slide IX, at the client's instruction.
 *
 * The reference deck puts the IP-owning parent in Dubai with an India delivery
 * centre. This proposes Delaware as the parent and DIFC as a subsidiary that
 * follows. That is a genuine reversal of where IP sits, so the counter-argument
 * ships on the slide rather than in a footnote.
 */
export const STRUCTURE = {
  eyebrow: "DEFENSIBLE BY DESIGN",
  title: "Delaware first.",
  titleAccent: "Dubai shortly after.",
  lede:
    "A US parent matches the near-term counterparty and the standard instruments. The Gulf entity follows for the corridor, the client-facing lane and proximity to the capital.",
  tree: {
    parent: {
      key: "us",
      label: "Delaware C corp",
      role: "Parent · IP-owning",
      note: "Employer of record for founders, holder of the models and platform.",
      timing: "NOW",
    },
    children: [
      {
        key: "adgm",
        label: "DIFC entity",
        role: "Client-facing · Gulf & CIS",
        note: "English common law, the deepest private-markets ecosystem in the Gulf.",
        timing: "+6–9 MONTHS",
      },
      {
        key: "india",
        label: "India delivery",
        role: "Build at scale",
        note: "Wholly-owned delivery centre under an intercompany services agreement.",
        timing: "AS DEMAND LANDS",
      },
    ],
  },
  rationale: [
    {
      n: "01",
      title: "The counterparty is American",
      body: "Founding partners and the first institutional round expect a Delaware C corp, a SAFE or a priced round, and no explanation.",
    },
    {
      n: "02",
      title: "The QSBS clock starts at incorporation",
      body: "The holding period only ever runs from the day the C corp exists. Every month of delay is unrecoverable.",
      caveat: "Eligibility and treatment pending counsel.",
    },
    {
      n: "03",
      title: "Data rights engineered up front",
      body: "A formal data-and-IP agreement is the founding document — abstracted process templates and eval sets, not raw client files.",
    },
    {
      n: "04",
      title: "A clean, unregulated lane",
      body: "We never make investment decisions, solicit LPs, or give regulated advice — that stays with the GP, by design.",
    },
  ],
  /** The honest counter, on the slide. */
  counter: {
    label: "THE COUNTER-ARGUMENT",
    body:
      "This moves IP ownership from the Gulf to Delaware — the opposite of the prior structure. If the Gulf and CIS corridor is the real revenue engine rather than the delivery route, a Dubai parent is the better answer and this slide should be rebuilt.",
  },
  pending: "Structure and tax treatment pending counsel. Not tax advice.",
};

/* ------------------------------------------------------- XII · corridor ◆ */

/**
 * Upgrades the reference deck's dashed schematic into a real map.
 * Coordinates are [lon, lat] — geographic, not decorative.
 */
export const CORRIDOR = {
  eyebrow: "THE CORRIDOR",
  title: "Western capital. Gulf entity.",
  titleAccent: "Delivery at scale.",
  lede:
    "The structure follows the work: capital and clients in the west, the client-facing entity on the Gulf, delivery where the bench can actually be built.",
  nodes: [
    { key: "calgary", label: "Calgary", note: "Customer zero", coord: [-114.07, 51.05], kind: "client" },
    { key: "delaware", label: "Delaware", note: "Parent · IP", coord: [-75.53, 39.16], kind: "parent" },
    { key: "london", label: "London", note: "Capital", coord: [-0.13, 51.51], kind: "client" },
    { key: "difc", label: "Dubai", note: "DIFC entity", coord: [55.28, 25.2], kind: "hub" },
    { key: "bengaluru", label: "Bengaluru", note: "Delivery", coord: [77.59, 12.97], kind: "delivery" },
    { key: "almaty", label: "Almaty", note: "CIS deal flow", coord: [76.89, 43.24], kind: "market" },
  ],
  routes: [
    ["calgary", "delaware"],
    ["london", "delaware"],
    ["delaware", "difc"],
    ["difc", "bengaluru"],
    ["almaty", "difc"],
  ],
  legend: [
    { kind: "parent", label: "Parent entity" },
    { kind: "hub", label: "Client-facing entity" },
    { kind: "delivery", label: "Delivery" },
    { kind: "client", label: "Capital & clients" },
    { kind: "market", label: "Frontier deal flow" },
  ],
  caption: "Schematic. Node placement is geographic; route curvature is not.",
};

/* -------------------------------------------------------- XIII · roadmap ◆ */

export const ROADMAP = {
  eyebrow: "ROADMAP",
  title: "Eighteen months to the second entity",
  titleAccent: "and the second fund.",
  milestones: [
    {
      when: "MONTH 0",
      title: "Delaware C corp incorporated",
      body: "Founding partners on the cap table, data-and-IP agreement executed with customer zero.",
    },
    {
      when: "MONTH 3",
      title: "First two workflows automated",
      body: "Modeling and portfolio monitoring — the flagship and the most repetitive.",
    },
    {
      when: "MONTH 6–9",
      title: "DIFC entity live",
      body: "Client-facing contracting moves to the Gulf; delivery bench begins hiring.",
    },
    {
      when: "MONTH 18",
      title: "Second anchor fund signed",
      body: "The first workflow productized and sold rather than staffed.",
    },
  ],
  source: ILLUSTRATIVE,
};

/* ------------------------------------------------------------ XIV · team ◆ */

/**
 * DELIBERATELY EMPTY. The client has not supplied names. Rendering invented
 * founders in a founding-partner deck would be the single worst fabrication
 * this deck could contain, so the slide renders labelled gaps instead.
 */
export const TEAM = {
  eyebrow: "TEAM",
  title: "Who executes",
  titleAccent: "",
  lede: "The operating bench behind customer zero, and the seats still open.",
  members: [] as Array<{ name: string; role: string; bio: string }>,
  openSeats: [
    { role: "Founding partner · Commercial", note: "Owns the GP relationship and the second anchor." },
    { role: "Founding partner · Engineering", note: "Owns the operating layer and the automation clock." },
  ],
  emptyNote: "Team detail pending — names, prior firms and what each partner runs.",
};

/* ------------------------------------------------------------ XV · risks ◆ */

/**
 * NEW AND NON-NEGOTIABLE. The arc's invariant is that risks precede the ask.
 * The reference deck has no risk slide, which in a founding-partner document
 * reads as concealment rather than confidence.
 */
export const RISKS = {
  eyebrow: "RISKS",
  title: "What could go wrong,",
  titleAccent: "and what we've done about it.",
  items: [
    {
      risk: "Customer-zero concentration",
      body: "One anchor is most of the revenue. Losing it stalls the flywheel before the corpus is defensible.",
      mitigation: "Second anchor is the month-18 milestone; data rights survive termination.",
    },
    {
      risk: "The labs encroach faster than we automate",
      body: "Foundation models absorb generic document work, compressing the services margin we are borrowing against.",
      mitigation: "The moat is execution data and encoded workflow, not model capability.",
    },
    {
      risk: "Services gravity",
      body: "A profitable services business is a comfortable place to stay. The automation never happens and the multiple never re-rates.",
      mitigation: "Automation rate is the reported metric, not revenue.",
    },
    {
      risk: "Data rights fail to hold",
      body: "If a client disputes ownership of abstracted templates and eval sets, the corpus is not ours to build on.",
      mitigation: "Data-and-IP agreement is a founding document, executed before the entity is capitalised.",
    },
    {
      risk: "Cross-border structure and delivery",
      body: "A three-jurisdiction structure carries transfer-pricing, permanent-establishment and data-residency exposure.",
      mitigation: "Counsel engaged before the DIFC entity, not after.",
    },
  ],
};

/* -------------------------------------------------------------- XVI · ask ◆ */

/**
 * The ask: a fifty-fifty joint venture, not a raise.
 *
 * This is the one slide whose shape is set by the client rather than derived
 * from the reference deck. The split is real and stated; what each side puts
 * in is real; the mechanics underneath it — vehicle, vesting, close — are not
 * supplied yet and render as labelled gaps rather than plausible numbers.
 *
 * The 50/50 framing is what makes the rest of the deck cohere: a partner is
 * not buying into a services business, they are taking half of the operating
 * layer the services business is funding.
 */
export const ASK = {
  eyebrow: "THE ASK",
  title: "Not a raise.",
  titleAccent: "A fifty-fifty joint venture.",
  lede:
    "The customer is already found. We want the partner who takes the operating layer from one fund to many — owned together, equally.",
  split: { ours: 50, theirs: 50 },
  splitLabels: { ours: "Isthmus Meridian", theirs: "Founding partners" },
  /** What each side contributes to the venture. */
  contributions: {
    ours: {
      label: "WE CONTRIBUTE",
      items: [
        "A live, paying anchor — AND Capital's back office, running today",
        "The operating layer: models, templates, eval sets and the platform",
        "The delivery bench and the workflow that produced the corpus",
        "Data rights engineered up front, surviving any single client",
      ],
    },
    theirs: {
      label: "YOU CONTRIBUTE",
      items: [
        "Capital sized to the second anchor and the delivery build",
        "The commercial reach to reach fund two, three and four",
        "Domain standing with GPs and LPs in your market",
        "Equal ownership means equal accountability for the outcome",
      ],
    },
  },
  /** Mechanics the client has not supplied. Rendered as gaps, never invented. */
  terms: [
    { label: "Ownership", value: 50 as Figure, unit: "/50" },
    { label: "Capital committed", value: TBD as Figure, unit: "" },
    { label: "Vehicle", value: TBD as Figure, unit: "" },
    { label: "Target close", value: TBD as Figure, unit: "" },
  ],
  governance:
    "Equal ownership, equal board, reserved matters agreed at signing — neither side dilutable out of the layer it built.",
  warning: "Capital, vehicle and close come from you before this is presented.",
  cta: "Take the crossing",
};
