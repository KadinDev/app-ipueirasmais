const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;

export const CACHE_TTL_MS = {
  home: 20 * MINUTE_MS,
  news: 20 * MINUTE_MS,
  alerts: 20 * MINUTE_MS,
  cityUpdates: 20 * MINUTE_MS,
  classifieds: 30 * MINUTE_MS,
  lostFound: 20 * MINUTE_MS,
  events: 40 * MINUTE_MS,
  jobs: 40 * MINUTE_MS,
  promotions: 40 * MINUTE_MS,
  companies: 2 * HOUR_MS,
  categories: 24 * HOUR_MS,
  weather: 2 * HOUR_MS,
  usefulServices: 4 * HOUR_MS,
  appVersion: 10 * HOUR_MS,
} as const;

// Fallback seguro para consultas que ainda nao tenham uma regra propria.
export const APP_CACHE_TTL_MS = CACHE_TTL_MS.home;
export const APP_MANUAL_REFRESH_COOLDOWN_MS = 5 * 60 * 1000;
export const APP_CACHE_GC_TIME_MS = 24 * 60 * 60 * 1000;
export const APP_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
export const APP_QUERY_CACHE_BUSTER = "ipueiras-plus-v1";
export const APP_QUERY_CACHE_STORAGE_KEY = "@ipueiras:tanstack-query-cache";
