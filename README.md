# 株式会社KCF コーポレートサイト

IT コンサルティング会社・株式会社KCF のホームページ。トップページと
プライバシーポリシーの 2 ページ構成で、データベースも入力フォームも持たない。
問い合わせは `mailto:` リンクで受ける。

## 技術構成

- Next.js 16（App Router）/ React 19 / Tailwind CSS 4
- [vinext](https://github.com/cloudflare/vinext) でビルドし、Cloudflare Workers 上で動かす
- ビルド時に `dist/client`（静的アセット）と `dist/server`（Worker）を生成する。
  デプロイに使う `dist/server/wrangler.json` も自動生成されるため、
  手書きの `wrangler.jsonc` は置かない

## 必要環境

Node.js `>=22.13.0`

## コマンド

```bash
npm install
npm run dev    # ローカル開発（http://localhost:3000）
npm run build  # 本番ビルド
npm test       # ビルドしてレンダリング結果を検証する
npm run lint   # ESLint
```

`npm test` はビルド済みの Worker を実際に呼び出して HTML を検証する。
公開前チェックを兼ねており、未公開の連絡先や差し替え前の文言が混ざっていないか、
コントラストとタップ領域の要件を満たしているかまで見る。

## ディレクトリ

| パス | 内容 |
| --- | --- |
| `app/` | ページとコンポーネント。スタイルは `app/globals.css` の 1 枚にまとめる |
| `worker/index.ts` | Cloudflare Worker のエントリ |
| `public/` | ロゴとファビコン |
| `scripts/generate-hero-mark.mjs` | ヒーローのシンボルを生成する |
| `tests/rendered-html.test.mjs` | レンダリング結果の検証 |

## デプロイ

`main` ブランチへの push で Cloudflare Workers Builds が自動デプロイする。

| 設定項目 | 値 |
| --- | --- |
| Worker 名 | `kcf-hp`（`package.json` の `name` と一致させる。ずれるとビルドが失敗する）|
| 本番ブランチ | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy --config dist/server/wrangler.json` |

現在の公開先: <https://kcf-hp.iwakichi1197.workers.dev/>

`*.workers.dev` のホスト名でアクセスされたときだけ `X-Robots-Tag: noindex, nofollow`
を返す（`worker/index.ts`）。仮 URL が検索結果に残らないようにするためで、
独自ドメインを当てれば条件から外れて自動的に無効になる。

### 独自ドメインを当てるときの注意

`kcf.co.jp` は現在さくらのレンタルサーバー（`www3191.sakura.ne.jp`）にサイトと
メールが同居しており、**MX が apex `kcf.co.jp` 自身を指している**。この状態で
apex の A レコードを Worker に向けると、メールの配送先も Worker になって
**メールが止まる**。apex を使うなら、先に MX をサーバーのホスト名へ付け替え、
SPF も整合させること。

なお Cloudflare Workers のカスタムドメインは、サブドメインであっても
ゾーンが Cloudflare にあること（ネームサーバーの移管）を要求する。

## 編集するときに

- **文言のうち 2 か所は未確定**。`app/KcfAcronym.tsx` の `READINGS`（KCF の
  読み解き 5 種）と `app/privacy/page.tsx` のポリシー本文は、いずれも
  たたき台のまま。公開前に内容の承認を受けること
- **ヒーローのシンボルは手で描き替えない**。`app/heroMark.ts` は
  `public/kcf-logo.png` を `scripts/generate-hero-mark.mjs` で走査した生成物。
  形を変えるときはロゴを差し替えて `npm run gen:hero-mark` を実行する
- **`app/globals.css` は 1 レイヤーに保つ**。以前、旧デザインの上に上書き用の
  ブロックを継ぎ足した結果、打ち消し漏れによる表示崩れが続いた。テストが
  `:root` の重複を検出して落ちるようにしてある
