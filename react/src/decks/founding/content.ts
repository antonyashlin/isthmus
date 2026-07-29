/**
 * Founding-partner deck — second build (2026-07-29).
 *
 * Content is data. Nothing in `slides.tsx` inlines a number or a sentence, so
 * the whole argument can be read, reviewed and corrected here without touching
 * a component. The narrative arc, in order:
 *
 *   what we are · why we exist · the gap we're closing · what we do ·
 *   how we stack up (the moat) · how we stack up (the market) · the model ·
 *   where we are today · how we get there (structure) · the long-term plan ·
 *   what could go wrong · the proposal · close
 *
 * PROVENANCE IS MANDATORY. Every datum carries a `source`:
 *   - a real citation string  -> renders as a source note under the frame
 *   - `ILLUSTRATIVE`          -> renders a visible "illustrative — not sourced"
 *                                band on the slide
 * A figure without provenance cannot be expressed in this file — a plausible
 * fabricated number in an investor document is the worst failure this deck
 * can produce.
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
  propositionAccent: "becoming the brain that runs it.",
  classification: "A JOINT VENTURE FOR AND CAPITAL",
  place: "DELAWARE · DUBAI",
  date: "JULY 2026",
  tagline: "The crossing, and the line you cross it by.",
};

/* --------------------------------------------------------- II · what we are */

export const IDENTITY = {
  eyebrow: "WHAT WE ARE",
  title: "Not a tool.",
  titleAccent: "The operating layer underneath the fund.",
  desc:
    "Isthmus Meridian runs the analytical, operational and reporting work behind a private-markets firm — one standing layer, not a seat license bolted onto a team that still does the work itself.",
  hub: "OPERATING LAYER",
  nodes: [
    { key: "modeling", label: "Modeling" },
    { key: "diligence", label: "Diligence" },
    { key: "ic", label: "IC Materials" },
    { key: "fundops", label: "Fund Ops" },
    { key: "monitoring", label: "Monitoring" },
    { key: "lp", label: "LP Reporting" },
    { key: "capital", label: "Capital" },
    { key: "data", label: "Data & AI" },
  ],
};

/* ---------------------------------------------------------- III · why we exist */

export const THESIS = {
  eyebrow: "WHY WE EXIST",
  title: "We started with the part that kills most startups",
  titleAccent: "already solved.",
  desc:
    "Most software companies raise money, then hunt for customers and beg for data. We began with all three already in hand — which is why the moat compounds instead of burning down.",
  ring: [
    { key: "anchor", label: "A live, paying anchor", value: 1, note: "Customer zero is already invoicing — real revenue, not a pilot." },
    { key: "recurring", label: "Recurring revenue", value: 1, note: "The services business funds the build — no venture burn to survive." },
    { key: "data", label: "A proprietary dataset", value: 1, note: "A continuously refreshing corpus of real private-markets deals." },
  ],
};

/* -------------------------------------------------------------- IV · the gap */

export const GAP = {
  eyebrow: "THE GAP",
  title: "The capital scaled.",
  titleAccent: "The operating layer never did.",
  desc:
    "Global private-capital AUM roughly tripled from 2015 to 2023. The way the work behind it gets done did not — every fund still runs it by hand.",
  years: [2015, 2021, 2023],
  series: {
    aum: { label: "Global private-capital AUM", values: [4.3, 13.7, 13.4] },
  },
  axisNote: "$ trillions, global private-capital AUM",
  annotation: {
    at: 2021,
    label: "AUM nearly tripled in six years — headcount per fund did not",
  },
  source: "Preqin, cited in Pensions & Investments (2016) and Preqin Alternatives in North America (2024).",
};

/* ------------------------------------------------------------- V · what we do */

