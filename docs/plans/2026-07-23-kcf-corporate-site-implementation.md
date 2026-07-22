# KCF Corporate Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 中小企業経営者からのIT相談獲得と紹介先への信用補完を両立する、株式会社KCFの公開可能な初版サイトを構築する。

**Architecture:** Sitesのvinextスターターを基盤に、React Server Componentsで静的なトップページとプライバシーポリシーを実装する。会社情報とコンテンツはソース内で管理し、問い合わせは`mailto:`のみとするため、API・データベース・認証・CMSは持たない。

**Tech Stack:** TypeScript 5.9、React 19、Next互換App Router、vinext、Vite、CSS、Node test runner、Cloudflare Workers／Sites

---

## 実装上の前提

- 承認済み設計: `docs/plans/2026-07-23-kcf-corporate-site-design.md`
- 対象: IT専任者が不足しがちな中小企業の経営者
- 主訴求: 構想から導入・運用・定着までの一貫伴走
- 採用情報、問い合わせフォーム、電話番号、CMS、アクセス解析は含めない
- 匿名実績の事実情報が未提供の間は、実績ではなく「ご相談テーマ例」と表記する
- 正式ロゴ受領までは文字ロゴ「KCF」を使用する
- スターターの仮プレビュー削除、依存パッケージ整理、ビルド出力の再生成、公開用一時ファイルの整理は、初回ビルド前にユーザーの削除許可を得てから行う
- React実装前に`@vercel-react-best-practices`を読み、設計判断へ反映する

### Task 1: Sitesスターターを初期化し、開発プレビューを起動する

**Files:**
- Create: `.openai/hosting.json`
- Create: `package.json`
- Create: `package-lock.json`
- Create: `app/page.tsx`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: starter support files copied by the initializer

**Step 1: 削除・再生成を伴う対象についてユーザーの許可を得る**

実装方式を選ぶ際に、次の範囲を明示して許可を得る。

- スターター仮プレビュー用の`app/_sites-preview`ディレクトリ（2ファイル）
- 未使用になる`react-loading-skeleton`依存関係と、その`node_modules`内生成物
- ビルドのたびに再生成される`dist`、`.next`、`.wrangler`等の生成物
- 公開パッケージ作成時に生成・整理される`/tmp`内の一時ステージとアーカイブ

許可が得られるまで初期化後のビルド、削除、パッケージ作成へ進まない。

**Step 2: 既存の設計書を初期化対象から一時退避する**

Run:

```bash
mkdir -p work/site-init-hold
mv docs work/site-init-hold/docs
```

Expected: `$PWD`直下には`.git`と`work`だけが残る。ファイル削除は行わない。

**Step 3: Sitesの公式初期化スクリプトを一度だけ実行する**

Run:

```bash
/Users/hunte/.codex/plugins/cache/openai-bundled/sites/0.1.30/scripts/init-site.sh "$PWD"
```

Expected: vinextスターターが作成され、`npm ci`が成功する。

**Step 4: 設計書を元の位置へ戻す**

Run:

```bash
mv work/site-init-hold/docs docs
```

Expected: `docs/plans/`に設計書と本計画書が存在する。

**Step 5: 開発サーバーを保持セッションで起動する**

Run:

```bash
npm run dev
```

Expected: vinextが正確なLocal URLを表示する。サーバーは以後の実装中も保持する。

**Step 6: Local URLをアプリ内プレビューで一度だけ開く**

Run: `open_in_codex`でStep 5のLocal URLを開く。

Expected: スターターの読み込み画面が表示される。追加のクリック、スクリーンショット、DOM検査は行わない。

**Step 7: スターターをコミットする**

```bash
git add .
git commit -m "chore: initialize KCF site"
```

### Task 2: 完成ページの振る舞いをテストで定義する

**Files:**
- Modify: `tests/rendered-html.test.mjs`

**Step 1: スターター用テストをKCF用のレンダリングテストへ置き換える**

テストは次を実装する。

