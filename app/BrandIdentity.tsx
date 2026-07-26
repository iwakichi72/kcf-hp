/* eslint-disable @next/next/no-img-element -- This local brand asset does not need runtime image optimization. */

/**
 * The KCF mark ships at two resolutions of the *same* artwork. `full` is the
 * 1254px master used for the large hero mark; `compact` is a 320px derivative
 * (39KB vs 290KB) that is ample for the 104px header and footer lockups.
 */
const LOGO_SOURCES = {
  full: { src: "/kcf-logo.png", size: 1254 },
  compact: { src: "/kcf-logo-320.png", size: 320 },
} as const;

type BrandLogoVariant = keyof typeof LOGO_SOURCES;

type BrandLogoImageProps = {
  className?: string;
  variant?: BrandLogoVariant;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
};

export function BrandLogoImage({
  className = "",
  variant = "compact",
  loading = "eager",
  fetchPriority = "auto",
}: BrandLogoImageProps) {
  const { src, size } = LOGO_SOURCES[variant];

  const image = (
    <img
      className={className}
      src={src}
      alt=""
      width={size}
      height={size}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
    />
  );

  // `.hero-visual` is display:none below 901px, but browsers still fetch images
  // inside a hidden subtree. Point narrow viewports at the 320px derivative so
  // phones do not download the 290KB master for a mark they never see.
  if (variant === "full") {
    return (
      <picture>
        <source
          media="(max-width: 900px)"
          srcSet={LOGO_SOURCES.compact.src}
        />
        {image}
      </picture>
    );
  }

  return image;
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
