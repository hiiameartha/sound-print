export type NavItem = {
  label: string;
  href: string;
};

export const MAIN_NAV: NavItem[] = [
  { label: "首頁", href: "/" },
  { label: "人生問卷", href: "/assessment" },
  { label: "儀表板", href: "/dashboard" },
  { label: "關於", href: "/about" },
  { label: "聯絡", href: "/contact" },
];

export const FOOTER_NAV: NavItem[] = [
  { label: "隱私權政策", href: "/privacy" },
  { label: "服務條款", href: "/terms" },
];
