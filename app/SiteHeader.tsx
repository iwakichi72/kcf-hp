import { BrandIdentity } from "./BrandIdentity";
import { MobileNavigation } from "./MobileNavigation";
import { NAV_ITEMS } from "./navigation";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand-link" href="#top" aria-label="株式会社KCF トップへ">
          <BrandIdentity />
        </a>

        <nav className="desktop-navigation" aria-label="メインナビゲーション">
          <ul className="navigation-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a className="navigation-link" href={`#${item.id}`}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="header-contact-link" href="#contact">
          <span>お問い合わせ</span>
          <span className="header-contact-arrow" aria-hidden="true">
            ↗
          </span>
        </a>

        <MobileNavigation />
      </div>
    </header>
  );
}