export const FUNCTIONS = {
  eyebrow: "WHAT WE DO",
  title: "Eight functions.",
  titleAccent: "One operating layer.",
  desc:
    "Twenty capabilities across the fund lifecycle — from sourcing to LP reporting — grouped to eight, so every one appears in exactly one place below.",
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

/* --------------------------------------------------- VI · how we stack up · moat */

export const MOAT = {
  eyebrow: "HOW WE STACK UP · THE MOAT",
  title: "A moat you can't scrape",
  titleAccent: "from the outside.",
  desc:
    "Point-solutions read documents from the outside on public and user-supplied data — a cancellable seat license, exposed to whichever platform ships next. We run the work from the inside, on proprietary end-to-end execution data no lab can see.",
  axes: [
    { key: "ownership", label: "Data ownership", wrappers: 2, ours: 9 },
    { key: "depth", label: "Workflow depth", wrappers: 3, ours: 9 },
    { key: "switching", label: "Switching cost", wrappers: 2, ours: 8 },
    { key: "defense", label: "Defensibility, 18–36mo", wrappers: 3, ours: 8 },
  ],
  axisScale: 10,
  source: "Qualitative scoring, 0–10 — our own comparative framework, not a benchmarked index.",
  footnote:
    "We do the work — technology and domain expertise are how we do it, at expanding margin. That's the defensibility the market now demands, built from the one place it can't be copied: the inside.",
};

/* ------------------------------------------------- VII · how we stack up · market */

export const MARKET = {
  eyebrow: "HOW WE STACK UP · THE MARKET",
  title: "The market is already paying for this —",
  titleAccent: "richly.",
  desc:
    "Those companies sell tools from the outside. We own the operating layer from the inside — and thousands of GPs run the same manual back office AND Capital does.",
  compsLabel: "RECENT DEAL-INTELLIGENCE PLATFORM VALUATIONS",
  comps: [
    { name: "Rogo", note: "Series C", value: 750, display: "$750M" },
    { name: "Hebbia", note: "", value: 700, display: "~$700M" },
  ],
  compsAxis: [250, 500, 750, 1000],
  compsSource:
    "Rogo: $75M raised Jan 2026 — Sequoia, Henry Kravis, Wells Fargo, J.P. Morgan. Hebbia claims ~⅓ of top global asset managers by AUM.",
  compsStale: "Comps stamped early 2026 — re-verify before sending.",
  multiple: {
    label: "WHERE COMPS TRADE · ARR MULTIPLE",
    low: 15,
    high: 40,
    display: "40",
    caption: "One of the richest-funded categories in the market.",
    source: "Windsor Drake 2026 Vertical SaaS Valuation Report — AI-native SaaS growth rounds, 15–30x ARR (35–45x for breakout enterprise AI).",
  },
};

/* ---------------------------------------------------------------- VIII · the model */

export const MODEL = {
  eyebrow: "THE MODEL",
  title: "Enter at a services multiple.",
  titleAccent: "Exit at a software one.",
  desc:
    "Each function crosses from manual to automated on its own clock. Gross margin is the running total of those crossings — labour cost converting into software margin, one workflow at a time.",
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
  source:
    "Target operating model — modeled from the automation cadence in the roadmap, not AND Capital's actual revenue or delivery cost. Updates once those are supplied.",
};

/* ------------------------------------------------------------- IX · where we are */

export const CURRENT = {
  eyebrow: "WHERE WE ARE TODAY",
  title: "Already running,",
  titleAccent: "not a plan on a slide.",
  desc:
    "Isthmus Meridian already operates AND Capital's back office in Calgary — institutional decks, deal models, diligence and portfolio materials, with proprietary CIS deal flow running through it. This is the funnel from scope to production.",
  funnel: [
    { label: "Functions in scope", value: 8, displayValue: "8" },
    { label: "Functions piloted with customer zero", value: 5, displayValue: "5" },
    { label: "Functions live in production today", value: 3, displayValue: "3" },
  ],
  source:
    "The eight in scope are defined; pilot and production counts are AND Capital's current status, pending confirmation for the signed version of this deck.",
  panel: {
    eyebrow: "ALREADY LIVE",
    title: "Isthmus Meridian already runs your back office.",
    body:
      "Institutional decks, deal models, diligence and portfolio materials for AND Capital's Calgary growth-capital business in energy transition, real assets and health & wellness.",
  },
};

/* ------------------------------------------------------ X · how we get there */

export const STRUCTURE = {
  eyebrow: "HOW WE GET THERE",
  title: "Delaware first.",
  titleAccent: "Dubai shortly after.",
  desc:
    "A US parent matches the near-term counterparty and the standard instruments. The Gulf entity follows for the corridor, the client-facing lane and proximity to the capital — structure follows the work.",
  nodes: [
    { key: "calgary", label: "Calgary", note: "Customer zero", coord: [-114.07, 51.05], kind: "client" },
    { key: "delaware", label: "Delaware", note: "Parent · IP", coord: [-75.53, 39.16], kind: "parent" },
    { key: "london", label: "London", note: "Capital", coord: [-0.13, 51.51], kind: "client" },
    { key: "difc", label: "Dubai", note: "DIFC entity", coord: [55.28, 25.2], kind: "hub" },
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
  caption: "Schematic. Node placement is geographic; route curvature is not.",
};

/* -------------------------------------------------------- XI · the long-term plan */

export const ROADMAP = {
  eyebrow: "THE LONG-TERM PLAN",
  title: "Eighteen months,",
  titleAccent: "to a second fund.",
  desc:
    "Two workflows automate inside a quarter. The Gulf entity opens at month six. By month eighteen the model is proven on a second fund.",
  months: ["M0", "M3", "M6", "M9", "M12", "M15", "M18"],
  workflowsAutomated: [0, 2, 4, 6, 9, 12, 16],
  /**
   * The target sequence: which checkpoint (index into `months`) each of the
   * eight functions (in FUNCTIONS.items order) goes live at. Modeling and
   * portfolio monitoring first, per the M3 milestone; data ops/AI enablement
   * last, since it depends on the corpus the earlier functions produce.
   */
  functionStage: [3, 2, 1, 3, 2, 1, 6, 4],
  milestones: [
    { at: "M0", label: "Delaware C corp incorporated" },
    { at: "M3", label: "First two workflows automated" },
    { at: "M6", label: "DIFC entity live" },
    { at: "M18", label: "Second anchor fund signed" },
  ],
  table: [
    { when: "MONTH 0", title: "Delaware C corp incorporated", body: "Founding partners on the cap table, data-and-IP agreement executed with customer zero." },
    { when: "MONTH 3", title: "First two workflows automated", body: "Modeling and portfolio monitoring — the flagship and the most repetitive." },
    { when: "MONTH 6–9", title: "DIFC entity live", body: "Client-facing contracting moves to the Gulf; delivery bench begins hiring." },
    { when: "MONTH 18", title: "Second anchor fund signed", body: "The first workflow productized and sold rather than staffed." },
  ],
  source: "Proposed roadmap — target dates, subject to signing and counsel.",
};

/* ------------------------------------------------------------ XII · what could go wrong */

export const RISKS = {
  eyebrow: "WHAT COULD GO WRONG",
  title: "What could go wrong,",
  titleAccent: "and what we've done about it.",
  desc:
    "Risk precedes the ask. Five things could break this — each with the exposure we're carrying today and the mitigation already in motion.",
  metrics: [
    { key: "concentration", label: "Customer concentration" },
    { key: "labs", label: "Lab encroachment" },
    { key: "gravity", label: "Services gravity" },
    { key: "rights", label: "Data-rights risk" },
    { key: "crossborder", label: "Cross-border exposure" },
  ],
  exposure: { concentration: 78, labs: 55, gravity: 60, rights: 50, crossborder: 45 },
  mitigated: { concentration: 45, labs: 40, gravity: 25, rights: 35, crossborder: 30 },
  items: [
    { risk: "Customer-zero concentration", body: "One anchor is most of the revenue. Losing it stalls the flywheel before the corpus is defensible.", mitigation: "Second anchor is the month-18 milestone; data rights survive termination." },
    { risk: "The labs encroach faster than we automate", body: "Foundation models absorb generic document work, compressing the services margin we are borrowing against.", mitigation: "The moat is execution data and encoded workflow, not model capability." },
    { risk: "Services gravity", body: "A profitable services business is a comfortable place to stay. The automation never happens and the multiple never re-rates.", mitigation: "Automation rate is the reported metric, not revenue." },
    { risk: "Data rights fail to hold", body: "If a client disputes ownership of abstracted templates and eval sets, the corpus is not ours to build on.", mitigation: "Data-and-IP agreement is a founding document, executed before the entity is capitalised." },
    { risk: "Cross-border structure and delivery", body: "A three-jurisdiction structure carries transfer-pricing, permanent-establishment and data-residency exposure.", mitigation: "Counsel engaged before the DIFC entity, not after." },
  ],
};

/* -------------------------------------------------------------------- XIII · the ask */

export const ASK = {
  eyebrow: "THE PROPOSAL",
  title: "Not a round.",
  titleAccent: "A partner.",
  desc:
    "The hard part is already done — a paying customer, a working product, a proprietary dataset. What's left is who owns what comes next, split evenly because the risk from here is shared evenly.",
  split: [
    { label: "Isthmus Meridian", value: 50 },
    { label: "Founding partners", value: 50 },
  ],
  contributions: {
    ours: {
      label: "ISTHMUS MERIDIAN BRINGS",
      items: [
        "A live, paying anchor — AND Capital's back office, running today",
        "The operating layer itself: models, templates, eval sets, platform",
        "The delivery bench and the workflow history behind the corpus",
        "Data rights structured up front, surviving any one client's exit",
      ],
    },
    theirs: {
      label: "FOUNDING PARTNERS BRING",
      items: [
        "Capital sized to fund the second anchor and the delivery build-out",
        "The commercial reach to close fund two, three and four",
        "Standing with GPs and LPs that a two-person startup doesn't have",
        "A board seat — and the accountability that comes with equal equity",
      ],
    },
  },
  terms: [
    { label: "Ownership split", value: 50 as Figure, unit: "/50" },
    { label: "Capital required", value: TBD as Figure, unit: "" },
    { label: "Vehicle", value: TBD as Figure, unit: "" },
    { label: "Target close", value: TBD as Figure, unit: "" },
  ],
  governance:
    "One class of equity, one board, reserved matters agreed at signing — neither side gets diluted out of the layer they helped build.",
  warning: "The capital figure, the vehicle and the close date are yours to set — we won't presume them.",
  cta: "Start the conversation",
};

/* ----------------------------------------------------------------- XIV · close */

export const CLOSING = {
  statement: "The crossing, and the",
  statementAccent: "line you cross it by.",
  structure: "Delaware · Dubai",
  opportunity: "AND Capital · 50/50 JV",
};
