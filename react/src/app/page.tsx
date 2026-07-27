import { FunnelChart } from "@/components/charts/funnel-chart";
import { ApproachRoutes } from "@/components/site/ApproachRoutes";
import { FlowDiagram } from "@/components/site/FlowDiagram";
import { MetricCards, OfferCards } from "@/components/site/GlassCards";
import { Globe } from "@/components/site/Globe";
import { GlobeSparks } from "@/components/site/GlobeSparks";
import { InView } from "@/components/site/InView";
import { Nav } from "@/components/site/Nav";
import { PainGauges } from "@/components/site/PainGauges";
import { PressureRadar } from "@/components/site/PressureRadar";
import { ReadinessRings } from "@/components/site/ReadinessRings";
import { ScrollFx } from "@/components/site/ScrollFx";
import { ServicesTree } from "@/components/site/ServicesTree";

const PRESSURE = [
  {
    key: "large",
    label: "Large deals",
    amount: 44,
    display: "+44%",
    note: "Growth in deal value at the top of the market, year on year.",
  },
  {
    key: "value",
    label: "PE deal value",
    amount: 17,
    display: "+17%",
    note: "Growth in total private-equity deal value, year on year.",
  },
  {
    key: "exits",
    label: "PE-backed exits",
    amount: 40,
    display: "+40%",
    note: "Growth in exit activity out of PE-backed portfolios.",
  },
  {
    key: "secondaries",
    label: "Secondaries",
    amount: 48,
    display: "+48%",
    note: "Growth in secondary-market transaction volume.",
  },
];
const DIALS = [
  {
    key: "fragmentation",
    label: "Data fragmentation",
    value: 89,
    note: "Share of finance leaders citing data spread across disconnected systems.",
  },
  {
    key: "lp-requests",
    label: "More detailed LP requests",
    value: 58,
    note: "Share of CFOs seeing more granular information requests from LPs.",
  },
  {
    key: "static",
    label: "Static reporting",
    value: 44,
    note: "Share still working from static, periodic reporting formats.",
  },
];
const OFFERS = [
  {
    key: "transaction",
    title: "Transaction support",
    blurb:
      "For a specific active deal that needs modeling, diligence, and materials at pace.",
    caps: [
      "Valuation, returns, and scenario modeling",
      "Diligence support and issue tracking",
      "IC memos and deal materials",
    ],
  },
  {
    key: "embedded",
    title: "Embedded back office",
    blurb:
      "The standing operating layer for small and mid-sized funds, across every function at once.",
    caps: [
      "Fund operations and internal reporting",
      "Portfolio monitoring and KPI collection",
      "Research, data, and AI enablement",
    ],
    feature: true,
  },
  {
    key: "portfolio",
    title: "Portfolio and fund support",
    blurb:
      "For firms with an investment team that need recurring operating infrastructure.",
    caps: [
      "Quarterly LP reporting and updates",
      "Board and portfolio company packs",
      "Recurring analysis and dashboards",
    ],
  },
];
const METRICS = [
  {
    key: "detail",
    value: "58%",
    count: 58,
    suffix: "%",
    blurb: "of CFOs report more detailed LP information requests.",
    detail: "The ask is finer-grained, not simply more frequent.",
  },
  {
    key: "speed",
    value: "Hours",
    blurb: "Expected response speed is compressing from days toward hours.",
    detail: "Turnaround is now part of the answer, not a caveat on it.",
  },
  {
    key: "baseline",
    value: "Baseline",
    blurb:
      "Granular, standardized reporting is becoming the expectation, not the exception.",
    detail: "What used to differentiate a manager is now table stakes.",
  },
];
const BANDS = [
  { key: "resources", label: "Limited resources", value: 56, display: "56%",
    note: "Name limited resources as their top transaction-readiness challenge." },
  { key: "modeling", label: "Adjusted modeling", value: 46, display: "46%",
    note: "Have adjusted their financial modeling approach for current conditions." },
  { key: "diligence", label: "Enhanced diligence", value: 40, display: "40%",
    note: "Have enhanced their due-diligence process." },
  { key: "ai", label: "AI evaluations", value: 5, display: "5%",
    note: "Use AI evaluations anywhere in the transaction workflow." },
];
const TREE_SUMMARY =
  "Every function an investment firm needs to run, operated as one tree. Point at a function for what it covers.";
