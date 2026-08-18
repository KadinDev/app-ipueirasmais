import type { IHomeRepo } from "@/domains/home/IHomeRepo";
import type { HomePayload } from "@/domains/home/HomePayload";
import { env } from "@/infra/env";
import {
  mapBanner,
  mapCompany,
  mapEvent,
  mapNews,
  mapNotification,
} from "./mappers";
import { supabase } from "./supabase";

export class SupabaseHomeRepo implements IHomeRepo {
  async getHome(): Promise<HomePayload> {
    const { data, error } = await supabase.rpc("get_home_payload", {
      p_city_slug: env.citySlug,
    });

    if (error) throw error;

    return {
      city: data?.city ?? null,
      happeningNow: {
        promotionsCount: data?.happening_now?.promotions_count ?? 0,
        todayEventsCount: data?.happening_now?.today_events_count ?? 0,
        jobsCount: data?.happening_now?.jobs_count ?? 0,
        alertsCount: data?.happening_now?.alerts_count ?? 0,
        updatesCount: data?.happening_now?.updates_count ?? 0,
        pharmacyDutyCount: data?.happening_now?.pharmacy_duty_count ?? 0,
      },
      superBanners: (data?.super_banners ?? []).map(mapBanner),
      homeCompanies: (data?.home_companies ?? []).map(mapCompany),
      homeEvents: (data?.home_events ?? []).map(mapEvent),
      latestNews: (data?.latest_news ?? []).map(mapNews),
      notifications: (data?.notifications ?? []).map(mapNotification),
    };
  }
}
