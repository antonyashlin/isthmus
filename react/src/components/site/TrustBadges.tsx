/**
 * Four proof points backing the sign-off flow's claim. Static and quiet by
 * design — a plain `.reveal` stagger, no looping motion — so they read as
 * evidence sitting under the flow diagram rather than competing with it.
 */

const BADGES = [
  {
    key: "segregation",
    label: "Client segregation",
    note: "Dedicated, isolated workspace per client — no cross-client data mixing.",
    icon: <IconSegregation />,
  },
  {
    key: "confidentiality",
    label: "Confidentiality",
    note: "NDA-covered, need-to-know access, encrypted in transit and at rest.",
    icon: <IconLock />,
  },
  {
    key: "soc2",
    label: "SOC 2 (in progress)",
    note: "Type II audit currently underway.",
    icon: <IconShield />,
  },
  {
    key: "residency",
    label: "Data residency",
    note: "Client data is stored and processed in the US only.",
    icon: <IconPin />,
  },
] as const;

export function TrustBadges() {
  return (
    <div className="badges">
      {BADGES.map((b, i) => (
        <div
          className="badge reveal"
          key={b.key}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <span className="badge-icon">{b.icon}</span>
          <div className="badge-label">{b.label}</div>
          <p className="badge-note">{b.note}</p>
        </div>
      ))}
    </div>
  );
}

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  width: 26,
  height: 26,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function IconSegregation() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="2.5" y="5" width="7.5" height="14" rx="1.6" />
      <rect x="14" y="5" width="7.5" height="14" rx="1.6" />
      <line x1="12" y1="4" x2="12" y2="20" strokeDasharray="1.6 3" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12 3.2 19 6v5.4C19 16 16 19 12 20.8 8 19 5 16 5 11.4V6z" />
      <path d="M12 6.6v6.4M9 9l3-2.4 3 2.4" opacity=".55" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12 21s7-6.3 7-11.6A7 7 0 0 0 5 9.4C5 14.7 12 21 12 21Z" />
      <circle cx="12" cy="9.4" r="2.4" />
    </svg>
  );
}
