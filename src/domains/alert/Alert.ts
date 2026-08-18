export type AlertImportance = "normal" | "important" | "urgent";

export type Alert = {
  id: string;
  cityId: string;
  title: string;
  slug: string;
  summary?: string | null;
  body?: string | null;
  importance: AlertImportance;
  affectedAreas?: string | null;
  expectedResolution?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
};
