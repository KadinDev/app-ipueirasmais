export type Banner = {
  id: string;
  cityId?: string;
  title?: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  actionLabel?: string | null;
  actionUrl?: string | null;
  notes?: string | null;
  isActiveBackgroundImage: boolean;
};

// só coloquei o cityId aqui, para poder funcionar o envio para as métricas do dashboard conforme alguém clique
// no whatsapp do banner. pois configurei no trackClick.ts para ter esse (!cityId || !entityId)
export type BannerPreview = Pick<
  Banner,
  | "id"
  | "imageUrl"
  | "notes"
  | "title"
  | "subtitle"
  | "actionLabel"
  | "cityId"
  | "isActiveBackgroundImage"
>;
