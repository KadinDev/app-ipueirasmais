import type { Promotion } from "./Promotion";

export type IPromotionRepo = {
  list: (categorySlug?: string | null) => Promise<Promotion[]>;
};
