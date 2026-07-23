import Link from "next/link";
import { BrandIdentity } from "./BrandIdentity";
import { MobileNavigation } from "./MobileNavigation";

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

const services = [
  [
    "01",
    "IT戦略・DX支援",
    "経営課題を起点に、優先順位と実行計画を整理します。",
  ],
  [
    "02",
    "システム・ITツール導入",
    "要件整理から選定、導入、活用開始まで支援します。",
  ],
  [
    "03",
    "業務改善・自動化",
    "業務を可視化し、無理なく続く効率化を設計します。",
  ],
  [
    "04",
    "プロジェクト推進",
    "進捗・課題・ベンダー間の調整を担い、実行を前へ進めます。",
  ],
  [
    "05",
    "情報セキュリティ",
    "事業規模とリスクに合った現実的な対策を整えます。",
  ],
] as const;

const supportPhases = [
  ["構想", "経営課題を整理し、進むべき方向と優先順位を明確にします。"],
  ["導入", "要件や体制を整え、関係者と連携しながら実行します。"],
  ["運用", "現場の声を確かめ、使い続けられる仕組みに整えます。"],
  ["定着", "効果を振り返り、継続的な改善へつなげます。"],
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

const contactHref =
  "mailto:kumazawa@kcf.co.jp?subject=" +
  encodeURIComponent("ホームページを見てのご相談");

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        本文へ移動
      </a>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand-link" href="#top" aria-label="株式会社KCF トップへ">
            <BrandIdentity />
          </a>

          <nav className="desktop-navigation" aria-label="メインナビゲーション">
            <ul className="navigation-list">
              <li>
                <a className="navigation-link" href="#services">
                  事業内容
                </a>
              </li>
              <li>
                <a className="navigation-link" href="#strength">
                  KCFの強み
                </a>
              </li>
              <li>
                <a className="navigation-link" href="#themes">
                  ご相談テーマ例
                </a>
              </li>
              <li>
                <a className="navigation-link" href="#company">
                  会社情報
                </a>
              </li>
            </ul>
          </nav>

          <a className="header-contact-link" href="#contact">
            お問い合わせ
          </a>

          <MobileNavigation />
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-grid section-shell">
            <div className="hero-copy">
              <p className="section-kicker">IT CONSULTING / TOKYO</p>
              <h1 className="hero-title" id="hero-title">
                構想で終わらせない。
                <span>ITを、事業の力へ。</span>
              </h1>
              <p className="hero-description">
                株式会社KCFは、IT戦略の策定からシステム導入、運用・定着まで
                一貫して伴走するITコンサルティング会社です。
              </p>
              <div className="hero-actions">
                <a className="primary-button" href="#contact">
                  相談する
                  <span aria-hidden="true">↗</span>
                </a>
                <a className="secondary-button" href="#services">
                  事業内容を見る
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
              <p className="hero-note">
                <span aria-hidden="true" />
                課題が整理できていない段階でもご相談いただけます。
              </p>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="connection-mark">
                <span className="connection-line connection-line-one" />
                <span className="connection-line connection-line-two" />
                <span className="connection-line connection-line-three" />
                <span className="connection-node connection-node-one" />
                <span className="connection-node connection-node-two" />
                <span className="connection-node connection-node-three" />
              </div>
              <p className="hero-visual-caption">STRATEGY TO ADOPTION</p>
            </div>
          </div>
        </section>

        <section className="challenges-section" aria-labelledby="challenges-title">
          <div className="section-shell">
            <div className="section-heading">
              <div>
                <p className="section-kicker section-kicker-dark">BUSINESS CHALLENGES</p>
                <h2 id="challenges-title">こんなITのお悩みはありませんか？</h2>
              </div>
              <p className="section-introduction">
                ITの課題は、経営と現場のあいだで複雑になりがちです。
                KCFが状況を整理し、実行できる道筋へつなげます。
              </p>
            </div>

            <div className="challenge-grid">
              {challenges.map(([number, title, description]) => (
                <article className="challenge-card" key={number}>
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
              {services.map(([number, title, description]) => (
                <article className="service-card" key={number}>
                  <div className="service-card-header">
                    <span className="card-number">{number}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
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
                <span>現場に定着するまで、伴走する。</span>
              </h2>
              <p>
                KCFは、計画を提示して完了するのではなく、導入・運用・社内定着までを
                ひとつのプロセスとして支援します。経営の意図を現場の実行へつなぎ、
                改善が続く状態を目指して支援します。
              </p>
            </div>

            <ol className="support-phase-list">
              {supportPhases.map(([title, description], index) => (
                <li className="support-phase" key={title}>
                  <span className="phase-number">0{index + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
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
                <article className="theme-card" key={theme}>
                  <span className="theme-number">0{index + 1}</span>
                  <h3>{theme}</h3>
                </article>
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
          <div className="section-shell company-layout">
            <div className="company-message">
              <p className="section-kicker section-kicker-dark">COMPANY</p>
              <h2 id="company-title">会社情報</h2>
              <div className="representative-message">
                <p className="message-label">OUR APPROACH</p>
                <p className="message-text">
                  ITは、導入すること自体がゴールではありません。
                  経営課題に向き合い、現場で使われ、改善が続いて初めて事業の力になります。
                  KCFは実行可能な一歩をともに考え、その先の定着まで伴走します。
                </p>
              </div>
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
                ITの課題を、
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
                <span aria-hidden="true">↗</span>
              </a>
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
              <BrandIdentity />
            </a>
            <p>構想から導入・運用・定着まで伴走するITコンサルティング会社</p>
          </div>

          <div className="footer-information">
            <p>〒115-0045 東京都北区赤羽1-7-9 赤羽第一葉山ビル4F</p>
            <a href={contactHref}>kumazawa@kcf.co.jp</a>
          </div>
        </div>

        <div className="section-shell footer-bottom">
          <p>© 2026 KCF Inc.</p>
          <Link href="/privacy">プライバシーポリシー</Link>
        </div>
      </footer>
    </>
  );
}
