/**
 * Affiliate Template Types
 * ========================
 * Data structures for affiliate site templates.
 */

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
