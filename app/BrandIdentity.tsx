/* eslint-disable @next/next/no-img-element -- This local brand asset does not need runtime image optimization. */

export function BrandIdentity() {
  return (
    <>
      <span className="brand-logo-surface" aria-hidden="true">
        <img
          className="brand-logo-image"
          src="/kcf-logo.png"
          alt=""
          width="1254"
          height="1254"
        />
      </span>
      <span className="brand-name">株式会社KCF</span>
    </>
  );
}
