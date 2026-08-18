import type { IUsefulServiceRepo } from "@/domains/usefulService/IUsefulServiceRepo";
import { env } from "@/infra/env";
import { mapPharmacyDuty, mapUsefulService } from "./mappers";
import { supabase } from "./supabase";

export class SupabaseUsefulServiceRepo implements IUsefulServiceRepo {
  async listPharmacyDuty() {
    const { data, error } = await supabase.rpc("get_pharmacy_duty_list", {
      p_city_slug: env.citySlug,
    });

    if (error) throw error;
    return (data ?? []).map(mapPharmacyDuty);
  }

  async listUsefulServices() {
    const { data, error } = await supabase.rpc("get_useful_services", {
      p_city_slug: env.citySlug,
    });

    if (error) throw error;
    return (data ?? []).map(mapUsefulService);
  }
}
