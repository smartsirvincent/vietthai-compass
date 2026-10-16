import type { BusinessSubcategory } from "./business-taxonomy";

export type CountryCode = "vietnam" | "thailand";

export type ContentStatus = "draft" | "pending" | "published" | "scheduled" | "archived";

export type SocialLinks = {
  phone?: string;
  whatsapp?: string;
  line?: string;
  zalo?: string;
  facebook?: string;
  instagram?: string;
  threads?: string;
  tiktok?: string;
  telegram?: string;
  website?: string;
  email?: string;
};

export type District = {
  slug: string;
  name: string;
  nameEn?: string;
  summary: string;
};

export type City = {
  slug: string;
  country: CountryCode;
  name: string;
  nameEn: string;
  summary: string;
  bestSeason: string;
  weather?: string;
  recommendedDays: string;
  audience: string[];
  businessAngle: string;
  image: string;
  districts: District[];
};

export const ARTICLE_CATEGORIES = [
  "旅遊攻略",
  "旅遊須知",
  "餐廳美食",
  "景點行程",
  "在地生活",
  "台商專區",
  "節慶活動",
  "新聞快訊",
  "交通航線"
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  country?: CountryCode;
  citySlug?: string;
  districtSlug?: string;
  relatedBusinessSlug?: string;
  businessIntro?: string;
  businessFeatures?: string[];
  intent: "traffic" | "commercial" | "authority";
  keywords: string[];
  updatedAt: string;
  coverImage: string;
  photoAlt: string;
};

export type DirectoryBusiness = {
  slug: string;
  name: string;
  category: string;
  subcategory?: BusinessSubcategory;
  image?: string;
  citySlug: string;
  districtSlug?: string;
  transitStationIds?: string[];
  country: CountryCode;
  description: string;
  review?: string;
  googleMapUrl?: string;
  badges: string[];
  socials: SocialLinks;
  isTaiwanBusiness?: boolean;
  updatedAt?: string;
  plan: "free" | "basic" | "featured" | "premium";
};

export type SiteSettings = {
  siteName?: string;
  siteNameEn?: string;
  siteDescription?: string;
  homeEyebrow?: string;
  homeTitle?: string;
  homeIntro?: string;
  homePrimaryCtaLabel?: string;
  homeSecondaryCtaLabel?: string;
  ga4Id?: string;
  gtmId?: string;
  heroImage?: string;
  logoImage?: string;
};

export type ResearchBrief = {
  id: string;
  title: string;
  targetKeyword: string;
  audience: string;
  searchIntent: "information" | "commercial" | "local" | "transactional";
  contentType: "city-guide" | "restaurant-list" | "local-life" | "business-guide" | "interview";
  sourcesToCollect: string[];
  outputSections: string[];
  seoChecks: string[];
  status: "idea" | "research-ready" | "draft-needed" | "review-needed";
};
