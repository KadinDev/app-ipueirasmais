import type { IPromotionRepo } from "@/domains/promotion/IPromotionRepo";
import type { Promotion } from "@/domains/promotion/Promotion";
import { env } from "@/infra/env";
import { mapPromotion } from "./mappers";
import { supabase } from "./supabase";

export class SupabasePromotionRepo implements IPromotionRepo {
  async list(categorySlug?: string | null): Promise<Promotion[]> {
    const { data, error } = await supabase.rpc("get_promotion_list", {
      p_city_slug: env.citySlug,
      p_category_slug: categorySlug ?? null,
    });

    if (error) throw error;
    return (data ?? []).map(mapPromotion);
  }
}
