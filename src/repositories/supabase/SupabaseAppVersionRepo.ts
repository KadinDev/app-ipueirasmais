import type { AppPlatform } from "@/domains/appVersion/AppVersionConfig";
import type { IAppVersionRepo } from "@/domains/appVersion/IAppVersionRepo";
import { env } from "@/infra/env";
import { mapAppVersionConfig } from "./mappers";
import { supabase } from "./supabase";

export class SupabaseAppVersionRepo implements IAppVersionRepo {
  async getConfig(platform: Exclude<AppPlatform, "all">) {
    const { data, error } = await supabase.rpc("get_app_version_config", {
      p_city_slug: env.citySlug,
      p_platform: platform,
    });

    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    return row ? mapAppVersionConfig(row) : null;
  }
}
