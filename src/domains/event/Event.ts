export type Event = {
  id: string;
  cityId: string;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  title: string;
  slug: string;
  description?: string | null;
  venueName?: string | null;
  addressLine?: string | null;
  neighborhood?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  startsAt: string;
  endsAt?: string | null;
  isFree: boolean;
  priceLabel?: string | null;
  ticketUrl?: string | null;
  whatsapp?: string | null;
  coverUrl?: string | null;
  createdAt?: string | null;
  placementType:
    | "basic"
    | "featured"
    | "event_featured"
    | "home_banner"
    | "super_featured";
  isFeatured: boolean;
  showAddToCalendar?: boolean;
};

export type EventPreviewHome = Pick<
  Event,
  | "id"
  | "isFeatured"
  | "coverUrl"
  | "title"
  | "startsAt"
  | "venueName"
  | "neighborhood"
  | "isFree"
>;
