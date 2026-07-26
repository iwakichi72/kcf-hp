/* eslint-disable @next/next/no-img-element -- This local brand asset does not need runtime image optimization. */

/**
 * The KCF mark appears in the header and footer lockups only, both of which
 * render it at 104px or less. The 320px derivative (39KB) is ample for that;
 * the 1254px master stays in `public/` and is served as the social preview
 * image from the layout metadata.
 */
const LOGO = { src: "/kcf-logo-320.png", size: 320 } as const;

type BrandLogoImageProps = {
  className?: string;
  loading?: "eager" | "lazy";
};

export function BrandLogoImage({
  className = "",
  loading = "eager",
}: BrandLogoImageProps) {
  return (
    <img
      className={className}
      src={LOGO.src}
      alt=""
      width={LOGO.size}
      height={LOGO.size}
      loading={loading}
      decoding="async"
    />
  );
}

type BrandIdentityProps = {
  loading?: "eager" | "lazy";
};

export function BrandIdentity({ loading = "eager" }: BrandIdentityProps) {
  return (
    <>
      <span className="brand-logo-surface" aria-hidden="true">
        <BrandLogoImage className="brand-logo-image" loading={loading} />
      </span>
      <span className="brand-name">株式会社KCF</span>
    </>
  );
}