const BRANCHES = [
  { key: "deal", name: "Deal & capital", leaves: [
    { key: "deal-team", name: "Deal team support", desc: "Sourcing, research, screening, diligence, memos, and IC decks." },
    { key: "modeling", name: "Financial modeling", desc: "Forecasting, valuation, comparables, returns, and scenarios." },
    { key: "capital", name: "Capital formation", desc: "Fund decks, LP updates, DDQs, and data-room materials." },
  ] },
  { key: "ops", name: "Operations", leaves: [
    { key: "fund-ops", name: "Fund operations", desc: "Pipeline admin, documentation, internal reporting, and calendars." },
    { key: "monitoring", name: "Portfolio monitoring", desc: "KPI collection, budget-vs-actual tracking, dashboards, and board updates." },
  ] },
  { key: "research", name: "Research & data", leaves: [
    { key: "intel", name: "Research and intelligence", desc: "Sector, company, transaction, regulatory, and thematic research." },
    { key: "ai", name: "Data and AI enablement", desc: "Workflow mapping, document processing, templates, and custom tools." },
  ] },
];
const FUNNEL = [
  { label: "Use GenAI in M&A", value: 90, displayValue: "90%" },
  { label: "Across multiple stages", value: 37, displayValue: "37%" },
  { label: "Most value, advisory-led", value: 35, displayValue: "35%" },
];
const STEPS = [
  ["01", "Understand", "Map the firm's strategy, standards, and recurring requirements."],
  ["02", "Operate", "Take responsibility for defined workflows end to end."],
  ["03", "Standardize", "Build templates, structures, and quality controls."],
  ["04", "Automate", "Use AI and tooling to cut repetitive labor."],
  ["05", "Expand", "Take on additional functions as trust compounds."],
];

