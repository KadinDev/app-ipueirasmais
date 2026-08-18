export type Promotion = {
  id: string;
  cityId: string;
  companyId?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  title: string;
  slug: string;
  description?: string | null;
  oldPriceCents?: number | null;
  newPriceCents?: number | null;
  priceLabel?: string | null;
  validUntil?: string | null;
  whatsapp?: string | null;
  imageUrl?: string | null;
  companyName?: string | null;
  companyIsFeatured: boolean;
  manualPriority: number;
  publishedAt?: string | null;
  createdAt?: string | null;
};

export type PromotionCardPreview = Pick<
  Promotion,
  | "id"
  | "companyIsFeatured"
  | "companyName"
  | "imageUrl"
  | "title"
  | "categoryName"
  | "priceLabel"
  | "newPriceCents"
  | "description"
>;
