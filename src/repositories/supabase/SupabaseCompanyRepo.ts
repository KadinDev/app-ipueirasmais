import type { Company } from "@/domains/company/Company";
import type {
  CompanyListParams,
  ICompanyRepo,
} from "@/domains/company/ICompanyRepo";
import { env } from "@/infra/env";
import { mapCompany } from "./mappers";
import { supabase } from "./supabase";

export class SupabaseCompanyRepo implements ICompanyRepo {
  async list({
    categorySlug,
    search,
    limit,
    offset,
  }: CompanyListParams): Promise<Company[]> {
    const { data, error } = await supabase.rpc("get_company_list", {
      p_city_slug: env.citySlug,
      p_category_slug: categorySlug ?? null,
      p_search: search?.trim() || null,
      p_limit: limit,
      p_offset: offset,
    });

    if (error) throw error;
    return (data ?? []).map(mapCompany);
  }

  async findById(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from("public_company_details")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data ? mapCompany(data) : null;
  }

  async getRandomFeaturedForNews(cityId: string): Promise<Company | null> {
    const { data, error } = await supabase.rpc(
      "get_random_featured_company_for_news",
      {
        p_city_id: cityId,
      },
    );

    if (error) throw error;
    return data ? mapCompany(data) : null;
  }
}