```js
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
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

test("renders the KCF corporate homepage", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<html[^>]+lang=["']ja["']/i);
  assert.match(html, /<title>株式会社KCF/);
  assert.match(html, /構想で終わらせない/);
  assert.match(html, /事業内容/);
  assert.match(html, /KCFの強み/);
  assert.match(html, /ご相談テーマ例/);
  assert.match(html, /会社情報/);
  assert.match(html, /熊澤\s*徹男/);
  assert.match(html, /mailto:kumazawa@kcf\.co\.jp/);
  assert.doesNotMatch(html, /080-3150-7576/);
  assert.doesNotMatch(html, /codex-preview|Building your site/i);
});

test("renders the privacy policy", async () => {
  const response = await render("/privacy");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /プライバシーポリシー/);
  assert.match(html, /利用目的/);
  assert.match(html, /kumazawa@kcf\.co\.jp/);
});

test("ships KCF metadata and no starter preview", async () => {
  const [layout, page, packageJson] = await Promise.all([
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);

  assert.match(layout, /株式会社KCF/);
  assert.match(layout, /openGraph/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("app/_sites-preview", root)));
});
```

**Step 2: テストを実行し、未実装で失敗することを確認する**

Run:

```bash
npm test
```

Expected: KCF固有の見出し、`/privacy`、メタデータ、スターター整理の条件でFAILする。

**Step 3: テスト定義をコミットする**

```bash
git add tests/rendered-html.test.mjs
git commit -m "test: define KCF site rendering requirements"
```

### Task 3: サイト構造と実コンテンツを実装する

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Create: `app/privacy/page.tsx`

**Step 1: `app/layout.tsx`をKCF向けに置き換える**

実装条件:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "株式会社KCF｜構想から定着まで伴走するITコンサルティング",
    template: "%s｜株式会社KCF",
  },
  description:
    "株式会社KCFは、中小企業のIT戦略からシステム導入、運用・定着まで一貫して伴走するITコンサルティング会社です。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "株式会社KCF",
    title: "株式会社KCF｜構想で終わらせない。ITを、事業の力へ。",
    description:
      "IT戦略の策定からシステム導入、運用・定着まで一貫して伴走します。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
```

Google Fontsへの実行時依存は追加せず、日本語対応のシステムフォントスタックをCSSで指定する。

**Step 2: `app/page.tsx`に全セクションを実装する**

ページ内の静的データはファイル上部のreadonly配列へまとめる。

```tsx
const services = [
  ["01", "IT戦略・DX支援", "経営課題を起点に、優先順位と実行計画を整理します。"],
  ["02", "システム・ITツール導入", "要件整理から選定、導入、活用開始まで支援します。"],
  ["03", "業務改善・自動化", "業務を可視化し、無理なく続く効率化を設計します。"],
  ["04", "プロジェクト推進", "進捗・課題・ベンダー間の調整を担い、実行を前へ進めます。"],
  ["05", "情報セキュリティ", "事業規模とリスクに合った現実的な対策を整えます。"],
] as const;

const themes = [
  "ITの優先順位を整理し、投資計画へ落とし込みたい",
  "導入済みのシステムを現場に定着させたい",
  "複数ベンダーをまとめ、プロジェクトを前へ進めたい",
] as const;

const steps = ["初回相談", "課題整理", "方針・計画策定", "導入・実行支援", "定着・継続改善"] as const;
```

次のランドマークと文言を含める。

- `<header>`: 文字ロゴ、デスクトップナビ、`<details>`を使ったJavaScript不要のモバイルナビ
- `<main id="main-content">`: スキップリンクの移動先
- `<section className="hero">`: 「構想で終わらせない。ITを、事業の力へ。」
- 課題セクション: 3つの経営課題
- `<section id="services">`: 5つの事業内容
- `<section id="strength">`: 構想→導入→運用→定着の一貫支援
- `<section id="themes">`: 実績ではないことが明確な「ご相談テーマ例」
- 支援の流れ: 5段階
- `<section id="company">`: 株式会社KCF、代表取締役 熊澤 徹男、〒115-0045 東京都北区赤羽1-7-9 赤羽第一葉山ビル4F
- `<section id="contact">`: `mailto:kumazawa@kcf.co.jp`と表示用メールアドレス
- `<footer>`: `/privacy`へのリンク

CTAのメールリンクは件名を事前入力する。

```tsx
const contactHref =
  "mailto:kumazawa@kcf.co.jp?subject=" +
  encodeURIComponent("ホームページを見てのご相談");
