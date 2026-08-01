import Link from "next/link";
import { BackToTop } from "./BackToTop";
import { BrandIdentity } from "./BrandIdentity";
import { HeroFigure } from "./HeroFigure";
import { KcfAcronym } from "./KcfAcronym";
import { NAV_ITEMS } from "./navigation";
import { ServiceIcon, type ServiceIconName } from "./ServiceIcon";
import { SiteHeader } from "./SiteHeader";

const challenges = [
  [
    "01",
    "何から始めるべきか、判断できない",
    "課題は感じていても、IT投資の優先順位や進め方を決めきれない。",
  ],
  [
    "02",
    "導入したツールが、現場に定着しない",
    "新しい仕組みを入れても、十分に活用されず効果が見えにくい。",
  ],
  [
    "03",
    "ベンダーとの調整が、前へ進まない",
    "要望がうまく伝わらず、判断やプロジェクト推進の負担が大きい。",
  ],
] as const;

const services: readonly (readonly [
  string,
  ServiceIconName,
  string,
  string,
])[] = [
  [
    "01",
    "strategy",
    "IT戦略・DX支援",
    "経営課題を起点に、優先順位と実行計画を整理します。",
  ],
  [
    "02",
    "system",
    "システム・ITツール導入",
    "要件整理から選定、導入、活用開始まで支援します。",
  ],
  [
    "03",
    "automation",
    "業務改善・自動化",
    "業務を可視化し、無理なく続く効率化を設計します。",
  ],
  [
    "04",
    "project",
    "プロジェクト推進",
    "進捗・課題・ベンダー間の調整を担い、実行を前へ進めます。",
  ],
  [
    "05",
    "security",
    "情報セキュリティ",
    "事業規模とリスクに合った現実的な対策を整えます。",
  ],
];

// 時系列の説明は「支援の流れ」に一本化し、ここでは進め方の姿勢を述べる。
const strengths = [
  [
    "経営と現場、両方の言葉で話す",
    "経営課題を起点に方針を描きながら、現場で実際に使われる形まで落とし込みます。どちらか一方の理屈だけで進めません。",
  ],
  [
    "決まっていない段階から相談できる",
    "課題が整理できていない、ツールも決めていない。その状態からお聞きし、状況を言葉にするところから一緒に進めます。",
  ],
  [
    "「導入完了」を区切りにしない",
    "現場で使われているか、改善が続いているかを確かめながら、定着までを支援の範囲として設計します。",
  ],
] as const;

const themes = [
  "ITの優先順位を整理し、投資計画へ落とし込みたい",
  "導入済みのシステムを現場に定着させたい",
  "複数ベンダーをまとめ、プロジェクトを前へ進めたい",
] as const;

const steps = [
  "初回相談",
  "課題整理",
  "方針・計画策定",
  "導入・実行支援",
  "定着・継続改善",
] as const;

/* 空のメールを開くと何から書けばよいか迷って手が止まる。宛名と項目だけ
   入れておけば、埋めるだけで用が足りる。ページで「課題が整理できていない
   段階でもご相談いただけます」と約束している以上、相談内容の欄が書けないと
   送れないように見えてはいけないので、そこは注記を添えて最後に置く。 */
const contactBody = [
  "株式会社KCF ご担当者さま",
  "",
  "ホームページを拝見し、ご相談したくご連絡いたしました。",
  "",
  "■ 会社名・団体名：",
  "■ 氏名：",
  "■ 電話番号：",
  "■ 希望する連絡方法・時間帯：",
  "",
  "■ 相談したい内容（整理できていない段階のままで構いません）：",
  "",
  "",
].join("\n");

