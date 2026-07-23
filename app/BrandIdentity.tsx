/* eslint-disable @next/next/no-img-element -- This local brand asset does not need runtime image optimization. */

type BrandLogoImageProps = {
  className?: string;
};

export function BrandLogoImage({ className = "" }: BrandLogoImageProps) {
  return (
    <img
      className={className}
      src="/kcf-logo.png"
      alt=""
      width="1254"
      height="1254"
    />
  );
}

export function BrandIdentity() {
  return (
    <>
      <span className="brand-logo-surface" aria-hidden="true">
        <BrandLogoImage className="brand-logo-image" />
      </span>
      <span className="brand-name">株式会社KCF</span>
    </>
  );
}
