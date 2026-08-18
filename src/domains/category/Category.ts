export type Category = {
  id: string;
  cityId: string;
  kind:
    | "company"
    | "event"
    | "news"
    | "promotion"
    | "job"
    | "city_update"
    | "pharmacy";
  name: string;
  slug: string;
  iconName?: string | null;
  colorHex?: string | null;
};
