import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "株式会社KCF｜構想から定着まで伴走するITコンサルティング",
    template: "%s｜株式会社KCF",
  },
  description:
    "株式会社KCFは、中小企業のIT戦略からシステム導入、運用・定着まで一貫して伴走するITコンサルティング会社です。",
  icons: {
    icon: "/kcf-icon-64.png",
    apple: "/kcf-icon-180.png",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "株式会社KCF",
    title: "株式会社KCF｜構想で終わらせない。ITを、事業の力へ。",
    description:
      "IT戦略の策定からシステム導入、運用・定着まで一貫して伴走します。",
  },
  twitter: {
    card: "summary",
    title: "株式会社KCF｜構想で終わらせない。ITを、事業の力へ。",
    description:
      "IT戦略の策定からシステム導入、運用・定着まで一貫して伴走します。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
