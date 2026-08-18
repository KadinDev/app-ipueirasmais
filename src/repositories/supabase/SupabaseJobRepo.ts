import type { IJobRepo } from "@/domains/job/IJobRepo";
import type { Job } from "@/domains/job/Job";
import { env } from "@/infra/env";
import { mapJob } from "./mappers";
import { supabase } from "./supabase";

export class SupabaseJobRepo implements IJobRepo {
  async list(categorySlug?: string | null): Promise<Job[]> {
    const { data, error } = await supabase.rpc("get_job_list", {
      p_city_slug: env.citySlug,
      p_category_slug: categorySlug ?? null,
    });

    if (error) throw error;
    return (data ?? []).map(mapJob);
  }
}
