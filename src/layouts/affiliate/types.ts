/**
 * Affiliate Template Types
 * ========================
 * Data structures for affiliate site templates.
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  category?: string;
  rating: number;
  reviewCount?: number;
  price?: number;
  priceLabel?: string;
  affiliateUrl: string;
  pageUrl?: string; // Internal review/detail page URL
  pros?: string[];
  cons?: string[];
  rank?: number;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Article {
  title: string;
  description?: string;
  href: string;
  date?: Date | string;
  category?: string;
  image?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