const contactHref =
  "mailto:kumazawa@kcf.co.jp?subject=" +
  encodeURIComponent("ホームページを見てのご相談") +
  "&body=" +
  encodeURIComponent(contactBody);

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        本文へ移動
      </a>

      <SiteHeader />

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-figure" aria-hidden="true">
            <HeroFigure />
          </div>

          <div className="section-shell hero-inner">
            <div className="hero-copy">
              {/* 「IT CONSULTING」はテンプレートの既定値で、業種の名乗りにしか
                  ならない。所在地は事実で、かつこの会社にしか書けない一行。 */}
              <p className="section-kicker">AKABANE, TOKYO</p>
              <h1 className="hero-title" id="hero-title">
                <span className="hero-title-line hero-title-line-dark">
                  <span className="hero-title-text">構想で終わらせない。</span>
                </span>
                <span className="hero-title-line hero-title-line-blue">
                  <span className="hero-title-text">ITを、事業の力へ。</span>
                </span>
              </h1>
              <p className="hero-description">
                株式会社KCFは、IT戦略の策定からシステム導入、運用・定着まで
                一貫して伴走するITコンサルティング会社です。
              </p>
              <div className="hero-actions">
                <a className="primary-button" href="#contact">
                  <span>相談する</span>
                  <span className="button-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
                <a className="secondary-button" href="#services">
                  <span>事業内容を見る</span>
                  <span className="button-arrow" aria-hidden="true">
                    ↓
                  </span>
                </a>
              </div>
              <p className="hero-note">
                <span aria-hidden="true" />
                課題が整理できていない段階でもご相談いただけます。
              </p>
            </div>
          </div>
        </section>

        {/* ヒーローの直後。売り込みに入る前に、社名そのものを一度開いて見せる。 */}
        <KcfAcronym />

        <section className="challenges-section" aria-labelledby="challenges-title">
          <div className="section-shell">
            <div className="section-heading">
              <div>
                <p className="section-kicker section-kicker-dark">BUSINESS CHALLENGES</p>
                {/* 経営者が困っているのは「IT」ではなく、決めきれないこと。
                    見出しは症状の言葉で置き、IT は下の本文で受ける。 */}
                <h2 id="challenges-title">判断が、止まっていませんか。</h2>
              </div>
              <p className="section-introduction">
                ITの課題は、経営と現場のあいだで複雑になりがちです。
                KCFが状況を整理し、実行できる道筋へつなげます。
              </p>
            </div>

            <div className="challenge-grid">
              {challenges.map(([number, title, description]) => (
                <article className="challenge-card" key={number}>
                  <span className="challenge-ghost" aria-hidden="true">
                    {number}
                  </span>
                  <span className="card-number">{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="services-section" id="services" aria-labelledby="services-title">
          <div className="section-shell">
            <div className="section-heading">
              <div>
                <p className="section-kicker section-kicker-dark">SERVICES</p>
                <h2 id="services-title">事業内容</h2>
              </div>
              <p className="section-introduction">
                個別の施策だけでなく、経営課題の整理から導入後の活用まで。
                必要な領域を組み合わせて支援します。
              </p>
            </div>

            <div className="service-grid">
              {services.map(([number, icon, title, description]) => (
                <article className="service-card" key={number}>
                  <div className="service-card-header">
                    <span className="service-icon-tile" aria-hidden="true">
                      <ServiceIcon name={icon} />
                    </span>
                    <span className="card-number">{number}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <span className="service-card-rule" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="strength-section" id="strength" aria-labelledby="strength-title">
          <div className="section-shell strength-layout">
            <div className="strength-copy">
              <p className="section-kicker">OUR STRENGTH</p>
              <h2 id="strength-title">
                提案だけで終わらない。
                <span>現場で使われるまでを、仕事の範囲にする。</span>
              </h2>
              <p>
                KCFは、計画を提示して完了するのではなく、導入・運用・社内定着までを
                ひとつのプロセスとして支援します。経営の意図を現場の実行へつなぎ、
                改善が続く状態を目指して支援します。
              </p>
            </div>

            <ul className="strength-list">
              {strengths.map(([title, description]) => (
                <li className="strength-item" key={title}>
                  <span className="strength-marker" aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="themes-section" id="themes" aria-labelledby="themes-title">
          <div className="section-shell">
            <div className="section-heading">
              <div>
                <p className="section-kicker section-kicker-dark">CONSULTATION THEMES</p>
                <h2 id="themes-title">ご相談テーマ例</h2>
              </div>
              <p className="section-introduction">
                「相談内容がまとまっていない」という段階から、状況を一緒に整理します。
              </p>
            </div>

            <p className="themes-disclaimer">
              以下はご相談内容をイメージしていただくためのテーマ例であり、
              特定のお客様への支援実績を示すものではありません。
            </p>

            <div className="theme-list">
              {themes.map((theme, index) => (
                <a className="theme-card" href="#contact" key={theme}>
                  <span className="theme-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <h3>{theme}</h3>
                  {/* Not aria-hidden: it is what tells a screen reader where
                      the theme links to. Only the glyph is decorative. */}
                  <span className="theme-action">
                    このテーマで相談する
                    <span className="button-arrow" aria-hidden="true">
                      →
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="process-section" aria-labelledby="process-title">
          <div className="section-shell">
            <div className="section-heading process-heading">
              <div>
                <p className="section-kicker section-kicker-dark">PROCESS</p>
                <h2 id="process-title">支援の流れ</h2>
              </div>
              <p className="section-introduction">
                課題の把握から定着後の改善まで、状況に応じて段階的に進めます。
              </p>
            </div>

            <ol className="process-list">
              {steps.map((step, index) => (
                <li className="process-step" key={step}>
                  <span className="process-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="process-name">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="company-section" id="company" aria-labelledby="company-title">
          <div className="section-shell">
            {/* OUR APPROACH ブロックは削除した。理念は KCF セクションが、
                進め方は強みセクションが担っていて、ここでは三度目の再掲に
                なっていた。左右分割をやめ、他セクションと同じ
                「見出し → 全幅の中身」に揃える。 */}
            <div className="section-heading">
              <div>
                <p className="section-kicker section-kicker-dark">COMPANY</p>
                <h2 id="company-title">会社情報</h2>
              </div>
              <p className="section-introduction">
                登記および事業上の基本情報です。
              </p>
            </div>

            <dl className="company-details">
              <div className="company-row">
                <dt>会社名</dt>
                <dd>株式会社KCF</dd>
              </div>
              <div className="company-row">
                <dt>代表者</dt>
                <dd>代表取締役　熊澤 徹男</dd>
              </div>
              <div className="company-row">
                <dt>所在地</dt>
                <dd>
                  <span>〒115-0045</span>
                  <span>東京都北区赤羽1-7-9 赤羽第一葉山ビル4F</span>
                </dd>
              </div>
              <div className="company-row">
                <dt>事業内容</dt>
                <dd>ITコンサルティング</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="section-shell contact-layout">
            <div className="contact-copy">
              <p className="section-kicker">CONTACT</p>
              <h2 id="contact-title">
                決めきれないことを、
                <span>一緒に整理することから。</span>
              </h2>
              <p>
                相談内容や導入したいツールが決まっていなくても構いません。
                現在の状況と気になっていることを、まずはお聞かせください。
              </p>
            </div>

            <div className="contact-action">
              <a className="contact-email-button" href={contactHref}>
                <span>メールで相談する</span>
                <span className="button-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
              <p className="contact-note">
                ボタンを押すと、ご利用のメールソフトが起動します。
                起動しない場合は、下記のアドレス宛に直接ご送信ください。
              </p>
              <p className="contact-email-address">
                <span>メールアドレス</span>
                <a href={contactHref}>kumazawa@kcf.co.jp</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-shell footer-main">
          <div className="footer-brand">
            <a className="brand-link" href="#top" aria-label="株式会社KCF トップへ">
              <BrandIdentity loading="lazy" />
            </a>
            <p>構想から導入・運用・定着まで伴走するITコンサルティング会社</p>
          </div>

          <nav className="footer-navigation" aria-label="フッターナビゲーション">
            <p className="footer-heading">サイトマップ</p>
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
              <li>
                <a href="#contact">お問い合わせ</a>
              </li>
            </ul>
          </nav>

          <div className="footer-information">
            <p className="footer-heading">所在地・連絡先</p>
            <p>〒115-0045 東京都北区赤羽1-7-9 赤羽第一葉山ビル4F</p>
            <a href={contactHref}>kumazawa@kcf.co.jp</a>
          </div>
        </div>

        <div className="section-shell footer-bottom">
          <p>© 2026 KCF Inc.</p>
          <Link href="/privacy">プライバシーポリシー</Link>
        </div>
      </footer>

      <BackToTop />
    </>
  );
}
