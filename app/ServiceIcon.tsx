/**
 * Line icons drawn on the same 45° / right-angle grid as the KCF mark. Square
 * caps and joins keep them in the brand's angular language rather than the
 * rounded look every SaaS icon set ships with.
 */
const ICON_PATHS = {
  strategy: (
    <>
      <path d="M5 5v22h22" />
      <path d="M9.5 21.5l5.5-6.5 4.5 3.5L27 9" />
      <path d="M20.5 9H27v6.5" />
    </>
  ),
  system: (
    <>
      <path d="M16 4v10.5" />
      <path d="M11 9.5l5 5 5-5" />
      <path d="M4.5 18.5h23v9h-23z" />
      <path d="M8.5 23h3.5" />
    </>
  ),
  automation: (
    <>
      <path d="M26.5 12.5A11.5 11.5 0 1 1 16 4.5" />
      <path d="M27.5 4v6.5H21" />
      <path d="M16 11.5l4.5 4.5-4.5 4.5-4.5-4.5z" />
    </>
  ),
  project: (
    <>
      <path d="M3.5 16h7M21.5 16h7" />
      <path d="M23.5 11.5L28 16l-4.5 4.5" />
      <path d="M16 9.5l6.5 6.5-6.5 6.5L9.5 16z" />
    </>
  ),
  security: (
    <>
      <path d="M16 3.5l11 4v8.2c0 6.6-4.4 11.4-11 12.8-6.6-1.4-11-6.2-11-12.8V7.5z" />
      <path d="M11 15.5l3.6 3.6L21 12.5" />
    </>
  ),
} as const;

export type ServiceIconName = keyof typeof ICON_PATHS;

export function ServiceIcon({ name }: { name: ServiceIconName }) {
  return (
    <svg
      className="service-icon"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
