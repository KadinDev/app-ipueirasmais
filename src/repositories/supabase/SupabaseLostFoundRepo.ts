import type { ILostFoundRepo } from "@/domains/lostFound/ILostFoundRepo";
import type {
  LostFound,
  LostFoundItemType,
} from "@/domains/lostFound/LostFound";

import { env } from "@/infra/env";
import { mapLostFound } from "./mappers";
import { supabase } from "./supabase";

export class SupabaseLostFoundRepo implements ILostFoundRepo {
  async list(itemType?: LostFoundItemType | null): Promise<LostFound[]> {
    const { data, error } = await supabase.rpc("get_lost_found_list", {
      p_city_slug: env.citySlug,
      p_item_type: itemType ?? null,
    });

    if (error) throw error;

    return (data ?? []).map(mapLostFound);
  }
}
