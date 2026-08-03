"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

/**
 * Below 760px the five text links in `.nav-links` are display:none — there
 * was no way to reach a section except by scrolling past it. This gives that
 * width its own way in: a burger that opens a panel of the same links.
 *
 * The panel is Base UI's real Drawer (already vendored for shadcn's `drawer`
 * primitive — @base-ui/react was already a dependency, so this is zero new
 * runtime weight), not a hand-built dropdown. The bar itself lives at the
 * bottom of the screen on mobile (thumb reach), so `swipeDirection="down"`
 * anchors the panel just above it and lets a swipe down dismiss it, toward
 * the edge it rose from. `modal={false}` because a modal
 * drawer's backdrop is a full-screen div at a higher z-index than `.nav`
 * (z-index:30) — it would sit on top of the burger button and swallow the
 * tap meant to close it. Non-modal still closes on an outside press or a
 * link's own DrawerClose; it just does it without a backdrop stealing focus
 * or locking page scroll, which this scroll-snap deck would rather it left
 * alone.
 */

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#how", label: "How We Work" },
  { href: "#who", label: "Who We Serve" },
  { href: "#why", label: "Why Isthmus" },
  { href: "#company", label: "Company" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);

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
        {LINKS.map((l) => (
          <a href={l.href} key={l.href}>
            {l.label}
          </a>
        ))}
      </div>
      <div className="nav-cta">
        <a className="btn btn-glass btn-sm liquid-glass" href="#company">
          Reach out to us
        </a>

        <Drawer modal={false} onOpenChange={setOpen} open={open} swipeDirection="down">
          <DrawerTrigger
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="nav-burger liquid-glass"
          >
            {open ? (
              <X aria-hidden="true" size={18} strokeWidth={1.6} />
            ) : (
              <Menu aria-hidden="true" size={18} strokeWidth={1.6} />
            )}
          </DrawerTrigger>
          <DrawerContent className="nav-drawer liquid-glass">
            <div className="nav-drawer-links">
              {LINKS.map((l) => (
                <DrawerClose key={l.href} render={<a href={l.href} />}>
                  {l.label}
                </DrawerClose>
              ))}
            </div>
            <DrawerClose
              className="btn btn-glass liquid-glass nav-drawer-cta"
              render={<a href="#company" />}
            >
              Reach out to us
            </DrawerClose>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
}
