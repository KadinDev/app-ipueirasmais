export type Job = {
  id: string;
  cityId: string;
  companyId?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  title: string;
  slug: string;
  companyName?: string | null;
  locationLabel?: string | null;
  contractType?: string | null;
  salaryLabel?: string | null;
  description?: string | null;
  requirements?: string | null;
  applicationUrl?: string | null;
  whatsapp?: string | null;
  manualPriority: number;
  publishedAt?: string | null;
  createdAt?: string | null;
};

export type JobCardPreview = Pick<
  Job,
  | "id"
  | "title"
  | "companyName"
  | "locationLabel"
  | "contractType"
  | "salaryLabel"
>;
