export function Nav() {
  return (
    <nav className="nav liquid-glass">
      <a className="brand" href="#top" aria-label="Isthmus Meridian home">
        <svg viewBox="0 0 48 48" width="26" height="26" aria-hidden="true">
          <g fill="none" stroke="#F2F6FA" strokeWidth="1.5" strokeLinecap="round">
            <line x1="24" y1="9" x2="24" y2="39" />
            <path d="M12.5 12 C 24 18, 24 30, 12.5 38" />
            <path d="M35.5 12 C 24 18, 24 30, 35.5 38" />
          </g>
        </svg>
        <span className="wm">
          <b>ISTHMUS</b> <i>MERIDIAN</i>
        </span>
      </a>
      <div className="nav-links">
        <a href="#services">Services</a>
        <a href="#how">How We Work</a>
        <a href="#who">Who We Serve</a>
        <a href="#why">Why Isthmus</a>
        <a href="#company">Company</a>
      </div>
      <div className="nav-cta">
        <a className="btn btn-ghost btn-sm" href="/deck">
          Explore our deck
        </a>
        <a className="btn btn-glass btn-sm liquid-glass" href="#company">
          Reach out to us
        </a>
      </div>
    </nav>
  );
}
