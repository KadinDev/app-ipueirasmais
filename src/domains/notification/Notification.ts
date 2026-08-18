export type AppNotification = {
  id: string;
  cityId: string;
  title: string;
  body?: string | null;
  entityType?: "event" | "news" | "company" | "banner" | null;
  entityId?: string | null;
  imageUrl?: string | null;
  publishedAt?: string | null;
};

export type NotificationPreview = Pick<
  AppNotification,
  "id" | "title" | "body" | "entityType" | "publishedAt"
>;
