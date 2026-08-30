/**
 * Centralized CMS & Hero Type Definitions for ITWala
 */

export interface CMSHeroData {
  badge?: string;
  title: string;
  subtitle: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  bgImage?: string;
  accentColor?: string;
  academyTitle?: string;
  academyCtaText?: string;
  academyCtaLink?: string;
  academyTags?: string[];
  academyDescription?: string;
  consultingTitle?: string;
  consultingCtaText?: string;
  consultingCtaLink?: string;
  consultingTags?: string[];
  consultingDescription?: string;
}

export interface CMSSEOData {
  metaTitle: string;
  metaDescription: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export interface CMSItemData {
  id?: string;
  title?: string;
  description?: string;
  value?: string;
  label?: string;
  icon?: string;
  tag?: string;
}

export interface PageCMSData {
  hero?: CMSHeroData;
  cta?: any;
  stats?: CMSItemData[];
  features?: CMSItemData[];
  faqs?: CMSItemData[];
  seo?: CMSSEOData;
  header?: any;
  footer?: any;
  testimonials?: any;
  service_showcase?: any;
  mission_cards?: any;
  locations?: any;
  our_story?: any;
  consulting_services?: any;
  global_presence?: any;
  contact_info?: any;
  services_grid?: any;
  why_choose_us?: any;
  process_steps?: any;
  consulting_stats?: any;
  consulting_cta?: any;
  consulting_faqs?: any;
  hero_stats?: any;
  academy_cta?: any;
  academy_why_choose?: any;
  [key: string]: any;
}

export interface AcademyHeroProps {
  heroData?: CMSHeroData;
  heroStats?: Array<{ value: string; label: string }>;
}

export interface ConsultingHeroProps {
  hero?: CMSHeroData;
  heroStats?: Array<{ label: string }>;
}

export interface UnifiedHeroProps {
  heroData?: CMSHeroData;
}
