export type Classified = {
  id: string;
  cityId: string;
  title: string;
  slug: string;
  description: string | null;
  priceLabel: string | null;
  whatsapp: string | null;
  coverUrl: string | null;
  photo1Url: string | null;
  photo2Url: string | null;
  photo3Url: string | null;
  validUntil: string | null;
  manualPriority: number;
  publishedAt: string | null;
  createdAt: string;
};
