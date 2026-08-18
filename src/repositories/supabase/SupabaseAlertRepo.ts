import type { IAlertRepo } from "@/domains/alert/IAlertRepo";
import type { Alert } from "@/domains/alert/Alert";
import { env } from "@/infra/env";
import { mapAlert } from "./mappers";
import { supabase } from "./supabase";

export class SupabaseAlertRepo implements IAlertRepo {
  async list(): Promise<Alert[]> {
    const { data, error } = await supabase.rpc("get_alert_list", {
      p_city_slug: env.citySlug,
      p_category_slug: null,
    });

    if (error) throw error;
    return (data ?? []).map(mapAlert);
  }

  async findById(id: string): Promise<Alert | null> {
    const { data, error } = await supabase
      .from("public_alert_details")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data ? mapAlert(data) : null;
  }
}
