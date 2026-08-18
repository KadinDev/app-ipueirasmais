export type CityUpdate = {
  id: string;
  cityId: string;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  title: string;
  slug: string;
  summary?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  manualPriority: number;
  publishedAt?: string | null;
  createdAt?: string | null;
};

export type CityUpdateCardPreview = Pick<
  CityUpdate,
  "id" | "imageUrl" | "title" | "body" | "publishedAt"
>;
