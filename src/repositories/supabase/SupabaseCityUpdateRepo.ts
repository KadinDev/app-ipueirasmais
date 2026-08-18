import type { ICityUpdateRepo } from "@/domains/cityUpdate/ICityUpdateRepo";
import type { CityUpdate } from "@/domains/cityUpdate/CityUpdate";
import { env } from "@/infra/env";
import { mapCityUpdate } from "./mappers";
import { supabase } from "./supabase";

export class SupabaseCityUpdateRepo implements ICityUpdateRepo {
  async list(categorySlug?: string | null): Promise<CityUpdate[]> {
    const { data, error } = await supabase.rpc("get_city_update_list", {
      p_city_slug: env.citySlug,
      p_category_slug: categorySlug ?? null,
    });

    if (error) throw error;
    return (data ?? []).map(mapCityUpdate);
  }
}
