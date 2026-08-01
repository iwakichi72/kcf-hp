import type { Metadata } from "next";
import Link from "next/link";
import { BrandIdentity } from "../BrandIdentity";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "株式会社KCFにおける個人情報の取扱いについてご案内します。",
};

/* 開示や訂正の請求は書き出しに迷いやすいので、トップと同じく雛形を入れる。
   請求の種別を先に置くのは、受け取った側が最初に判断する項目だから。 */
const privacyContactBody = [
  "株式会社KCF ご担当者さま",
  "",
  "プライバシーポリシーを拝見し、個人情報の取扱いについてご連絡いたしました。",
  "",
  "■ ご用件（開示・訂正・利用停止・その他）：",
  "■ 会社名・団体名：",
  "■ 氏名：",
  "■ 電話番号：",
  "",
  "■ 詳細：",
  "",
  "",
].join("\n");

const privacyContactHref =
  "mailto:kumazawa@kcf.co.jp?subject=" +
  encodeURIComponent("個人情報の取扱いについて") +
  "&body=" +
  encodeURIComponent(privacyContactBody);

// NOTE: This policy is a working draft and must receive final legal and operational review before publication.
export default function PrivacyPolicy() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        本文へ移動
      </a>

      <header className="site-header privacy-site-header">
        <div className="header-inner">
          <Link className="brand-link" href="/" aria-label="株式会社KCF トップページへ">
            <BrandIdentity />
          </Link>
          <Link className="page-back-link" href="/">
            <span aria-hidden="true">←</span>
            トップページへ戻る
          </Link>
        </div>
      </header>

      <main className="policy-page" id="main-content">
        <header className="policy-hero">
          <div className="policy-container">
            <p className="section-kicker">PRIVACY POLICY</p>
            <h1>プライバシーポリシー</h1>
            <p>
              株式会社KCFにおける、個人情報の取扱いについてご案内します。
            </p>
          </div>
        </header>

        <article className="policy-content policy-container">
          <p className="policy-introduction">
            株式会社KCF（以下「当社」といいます。）は、お預かりする個人情報を大切に取り扱い、
            個人情報の保護に関する法令その他の規範を遵守します。
          </p>

          <section className="policy-section" aria-labelledby="policy-principles">
            <span className="policy-number">01</span>
            <div>
              <h2 id="policy-principles">個人情報の取扱い方針</h2>
              <p>
                当社は、個人情報を利用目的の達成に必要な範囲で適正に取得・利用し、
                適切な管理と保護に努めます。
              </p>
            </div>
          </section>

          <section className="policy-section" aria-labelledby="policy-information">
            <span className="policy-number">02</span>
            <div>
              <h2 id="policy-information">取得する情報</h2>
              <p>
                メールでお問い合わせいただいた際に、送信者が記載した氏名、会社名、
                メールアドレス、相談内容その他の情報を取得することがあります。
              </p>
              <p>
                当サイトには問い合わせフォームを設置しておらず、Cookieを用いた
                アクセス解析も現時点では行っていません。
              </p>
            </div>
          </section>

          <section className="policy-section" aria-labelledby="policy-purpose">
            <span className="policy-number">03</span>
            <div>
              <h2 id="policy-purpose">利用目的</h2>
              <p>取得した個人情報は、次の目的で利用します。</p>
              <ul>
                <li>お問い合わせやご相談への回答</li>
                <li>提案、契約、サービス提供に必要なご連絡</li>
                <li>当社サービスの品質向上および改善</li>
                <li>法令上必要な対応</li>
              </ul>
            </div>
          </section>

          <section className="policy-section" aria-labelledby="policy-third-party">
            <span className="policy-number">04</span>
            <div>
              <h2 id="policy-third-party">第三者提供</h2>
              <p>
                当社は、ご本人の同意がある場合または法令で認められる場合を除き、
                個人情報を第三者へ提供しません。取扱いを外部へ委託する場合は、
                委託先を適切に選定し、必要な監督を行います。
              </p>
            </div>
          </section>

          <section className="policy-section" aria-labelledby="policy-security">
            <span className="policy-number">05</span>
            <div>
              <h2 id="policy-security">安全管理</h2>
              <p>
                当社は、個人情報への不正アクセス、紛失、漏えい、改ざん等を防止するため、
                必要かつ適切な安全管理措置を講じます。
              </p>
            </div>
          </section>

          <section className="policy-section" aria-labelledby="policy-disclosure">
            <span className="policy-number">06</span>
            <div>
              <h2 id="policy-disclosure">開示等の請求</h2>
              <p>
                当社が保有する個人情報について、利用目的の通知、開示、訂正、追加、削除、
                利用停止等をご希望の場合は、下記窓口へご連絡ください。
                ご本人または代理人であることを確認したうえで、法令に基づき対応します。
              </p>
            </div>
          </section>

          <section className="policy-section" aria-labelledby="policy-contact">
            <span className="policy-number">07</span>
            <div>
              <h2 id="policy-contact">お問い合わせ先</h2>
              <address className="policy-contact">
                <span>株式会社KCF</span>
                <span>〒115-0045</span>
                <span>東京都北区赤羽1-7-9 赤羽第一葉山ビル4F</span>
                <a href={privacyContactHref}>kumazawa@kcf.co.jp</a>
              </address>
            </div>
          </section>

          <section className="policy-section" aria-labelledby="policy-revisions">
            <span className="policy-number">08</span>
            <div>
              <h2 id="policy-revisions">改定</h2>
              <p>
                法令の変更や当社サービスの内容変更等に応じて、本ポリシーを改定することがあります。
                改定後の内容は、当サイトへの掲載をもってお知らせします。
              </p>
            </div>
          </section>

          <p className="policy-date">制定日：2026年7月23日</p>
        </article>
      </main>

      <footer className="site-footer policy-footer">
        <div className="section-shell footer-bottom">
          <p>© 2026 KCF Inc.</p>
          <Link href="/">トップページ</Link>
        </div>
      </footer>
    </>
  );
}
