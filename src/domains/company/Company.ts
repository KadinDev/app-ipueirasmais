export type Company = {
  id: string;
  cityId: string;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  name: string;
  slug: string;
  description?: string | null;
  rating?: number | null;
  ratingCount?: number | null;
  neighborhood?: string | null;
  addressLine?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  createdAt?: string | null;
  placementType:
    | "basic"
    | "featured"
    | "event_featured"
    | "home_banner"
    | "super_featured";
  isFeatured: boolean;
  placementPriority?: number | null;
  whatsapp?: string | null;
  phone?: string | null;
  instagram?: string | null;
  mapsUrl?: string | null;
  hours?: CompanyHour[];
};

export type CompanyHour = {
  dayOfWeek: number;
  opensAt?: string | null;
  closesAt?: string | null;
  isClosed?: boolean | null;
  note?: string | null;
};

export type CompanyPreviewHome = Pick<
  Company,
  | "id"
  | "logoUrl"
  | "coverUrl"
  | "name"
  | "isFeatured"
  | "description"
  | "categoryName"
  | "whatsapp"
>;
