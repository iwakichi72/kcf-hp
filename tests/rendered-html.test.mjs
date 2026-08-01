import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const previewDirectory = ["app/", "_sites", "-preview"].join("");
const skeletonDependency = ["react", "loading", "skeleton"].join("-");
const unpublishedPhoneNumber = ["080", "3150", "7576"].join("-");
const unpublishedContent = [
  ["掲載", "準備中"].join(""),
  ["導入", "実績"].join(""),
];
const starterMarkers = [
  ["codex", "preview"].join("-"),
  ["Building", "your", "site"].join(" "),
  ["Starter", "Project"].join(" "),
  ["Your", "site"].join(" "),
];

let renderSequence = 0;

async function render(pathname = "/", host = "localhost") {
  renderSequence += 1;

  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    `${process.pid}-${Date.now()}-${renderSequence}`,
  );
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://${host}${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

function assertJapaneseDocument(html) {
  assert.match(html, /<html\b[^>]*\blang=["']ja["'][^>]*>/i);
}

function assertNoUnpublishedContent(content) {
  assert.ok(!content.includes(unpublishedPhoneNumber));

  for (const marker of unpublishedContent) {
    assert.ok(!content.includes(marker));
  }
}

function assertNoStarterContent(content) {
  const normalizedContent = content.toLowerCase();

  for (const marker of starterMarkers) {
    assert.ok(!normalizedContent.includes(marker.toLowerCase()));
  }
}

test("renders the KCF corporate homepage", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assertJapaneseDocument(html);
  assert.match(html, /<title>株式会社KCF/);
  assert.match(
    html,
    /<h1\b[^>]*>[\s\S]*?構想で終わらせない。[\s\S]*?ITを、事業の力へ。[\s\S]*?<\/h1>/i,
  );
  assert.match(html, /事業内容/);
  assert.match(html, /KCFの強み/);
  assert.match(html, /ご相談テーマ例/);
  assert.match(html, /会社情報/);
  assert.match(html, /株式会社KCF/);

  // The mark belongs to the header and footer lockups. Pages load only the
  // 320px derivative; the 1254px master is the social preview image.
  assert.match(html, /src=["'][^"']*\/kcf-logo-320\.png["']/i);
  assert.ok(
    !/src=["'][^"']*\/kcf-logo\.png["']/i.test(html),
    "pages must not load the 290KB logo master",
  );
  assert.ok(
    !/hero-logo/.test(html),
    "the hero must not repeat the mark that the header already shows",
  );

  assert.match(html, /代表取締役/);
  assert.match(html, /熊澤\s*徹男/);
  assert.match(html, /〒115-0045/);
  assert.match(html, /東京都北区赤羽1-7-9/);
  assert.match(html, /赤羽第一葉山ビル4F/);
  assert.match(
    html,
    /href=["']mailto:kumazawa@kcf\.co\.jp(?:\?[^"']*)?["']/i,
  );
  assert.match(html, /kumazawa@kcf\.co\.jp/);
  assertNoUnpublishedContent(html);
  assertNoStarterContent(html);
});

test("renders the privacy policy", async () => {
  const response = await render("/privacy");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assertJapaneseDocument(html);
  assert.match(html, /プライバシーポリシー/);
  assert.match(html, /個人情報の取扱い方針/);
  assert.match(html, /利用目的/);
  assert.match(html, /第三者提供/);
  assert.match(html, /kumazawa@kcf\.co\.jp/);
  assert.match(
    html,
    /href=["']mailto:kumazawa@kcf\.co\.jp(?:\?[^"']*)?["']/i,
  );
  assertNoUnpublishedContent(html);
  assertNoStarterContent(html);
});

test("ships KCF metadata through an extensible metadata object", async () => {
  const layout = await readFile(new URL("app/layout.tsx", root), "utf8");

  assert.match(layout, /export const metadata\s*:\s*Metadata\s*=/);
  assert.match(layout, /株式会社KCF/);
  assert.match(layout, /description\s*:/);
  assert.match(layout, /openGraph\s*:/);
  assert.match(layout, /locale\s*:\s*["']ja_JP["']/);

  // The master stays in the build as the social preview image, which is the
  // only place a 1254px render of the mark is wanted.
  assert.match(layout, /images\s*:\s*\[\s*["']\/kcf-logo\.png["']\s*\]/);
  await access(new URL("public/kcf-logo.png", root));

  // Favicons are small derivatives of the KCF mark, never the 290KB master.
  const iconPath = layout.match(/icon\s*:\s*["'](\/kcf-[\w-]+\.png)["']/)?.[1];
  const applePath = layout.match(/apple\s*:\s*["'](\/kcf-[\w-]+\.png)["']/)?.[1];
  assert.ok(iconPath, "metadata.icons.icon must reference a local KCF png");
  assert.ok(applePath, "metadata.icons.apple must reference a local KCF png");

  for (const iconHref of [iconPath, applePath]) {
    const iconUrl = new URL(`public${iconHref}`, root);
    await access(iconUrl);
    const bytes = await readFile(iconUrl);
    assert.equal(bytes[25], 6, `${iconHref} must keep its RGBA alpha channel`);
    assert.ok(
      bytes.byteLength < 64 * 1024,
      `${iconHref} must stay under 64KB (was ${bytes.byteLength})`,
    );
  }
});

test("draws the hero symbol from the logo artwork rather than by hand", async () => {
  const [markData, figure, html] = await Promise.all([
    readFile(new URL("app/heroMark.ts", root), "utf8"),
    readFile(new URL("app/HeroFigure.tsx", root), "utf8"),
    render("/").then((response) => response.text()),
  ]);

  // The silhouette must stay a sampling of public/kcf-logo.png. Hand-editing
  // the coordinates would be redrawing the mark, which is not allowed.
  await access(new URL("scripts/generate-hero-mark.mjs", root));
  assert.match(markData, /Generated by scripts\/generate-hero-mark\.mjs/);
  assert.match(figure, /from "\.\/heroMark"/);

  const scanRows = markData.match(/\{ y: [\d.]+, runs: \[\[/g) ?? [];
  assert.ok(
    scanRows.length > 24,
    `the symbol should span many scan rows, saw ${scanRows.length}`,
  );

  assert.match(html, /class=["'][^"']*hero-figure-svg/);
});

test("contains no disposable starter preview or skeleton dependency", async () => {
  const [page, layout, packageSource, lockSource] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
    readFile(new URL("package-lock.json", root), "utf8"),
  ]);
  const packageJson = JSON.parse(packageSource);

  assertNoStarterContent(page);
  assertNoStarterContent(layout);
  assert.ok(!page.includes(["_sites", "-preview"].join("")));
  assert.ok(!page.includes(["Skeleton", "Preview"].join("")));
  assert.equal(packageJson.dependencies?.[skeletonDependency], undefined);
  assert.equal(packageJson.devDependencies?.[skeletonDependency], undefined);
  assert.ok(!lockSource.includes(skeletonDependency));
  await assert.rejects(access(new URL(previewDirectory, root)));
});

test("includes responsive and reduced-motion safeguards", async () => {
  const css = await readFile(new URL("app/globals.css", root), "utf8");

  assert.match(css, /--navy:\s*#071426/i);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(\s*max-width:\s*1080px\s*\)/i);
  assert.match(css, /@media\s*\(\s*max-width:\s*768px\s*\)/i);
  assert.match(
    css,
    /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/i,
  );
});

test("uses the transparent KCF logo in an executive white header", async () => {
  const [response, css, logo] = await Promise.all([
    render("/"),
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL("public/kcf-logo.png", root)),
  ]);
  const html = await response.text();
  const headerRule = css.match(/\.site-header\s*\{([\s\S]*?)\}/)?.[1] ?? "";
  const logoSurfaceRule =
    css.match(/\.brand-logo-surface\s*\{([\s\S]*?)\}/)?.[1] ?? "";

  assert.equal(logo[25], 6);
  assert.match(
    headerRule,
    /background:\s*rgba?\(\s*255\s*,\s*255\s*,\s*255/i,
  );
  assert.match(logoSurfaceRule, /background:\s*transparent/i);
  assert.ok(!/box-shadow:/i.test(logoSurfaceRule));
  assert.match(html, /class=["'][^"']*brand-logo-image/);
});

test("keeps the stylesheet as a single consolidated layer", async () => {
  const css = await readFile(new URL("app/globals.css", root), "utf8");

  // The redesign previously shipped as an append-only override block appended
  // after the old navy design. Every visual defect found in review traced back
  // to a base rule that block forgot to neutralise, so keep it to one layer.
  assert.equal(
    css.match(/^:root\s*\{/gm)?.length,
    1,
    "globals.css must declare :root exactly once at the top level",
  );

  // Markup for these was deleted when the hero network graphic was replaced.
  assert.ok(!/\.connection-(mark|line|node)/.test(css));

  // Corner brackets that used to frame a card which no longer has a border.
  assert.ok(!/\.hero-visual::(before|after)\s*\{/.test(css));

  // Motion is limited to the hero's first paint and to controls that actually
  // do something when activated. No scroll-driven reveals, no scroll-reactive
  // header, and no hover response on cards and rows that are only read.
  assert.ok(!/data-reveal|data-motion|data-condensed/.test(css));
  assert.ok(!/\.header-progress/.test(css));
  for (const passive of [
    "\\.challenge-card:hover",
    "\\.service-card:hover",
    "\\.company-row:hover",
  ]) {
    assert.ok(
      !new RegExp(passive).test(css),
      `${passive} must not react: it is not an activatable element`,
    );
  }

  // max-width:290px forced a 1-character orphan onto line 2 of every card.
  const challengeHeading =
    css.match(/\.challenge-card h3\s*\{([\s\S]*?)\}/)?.[1] ?? "";
  assert.ok(!/max-width:/i.test(challengeHeading));
});

test("meets contrast and target-size requirements", async () => {
  const [css, html] = await Promise.all([
    readFile(new URL("app/globals.css", root), "utf8"),
    render("/").then((response) => response.text()),
  ]);

  // The pale mark scores 2.16:1 on white; the focus ring must not use it.
  const focusRule = css.match(/:focus-visible\s*\{([\s\S]*?)\}/)?.[1] ?? "";
  assert.match(focusRule, /outline:[^;]*var\(--blue-deep\)/);

  // KCF blue is only 3.54:1 on navy, so the navy sections override the kicker.
  assert.match(css, /\.strength-section \.section-kicker/);
  assert.match(css, /\.contact-section \.section-kicker/);

  // Small links need a 44px target; the token must exist and be applied.
  assert.match(css, /--tap:\s*44px/);
  const footerLink = css.match(/\.footer-bottom a\s*\{([\s\S]*?)\}/)?.[1] ?? "";
  assert.match(footerLink, /min-height:\s*var\(--tap\)/);

  // A mailto: click can silently do nothing, so the flow must be explained.
  assert.match(html, /メールソフトが起動します/);
});

test("keeps the workers.dev preview out of search results", async () => {
  const preview = await render("/", "kcf-hp.example.workers.dev");
  await preview.text();

  assert.equal(
    preview.headers.get("x-robots-tag"),
    "noindex, nofollow",
    "the preview hostname must never be indexable",
  );

  // The guard has to retire itself. Nothing in the deploy would remind anyone
  // to strip a robots.txt once the custom domain is attached, so the rule is
  // keyed on the hostname rather than shipped as a file.
  const production = await render("/", "kcf.co.jp");
  await production.text();

  assert.equal(production.headers.get("x-robots-tag"), null);
});