```

**Step 3: `app/privacy/page.tsx`を実装する**

個人情報保護委員会の通則ガイドラインを参照し、利用目的を具体的に記載する。法的確定稿ではなく公開前確認対象であることをコードコメントに残す。記載項目は以下とする。

- 個人情報の取扱い方針
- 取得する情報（メール相談で利用者が送信した情報）
- 利用目的（問い合わせ対応、提案・契約に必要な連絡、サービス改善）
- 第三者提供
- 安全管理
- 開示等の請求
- お問い合わせ先
- 改定

参考: https://www.ppc.go.jp/personalinfo/legal/guidelines_tsusoku/

**Step 4: TypeScriptとLintを確認する**

Run:

```bash
npm run lint
```

Expected: エラー0件。

**Step 5: 構造実装をコミットする**

```bash
git add app/page.tsx app/layout.tsx app/privacy/page.tsx
git commit -m "feat: add KCF site content and structure"
```

### Task 4: 先進的でシャープなレスポンシブデザインを実装する

**Files:**
- Modify: `app/globals.css`

**Step 1: デザイン要件をCSSソーステストへ追加する**

`tests/rendered-html.test.mjs`へ次を追加する。

```js
test("includes responsive and reduced-motion safeguards", async () => {
  const css = await readFile(new URL("app/globals.css", root), "utf8");
  assert.match(css, /--navy:\s*#071426/i);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});
```

**Step 2: テストを実行し、スタイル要件で失敗することを確認する**

Run:

```bash
npm run build
node --test tests/rendered-html.test.mjs
```

Expected: 最新の構造実装がビルドされ、CSSトークンとスターター整理の未実装条件でFAILする。

**Step 3: `app/globals.css`を全面実装する**

必須トークン:

```css
:root {
  --navy: #071426;
  --navy-soft: #0d2039;
  --blue: #2563eb;
  --cyan: #61d6ff;
  --ink: #10213b;
  --muted: #5d6c80;
  --surface: #f4f8fc;
  --white: #ffffff;
  --line: rgba(108, 187, 255, 0.24);
  --content: 1180px;
  --radius: 18px;
}
```

実装対象:

- `scroll-behavior: smooth`と固定ヘッダーを考慮した`scroll-margin-top`
- 濃紺のヒーロー、CSSグリッド線、青い光点、斜めの罫線
- 十分な余白を持つセクションと最大幅コンテナ
- 5列からレスポンシブに変化するサービスカード
- 工程が連続して見える一貫支援レール
- 明確なCTA、ホバー、`:focus-visible`
- `768px`以下の1列レイアウトとモバイルナビ
- `prefers-reduced-motion: reduce`でアニメーションとスムーズスクロールを停止
- `prefers-contrast: more`で境界線を強める

モデル生成SVGや外部画像は使わず、装飾はCSSのみで構成する。

**Step 4: Lintを実行する**

Run: `npm run lint`

Expected: エラー0件。

**Step 5: デザイン実装をコミットする**

```bash
git add app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: style the KCF corporate site"
```

### Task 5: スターターを整理し、テストを通す

**Files:**
- Delete after explicit user approval: `app/_sites-preview/SkeletonPreview.tsx`
- Delete after explicit user approval: `app/_sites-preview/preview.css`
- Modify: `package.json`
- Modify: `package-lock.json`

**Step 1: Task 1で得た削除許可の範囲を確認する**

次の対象がTask 1の許可に含まれていることを確認する。

- スターター仮プレビュー用の`app/_sites-preview`ディレクトリ（2ファイル）
- 未使用になる`react-loading-skeleton`依存関係
- 再生成される`dist`等のビルド出力

許可が未取得、撤回済み、または対象範囲が変わった場合は、削除操作を行わず再確認する。

**Step 2: 仮プレビューと依存関係を削除する**

Run:

```bash
git rm -r app/_sites-preview
npm uninstall react-loading-skeleton
```

Expected: `app/_sites-preview`がなくなり、`package.json`とロックファイルから依存関係が消える。

**Step 3: 完成ページのテストを実行する**

Run:

```bash
npm test
```

Expected: ビルド成功後、全テストPASS。

**Step 4: スターター整理をコミットする**

```bash
git add package.json package-lock.json tests/rendered-html.test.mjs
git commit -m "chore: remove starter preview"
```

### Task 6: サイト専用のソーシャルカードを追加する

**Files:**
- Create: `public/og.png`
- Modify: `app/layout.tsx`
- Modify: `tests/rendered-html.test.mjs`

**Step 1: `@imagegen`を読み、完成デザインに合わせた画像を1枚だけ生成する**

画像条件:

- 1200×630相当の横長
- 濃紺、KCFブルー、明るいシアン
- 「株式会社KCF」「構想で終わらせない。ITを、事業の力へ。」を正確に含める
- 連結する線、グリッド、光点を用いる
- 無関係なロゴ、人物、透かしを含めない

**Step 2: 生成画像を検査する**

`view_image`で、文字の誤り・欠落・架空要素がないことを確認する。使用不能な場合に限り一度だけ再生成する。再生成後も文字や内容が不正確な場合は、誤ったカードを掲載せず、OG画像参照を省略してテキストメタデータだけを公開する。

**Step 3: `public/og.png`へ保存し、メタデータへ追加する**

ホスト由来の絶対URLになるよう、`metadataBase`または動的メタデータで`/og.png`を指定する。固定の未確定ドメインはハードコードしない。

**Step 4: OG画像のテストを追加する**

```js
test("ships a bespoke social card", async () => {
  await access(new URL("public/og.png", root));
  const layout = await readFile(new URL("app/layout.tsx", root), "utf8");
  assert.match(layout, /og\.png/);
  assert.match(layout, /twitter/i);
});
```

**Step 5: ビルドとテストを実行する**

Run: `npm test`

Expected: 全テストPASS。

**Step 6: ソーシャルカードをコミットする**

```bash
git add public/og.png app/layout.tsx tests/rendered-html.test.mjs
git commit -m "feat: add KCF social preview"
```

### Task 7: 最終検証を行う

**Files:**
- Verify: `app/page.tsx`
- Verify: `app/privacy/page.tsx`
- Verify: `app/layout.tsx`
- Verify: `app/globals.css`
- Verify: `.openai/hosting.json`

**Step 1: 個人情報と仮コンテンツを確認する**

Run:

```bash
rg -n "080-3150-7576|掲載準備中|導入実績|codex-preview|Starter Project|Your site" app public package.json
```

Expected: 一致なし。電話番号、実在すると誤認される仮実績、スターター文言がない。

**Step 2: メール、会社情報、アクセシビリティ要素を確認する**

Run:

```bash
rg -n "kumazawa@kcf.co.jp|熊澤 徹男|赤羽第一葉山ビル4F|main-content|prefers-reduced-motion|focus-visible" app
```

Expected: 必要箇所にすべて存在する。

**Step 3: 本番ビルドとテストを実行する**

Run:

```bash
npm test
```

Expected: `dist/server/index.js`を含む本番出力が生成され、全テストPASS。

**Step 4: 作業ツリーを確認する**

Run: `git status --short`

Expected: 追跡対象の未コミット変更なし。

### Task 8: Sitesへ非公開で公開する

**Files:**
- Modify: `.openai/hosting.json`（Sitesの`project_id`のみ追加）
- Create temporarily: deployment archive under `/tmp`

**Step 1: `@sites:sites-hosting`を使って新規サイトを一度だけ作成する**

Sites connectorの`create_site`を呼び、返された`project_id`を`.openai/hosting.json`へ保存する。ソース書き込み用認証情報はGit設定やURLに保存しない。

**Step 2: 検証済みソースを最終コミットする**

```bash
git add .openai/hosting.json
git commit -m "chore: configure KCF site hosting"
```

**Step 3: Sitesのソースリポジトリへ検証済みHEADを送る**

返された一時認証情報をHTTPヘッダーとして、そのコマンドだけに渡す。ブランチHEADのSHAを保存する。

**Step 4: 公式パッケージスクリプトでアーカイブを作る**

Run:

```bash
/Users/hunte/.codex/plugins/cache/openai-bundled/sites/0.1.30/scripts/package-site.sh "$PWD" /tmp/kcf-site.tar.gz
```

Expected: `dist/`、ホスティング設定を含む検証済みアーカイブが作成される。

**Step 5: 1バージョンだけ保存し、非公開でデプロイする**

Sites connectorの`save_site_version`、`deploy_private_site_version`を順に一度ずつ呼ぶ。`get_deployment_status`で成功または失敗まで確認する。

**Step 6: 公開URLを一度だけ開く**

成功時のみ、返されたURLを`open_in_codex`で開く。

**Step 7: 開発サーバーを停止する**

保持している`npm run dev`セッションへ`Ctrl-C`を送り、正常終了を確認する。

**Step 8: ユーザーへ共有する**

非公開のSites URL、初版で確認してほしい項目（ロゴ、代表メッセージ、匿名事例、会社情報）を簡潔に伝える。
