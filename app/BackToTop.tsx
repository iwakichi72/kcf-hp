"use client";

import { useEffect, useState } from "react";

/** Progressive enhancement: the anchor is only surfaced once scrolling has
 *  actually made it useful, so it never competes with the hero CTAs. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    function measure() {
      frame = 0;

      const offset = window.scrollY;
      const remaining =
        document.documentElement.scrollHeight - window.innerHeight - offset;

      // Retracts before it can cover the footer's legal row, where the brand
      // lockup already links back to the top.
      setVisible(offset > window.innerHeight && remaining > 120);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", schedule, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  return (
    <a
      className="back-to-top"
      href="#top"
      data-visible={visible || undefined}
      aria-label="ページ上部へ戻る"
      tabIndex={visible ? undefined : -1}
    >
      <span aria-hidden="true">↑</span>
    </a>
  );
}
