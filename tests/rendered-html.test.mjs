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

async function render(pathname = "/") {
  renderSequence += 1;

  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    `${process.pid}-${Date.now()}-${renderSequence}`,
  );
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
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
  assert.match(html, /src=["'][^"']*\/kcf-logo\.png[^"']*["']/i);
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
  assert.match(layout, /icon\s*:\s*["']\/kcf-logo\.png["']/);
  await access(new URL("public/kcf-logo.png", root));
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
  assert.match(html, /class=["'][^"']*hero-logo-image/);
});
