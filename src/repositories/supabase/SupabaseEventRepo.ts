import type { Event } from "@/domains/event/Event";
import type { IEventRepo } from "@/domains/event/IEventRepo";
import { env } from "@/infra/env";
import { mapEvent } from "./mappers";
import { supabase } from "./supabase";

export class SupabaseEventRepo implements IEventRepo {
  async list(categorySlug?: string | null): Promise<Event[]> {
    const { data, error } = await supabase.rpc("get_event_list", {
      p_city_slug: env.citySlug,
      p_category_slug: categorySlug ?? null,
    });

    if (error) throw error;
    return (data ?? []).map(mapEvent);
  }

  async findById(id: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from("public_event_details")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data ? mapEvent(data) : null;
  }
}