export default function Home() {
  return (
    <>
      <ScrollFx />
      <Nav />
      <span id="top" />
      <Globe />
      <GlobeSparks />

      <header className="hero">
        <div className="hero-inner">
          <div className="hero-top">
            <p className="hero-tag">
              The analytical, operational, and reporting work<br className="wbr" /> behind an investment firm, run as a service.
            </p>
          </div>
          <div className="hero-bottom">
            <h1 className="wordmark">
              <span className="w-isth">Isthmus</span>
              <span className="w-mer">Meridian</span>
            </h1>
          </div>
        </div>
      </header>

      <main>
        {/* 2 — the problem (light) · A: heading → desc → stances */}
        <section className="sec slide-sec light">
          <div className="slide lay-a">
            <h2 className="blk-head h-lg clear-arc reveal">
              Running a fund takes more than an <span className="serif-i">investment team</span>.
            </h2>
            <p className="blk-desc body reveal">
              Every firm needs financial models, diligence, investor materials, reporting, research, portfolio monitoring, data management, and operational coordination. Today that work is built three ways, and none of them fit.
            </p>
            <div className="blk-viz">
              <div className="viz-plate">
                <ApproachRoutes />
              </div>
            </div>
          </div>
        </section>

        {/* 3 — pressure radar (dark) · C: radar left, heading + desc right */}
        <section className="sec slide-sec">
          <div className="slide lay-c">
            <h2 className="blk-head h-lg reveal">Private-market pressure is <span className="serif-i">rising</span>.</h2>
            <p className="blk-desc body reveal">More activity and longer, more complex holding periods create more analytical and operational work for investment teams.</p>
            <div className="blk-viz">
              <div className="chart-block viz-plate reveal">
                <InView amount={0.2}>
                  <PressureRadar metrics={PRESSURE} />
                </InView>
                <p className="source">Source: <a href="https://www.mckinsey.com/industries/private-capital/our-insights/global-private-markets-report/private-equity" target="_blank" rel="noopener">McKinsey Global Private Equity Report 2026</a>.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 — the shift / flow (light) · B: flow leads, statement heading below */}
        <section className="sec slide-sec light">
          <div className="slide lay-b low">
            <blockquote className="blk-head pull pull-xl reveal">We do not hand your team another tool to run. <span className="accent">We run the work.</span></blockquote>
            <div className="blk-viz">
              <div className="viz-plate">
                <FlowDiagram />
              </div>
            </div>
          </div>
        </section>

        {/* 5 — services tree (dark) · A: heading → desc → operating tree */}
        <section className="sec slide-sec" id="services">
          <div className="slide lay-a">
            <h2 className="blk-head h-lg reveal">What Isthmus Meridian operates.</h2>
            <div className="blk-viz">
              <div className="viz-plate">
                <ServicesTree branches={BRANCHES} root="Isthmus Meridian" summary={TREE_SUMMARY} />
              </div>
            </div>
          </div>
        </section>

        {/* 6 — back-office pain gauges (light) · A: heading → gauges */}
        <section className="sec slide-sec light">
          <div className="slide lay-a">
            <h2 className="blk-head h-lg reveal">The back-office pain behind the <span className="serif-i">services</span>.</h2>
            <p className="blk-desc body reveal">Three pressures show up in every CFO survey: data spread across systems, LPs asking for more detail, and reporting that cannot answer a follow-up question. Point at a dial for what it measures.</p>
            <div className="blk-viz">
              <div className="chart-block viz-plate reveal">
                <InView amount={0.2}>
                  <PainGauges dials={DIALS} />
                </InView>
                <p className="source">Sources: <a href="https://www.equiforte.com/resources/blog/pe-cfo-reporting-survey" target="_blank" rel="noopener">Equiforte</a>, <a href="https://www.maybern.com/post/meeting-the-growing-demands-of-in-flight-lp-information-requests" target="_blank" rel="noopener">Maybern / Private Funds CFO</a>, <a href="https://www.pwc.com/mk/en/news/cfo-compass-survey-2025.html" target="_blank" rel="noopener">PwC</a>.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7 — how we work / journey (dark) · A: heading → journey */}
        <section className="sec slide-sec" id="how">
          <div className="slide lay-a">
            <h2 className="blk-head h-lg reveal">An embedded team, without the cost of <span className="serif-i">building one</span>.</h2>
            <div className="blk-viz">
              <div className="journey reveal">
                <div className="journey-track" />
                {STEPS.map(([n, title, desc]) => (
                  <div className="jstep" key={n}>
                    <span className="jdot" />
                    <div className="jn">{n}</div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8 — AI adoption / Bklit funnel (light) · D: heading top, desc left, funnel right */}
        <section className="sec slide-sec light">
          <div className="slide lay-e">
            <h2 className="blk-head h-lg reveal">AI use is active — <span className="serif-i">integration</span> decides the value.</h2>
            <p className="blk-desc body reveal">Most M&amp;A teams already reach for generative AI, but the value lands only where it is wired into the actual workflow — not left as a tool on the side.</p>
            <div className="blk-viz funnel-on-light">
              <div className="chart-block viz-plate reveal">
                <InView amount={0.2}>
                  <FunnelChart
                    data={FUNNEL}
                    orientation="vertical"
                    color="var(--chart-1)"
                    showValues
                    showLabels
                    showPercentage
                    style={{ height: "calc(100vh - 250px)" }}
                  />
                </InView>
                <p className="source">Source: <a href="https://www.deloitte.com/us/en/what-we-do/capabilities/mergers-acquisitions-restructuring/articles/m-and-a-generative-ai-study.html" target="_blank" rel="noopener">Deloitte 2026 GenAI in M&amp;A Pulse Study</a>.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 9 — who we serve / Kokonut glass offers (dark) · A: heading → offers */}
        <section className="sec slide-sec" id="who">
          <div className="slide lay-a">
            <h2 className="blk-head h-lg reveal">Three ways to work with us.</h2>
            <div className="blk-viz">
              <OfferCards offers={OFFERS} />
            </div>
          </div>
        </section>

        {/* 10 — LP expectations / metrics (light) · A: heading → metrics */}
        <section className="sec slide-sec light">
          <div className="slide lay-a">
            <h2 className="blk-head h-lg reveal">From periodic reporting to <span className="serif-i">on-demand analysis</span>.</h2>
            <div className="blk-viz">
              <div className="chart-block viz-plate reveal">
                <MetricCards metrics={METRICS} />
                <p className="source">Source: <a href="https://www.maybern.com/post/meeting-the-growing-demands-of-in-flight-lp-information-requests" target="_blank" rel="noopener">Maybern summary of Private Funds CFO Insights Survey 2025</a>.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 11 — why isthmus / contrasts (dark) · B: contrasts lead, heading below */}
        <section className="sec slide-sec" id="why">
          <div className="slide lay-b">
            <h2 className="blk-head h-lg reveal">Built for private-market operating work.</h2>
            <div className="blk-viz">
              <div className="contrasts">
                <div className="reveal"><span className="yes">Integrated</span><span className="no">not fragmented</span></div>
                <div className="reveal"><span className="yes">Embedded</span><span className="no">not external</span></div>
                <div className="reveal"><span className="yes">Execution</span><span className="no">not software licenses</span></div>
                <div className="reveal"><span className="yes">Investment-specific</span><span className="no">not generic</span></div>
                <div className="reveal"><span className="yes">AI-enabled</span><span className="no">not labor-only</span></div>
                <div className="reveal"><span className="yes">Scalable</span><span className="no">not dependent on internal hiring</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* 12 — readiness gap / rose (light) · C: rose left, heading + desc right */}
        <section className="sec slide-sec light">
          <div className="slide lay-c">
            <h2 className="blk-head h-lg reveal">The transaction-readiness <span className="serif-i">gap</span>.</h2>
            <p className="blk-desc body reveal">Many firms still run transaction workflows with limited tooling and integration — leaving readiness uneven when a deal moves.</p>
            <div className="blk-viz">
              <div className="chart-block viz-plate reveal">
                <InView amount={0.2}>
                  <ReadinessRings bands={BANDS} />
                </InView>
                <p className="source">Source: <a href="https://corpgov.law.harvard.edu/2025/11/04/ready-for-the-deal-transaction-readiness-in-turbulent-times/" target="_blank" rel="noopener">Harvard Law School Forum transaction-readiness survey</a>.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 13 — company / CTA (dark), heading top-right + liquid-glass bar */}
        <section className="sec cta-sec" id="company">
          <div className="wrap company-wrap">
            <h2 className="h-lg reveal company-head">We run the back office behind <span className="serif-i">private-market investors</span>.</h2>
          </div>
          <div className="glassbar reveal">
            <span className="wm"><b>ISTHMUS</b> <i>MERIDIAN</i></span>
            <div className="contact">
              <span className="contact-label">Contact us</span>
              <a href="mailto:hello@isthmusmeridian.com">hello@isthmusmeridian.com</a>
              <a href="tel:+10000000000">+1 (000) 000&#8209;0000</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
