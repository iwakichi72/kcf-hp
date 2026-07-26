"use client";

import { useRef, type KeyboardEvent, type MouseEvent } from "react";
import { NAV_ITEMS } from "./navigation";

export function MobileNavigation() {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);

  function closeMenu() {
    detailsRef.current?.removeAttribute("open");
  }

  function handleNavigation(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("a")) {
      closeMenu();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDetailsElement>) {
    if (event.key === "Escape") {
      closeMenu();
      summaryRef.current?.focus();
    }
  }

  return (
    <details
      className="mobile-navigation"
      ref={detailsRef}
      onKeyDown={handleKeyDown}
    >
      <summary className="mobile-navigation-summary" ref={summaryRef}>
        <span className="mobile-navigation-label">MENU</span>
        <span className="menu-icon" aria-hidden="true">
          <span />
          <span />
        </span>
      </summary>
      <nav
        className="mobile-navigation-panel"
        aria-label="モバイルナビゲーション"
        onClick={handleNavigation}
      >
        <ul className="mobile-navigation-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
          <li>
            <a className="mobile-contact-link" href="#contact">
              お問い合わせ
            </a>
          </li>
        </ul>
      </nav>
    </details>
  );
}
