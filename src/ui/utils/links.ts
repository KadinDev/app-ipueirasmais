import * as Linking from "expo-linking";
import { Platform } from "react-native";

export async function openExternalUrl(url?: string | null) {
  if (!url) return;
  const supported = await Linking.canOpenURL(url);
  if (supported) await Linking.openURL(url);
}

export function whatsappUrl(
  value?: string | null,
  text = "Olá, encontrei no Ipueiras+",
) {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  const clean = value.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

export function instagramUrl(value?: string | null) {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  const handle = value.replace("@", "").trim();
  return handle ? `https://instagram.com/${handle}` : null;
}

export function mapUrl(options: {
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  mapsUrl?: string | null;
}) {
  if (options.mapsUrl) return options.mapsUrl;
  if (options.latitude != null && options.longitude != null) {
    const destination = `${options.latitude},${options.longitude}`;
    const label = options.address || "Destino";
    return Platform.select({
      ios: `maps://?daddr=${destination}&q=${encodeURIComponent(label)}`,
      android: `geo:0,0?q=${destination}(${encodeURIComponent(label)})`,
      default: `https://www.openstreetmap.org/directions?to=${destination}`,
    });
  }
  if (options.address) {
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(options.address)}`;
  }
  return null;
}
