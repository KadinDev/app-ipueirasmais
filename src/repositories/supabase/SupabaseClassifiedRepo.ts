import type { IClassifiedRepo } from "@/domains/classified/IClassifiedRepo";
import type { Classified } from "@/domains/classified/Classified";
import { env } from "@/infra/env";
import { supabase } from "./supabase";
import { mapClassified } from "./mappers";

export class SupabaseClassifiedRepo implements IClassifiedRepo {
  async list(): Promise<Classified[]> {
    const { data, error } = await supabase.rpc("get_classified_list", {
      p_city_slug: env.citySlug,
    });

    if (error) throw error;

    return (data ?? []).map(mapClassified);
  }
}
