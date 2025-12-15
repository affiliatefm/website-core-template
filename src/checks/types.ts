/**
 * Check Types
 * ============
 * Common types for build-time checks.
 */

export type PageEntry = {
  id: string;
  data: {
    title?: string;
    description?: string;
    permalink?: string;
    alternates?: Record<string, string>;
    draft?: boolean;
  };
};

export type CheckError = {
  check: string;
  message: string;
  file?: string;
};

export type CheckFn = (pages: PageEntry[]) => CheckError[];

export type CheckConfig = {
  name: string;
  enabled?: boolean;
  run: CheckFn;
};
