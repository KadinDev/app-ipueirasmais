export type LostFoundItemType = "lost" | "found";

export type LostFound = {
  id: string;
  cityId: string;
  title: string;
  slug: string;
  itemType: LostFoundItemType;
  description: string | null;
  contactLabel: string | null;
  imageUrl: string | null;
  occurredAt: string | null;
  manualPriority: number;
  publishedAt: string | null;
  createdAt: string;
};
