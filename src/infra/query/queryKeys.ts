import type { Category } from "@/domains/category/Category";

export const queryKeys = {
  home: ["home"] as const,
  alerts: {
    all: ["alerts"] as const,
    detail: (id?: string | null) =>
      ["alerts", "detail", id ?? "empty"] as const,
  },
  categories: (kind: Category["kind"]) => ["categories", kind] as const,
  cityUpdates: ["city-updates"] as const,
  classifieds: ["classifieds"] as const,
  lostFound: ["lost-found"] as const,
  companies: {
    all: ["companies"] as const,
    list: (categorySlug?: string | null, search?: string | null) =>
      [
        "companies",
        "list",
        categorySlug ?? "all",
        search?.trim().toLocaleLowerCase("pt-BR") || "all",
      ] as const,
    detail: (id?: string | null) =>
      ["companies", "detail", id ?? "empty"] as const,
  },
  events: {
    all: ["events"] as const,
    detail: (id?: string | null) =>
      ["events", "detail", id ?? "empty"] as const,
  },
  jobs: ["jobs"] as const,
  news: {
    all: ["news"] as const,
    detail: (id?: string | null) => ["news", "detail", id ?? "empty"] as const,
  },
  promotions: ["promotions"] as const,
  weather: ["weather"] as const,
  usefulServices: {
    pharmacyDuty: ["useful-services", "pharmacy-duty"] as const,
    all: ["useful-services", "all"] as const,
  },
  appVersion: (platform: "android" | "ios") =>
    ["app-version", platform] as const,
};
