import type { INewsRepo } from "@/domains/news/INewsRepo";
import type { News } from "@/domains/news/News";
import { mapNews } from "./mappers";
import { supabase } from "./supabase";

export class SupabaseNewsRepo implements INewsRepo {
  async list(): Promise<News[]> {
    const { data, error } = await supabase
      .from("public_news_cards")
      .select("*")
      .limit(50);

    if (error) throw error;
    return (data ?? []).map(mapNews);
  }

  async findById(id: string): Promise<News | null> {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return null;

    let coverUrl: string | null = null;
    if (data.cover_media_id) {
      const { data: media } = await supabase
        .from("media_assets")
        .select("public_url")
        .eq("id", data.cover_media_id)
        .maybeSingle();
      coverUrl = media?.public_url ?? null;
    }

    return mapNews({ ...data, cover_url: coverUrl });
  }
}
