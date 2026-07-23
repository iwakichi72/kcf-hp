# KCF Executive White Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rework the existing KCF corporate site into an executive-white design that makes the transparent business-card logo the primary visual identity.

**Architecture:** Keep the existing Next.js/vinext routes, static content, anchor navigation, and mailto contact flow. Refactor the shared brand component for reusable logo rendering, simplify the homepage hero markup, and replace the current decorative CSS system with a restrained white, pale-blue, KCF-blue, and navy design system.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, vinext, Node test runner, ESLint

---

### Task 1: Lock the visual requirements with tests

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Test: `tests/rendered-html.test.mjs`

**Step 1: Write failing tests**

Add assertions that:

```js
const logo = await readFile(new URL("public/kcf-logo.png", root));
assert.equal(logo[25], 6); // PNG color type 6: RGBA

const headerRule = css.match(/\.site-header\s*\{([\s\S]*?)\}/)?.[1] ?? "";
assert.match(headerRule, /background:\s*rgba?\(\s*255\s*,\s*255\s*,\s*255/i);

const logoSurfaceRule =
  css.match(/\.brand-logo-surface\s*\{([\s\S]*?)\}/)?.[1] ?? "";
assert.match(logoSurfaceRule, /background:\s*transparent/i);
assert.ok(!/box-shadow:/i.test(logoSurfaceRule));

assert.match(html, /class=["'][^"']*hero-logo-image/);
```

Also assert that the responsive stylesheet retains the `1080px`, `768px`, and reduced-motion safeguards.

**Step 2: Run the tests to verify failure**

Run: `npm test`

Expected: FAIL because the header is still navy, the logo surface still has a white background and shadow, and the new hero logo class is absent.

**Step 3: Commit the failing tests**

```bash
git add tests/rendered-html.test.mjs
git commit -m "test: define executive white redesign"
```

### Task 2: Make the logo reusable and prominent

**Files:**
- Modify: `app/BrandIdentity.tsx`
- Modify: `app/page.tsx`
- Test: `tests/rendered-html.test.mjs`

**Step 1: Add a reusable logo image component**

Refactor the brand module to expose the image separately:

```tsx
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
```

**Step 2: Replace the generic hero network graphic**

Use the transparent KCF logo as the hero visual:

```tsx
<div className="hero-visual" aria-hidden="true">
  <div className="hero-logo-stage">
    <BrandLogoImage className="hero-logo-image" />
  </div>
  <p className="hero-visual-caption">STRATEGY TO ADOPTION</p>
</div>
```

Remove the connection-line and connection-node markup.

**Step 3: Run lint and tests**

Run: `npm run lint`

Expected: PASS.

Run: `npm test`

Expected: Still fails only on CSS expectations from Task 1.

**Step 4: Commit the component changes**

```bash
git add app/BrandIdentity.tsx app/page.tsx
git commit -m "feat: make KCF logo the hero visual"
```

### Task 3: Apply the executive-white visual system

**Files:**
- Modify: `app/globals.css`
- Modify: `app/privacy/page.tsx` only if a class hook is required
- Test: `tests/rendered-html.test.mjs`

**Step 1: Update global tokens and header**

Use white, pale blue-gray, KCF blue, and navy. Set `.site-header` to an opaque or nearly opaque white background with a subtle blue-gray border and restrained shadow. Set `.brand-logo-surface` to transparent with no border, radius, background, or shadow. Change header navigation, company name, privacy back link, mobile menu label, and hamburger lines to navy.

**Step 2: Redesign the hero**

Use a bright background with subtle blue geometry. Keep the headline dark navy, emphasize its second line in KCF blue, convert the primary CTA to blue-on-white contrast, and place the transparent logo in a large right-hand stage without a surrounding card or white plate.

**Step 3: Simplify content sections**

- Replace heavy card shadows and decorative corner graphics with thin borders and whitespace.
- Keep section backgrounds alternating between white and pale blue-gray.
- Preserve one navy strength section for contrast.
- Normalize section heading sizes, spacing, and English labels.
- Make services a precise numbered grid.
- Reduce hover movement to a subtle border/color change.
- Keep the contact area as the strongest CTA near the bottom.

**Step 4: Adapt footer and privacy page**

Keep the footer navy. Render the same transparent logo as a monochrome light mark via the footer-specific `.brand-logo-image` filter, without adding a background plate. Apply the white header treatment to the privacy route and update its back-link contrast.

**Step 5: Complete responsive and motion styles**

At `1080px`, switch navigation cleanly. At `768px`, use a white dropdown panel, navy text, blue CTA, and compact logo. Preserve keyboard focus and `prefers-reduced-motion`.

**Step 6: Run validation**

Run: `npm run lint`

Expected: PASS with no warnings.

Run: `npm test`

Expected: Build succeeds and all rendering tests pass.

**Step 7: Commit the redesign**

```bash
git add app/globals.css app/privacy/page.tsx tests/rendered-html.test.mjs
git commit -m "feat: apply executive white KCF design"
```

### Task 4: Package and publish the validated site

**Files:**
- Verify: `.openai/hosting.json`
- Verify: `dist/server/index.js`

**Step 1: Confirm the repository is clean and HEAD is validated**

Run: `git status --short`

Expected: No output.

Run: `git rev-parse HEAD`

Expected: A full commit SHA.

**Step 2: Push the exact HEAD**

Obtain a short-lived Sites source repository credential and push HEAD to the configured `main` source branch with per-command authentication.

Expected: Remote `main` points to the same full SHA.

**Step 3: Package the site**

Run the Sites `package-site.sh` helper with the project directory and a uniquely created archive path.

Expected: A valid archive containing `dist/server/index.js` and `.openai/hosting.json`.

**Step 4: Save and deploy**

Save one site version with the exact commit SHA and archive, then deploy it with owner-only access.

Expected: Deployment status reaches `succeeded`.

**Step 5: Verify the live handoff**

Confirm that the live URL remains:

```text
https://kcf-it-consulting.hunterhunter373.chatgpt.site
```

Remove only the explicitly approved deployment temporary files after success.
