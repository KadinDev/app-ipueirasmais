import { supabase } from "@/repositories/supabase/supabase";

type EntityType = "company" | "event" | "news" | "banner";

type ClickType =
  | "whatsapp"
  | "instagram"
  | "share"
  | "banner"
  | "route"
  | "ticket";

type TrackClickParams = {
  cityId?: string | null;
  entityType: EntityType;
  entityId: string;
  clickType: ClickType;
  metadata?: Record<string, unknown>;
};

export async function trackCLick({
  cityId,
  entityType,
  entityId,
  clickType,
  metadata = {},
}: TrackClickParams) {
  if (!cityId || !entityId) return;

  try {
    await supabase.rpc("track_click", {
      p_city_id: cityId,
      p_entity_type: entityType,
      p_entity_id: entityId,
      p_click_type: clickType,
      p_metadata: metadata,
    });
  } catch (error) {
    console.log("Erro ao registrar métrica:", error);
  }
}
