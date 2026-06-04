export type NavItem = {
  label: string;
  href: string;
};

export const MAIN_NAV: NavItem[] = [
  { label: "首頁", href: "/" },
  { label: "Spotify 檢測", href: "/spotify" },
  { label: "儀表板", href: "/dashboard" },
  { label: "歷史紀錄", href: "/profile" },
  { label: "相容性", href: "/compatibility" },
  { label: "關於", href: "/about" },
  { label: "聯絡", href: "/contact" },
];

export const FOOTER_NAV: NavItem[] = [
  { label: "隱私權政策", href: "/privacy" },
  { label: "服務條款", href: "/terms" },
];
