/**
 * Shared by the header, the mobile menu and the footer sitemap. It lives in a
 * plain module rather than in SiteHeader because a server component only
 * receives a client reference — not the value — when it imports from a
 * "use client" file.
 */
export const NAV_ITEMS = [
  { id: "services", label: "事業内容" },
  { id: "strength", label: "KCFの強み" },
  { id: "themes", label: "ご相談テーマ例" },
  { id: "company", label: "会社情報" },
] as const;
