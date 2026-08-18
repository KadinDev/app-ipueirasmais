export type News = {
  id: string;
  cityId: string;
  categoryId?: string | null;
  categoryName?: string | null;
  title: string;
  slug: string;
  excerpt?: string | null;
  body?: string | null;
  coverUrl?: string | null;
  publishedAt?: string | null;
};

export type NewsPreviewHome = Pick<
  News,
  "id" | "coverUrl" | "title" | "excerpt" | "publishedAt"
>;
