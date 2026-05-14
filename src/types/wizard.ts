export type SiteType = "corporate" | "lp" | "portfolio" | "blog" | "ec" | "";
export type Atmosphere = "modern" | "classic" | "pop" | "minimal" | "";

export interface WizardData {
  siteType: SiteType;
  referenceUrl: string;
  serviceName: string;
  catchphrase: string;
  primaryColor: string;
  sections: string[];
  atmosphere: Atmosphere;
}

export const SITE_TYPE_LABELS: Record<string, string> = {
  corporate: "コーポレートサイト",
  lp: "ランディングページ",
  portfolio: "ポートフォリオ",
  blog: "ブログ",
  ec: "ECサイト",
};

export const ATMOSPHERE_LABELS: Record<string, string> = {
  modern: "モダン",
  classic: "クラシック",
  pop: "ポップ",
  minimal: "ミニマル",
};

export const DEFAULT_SECTIONS: Record<string, string[]> = {
  corporate: ["ヒーロー", "サービス", "会社概要", "ニュース", "お問い合わせ"],
  lp: ["ヒーロー", "特徴", "料金プラン", "FAQ", "お問い合わせ"],
  portfolio: ["ヒーロー", "実績", "スキル", "自己紹介", "お問い合わせ"],
  blog: ["ヒーロー", "最新記事", "カテゴリ", "プロフィール"],
  ec: ["ヒーロー", "商品一覧", "特集", "レビュー", "お問い合わせ"],
};

export const ALL_SECTIONS = [
  "ヒーロー",
  "サービス",
  "特徴",
  "会社概要",
  "実績",
  "料金プラン",
  "スキル",
  "ニュース",
  "最新記事",
  "FAQ",
  "レビュー",
  "商品一覧",
  "自己紹介",
  "プロフィール",
  "カテゴリ",
  "特集",
  "お問い合わせ",
];

export const defaultWizardData: WizardData = {
  siteType: "",
  referenceUrl: "",
  serviceName: "",
  catchphrase: "",
  primaryColor: "#3b82f6",
  sections: [],
  atmosphere: "",
};
