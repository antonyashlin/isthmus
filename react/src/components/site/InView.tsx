"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

/**
 * Defers mounting until the block scrolls into view, so a chart plays its enter
 * animation when you arrive at its screen rather than silently at page load.
 * Reduced motion mounts immediately.
 */
export function InView({
  children,
  className,
  style,
  amount = 0.25,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: amount }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);

  return (
    <div className={className} ref={ref} style={style}>
      {shown ? children : null}
    </div>
  );
}
