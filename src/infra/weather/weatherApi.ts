import type { Weather } from "@/domains/weather/Weather";
import { env } from "@/infra/env";

const IPUEIRAS_COORDS = "-4.543,-40.717";

type WeatherApiResponse = {
  current?: {
    temp_c?: number;
    last_updated?: string;
    condition?: {
      text?: string;
      code?: number;
    };
  };
};

export async function getIpueirasWeather(): Promise<Weather> {
  if (!env.weatherApiKey) {
    throw new Error("WeatherAPI key nao configurada");
  }

  const url = new URL("https://api.weatherapi.com/v1/current.json");
  url.searchParams.set("key", env.weatherApiKey);
  url.searchParams.set("q", IPUEIRAS_COORDS);
  url.searchParams.set("lang", "pt");
  url.searchParams.set("aqi", "no");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Erro ao buscar previsao do tempo");
  }

  const payload = (await response.json()) as WeatherApiResponse;
  const current = payload.current;

  if (!current || typeof current.temp_c !== "number") {
    throw new Error("Resposta de clima invalida");
  }

  return {
    temperatureC: Math.round(current.temp_c),
    description: current.condition?.text || "Clima atualizado",
    iconName: weatherIconFromCode(current.condition?.code),
    updatedAt: current.last_updated || new Date().toISOString(),
  };
}

function weatherIconFromCode(code?: number): Weather["iconName"] {
  if (!code) return "partly-sunny";
  if (code === 1000) return "sunny";
  if (code === 1003) return "partly-sunny";
  if ([1006, 1009, 1030, 1135, 1147].includes(code)) return "cloudy";
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return "thunderstorm";
  if (
    [
      1066, 1069, 1072, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237,
    ].includes(code)
  ) {
    return "snow";
  }
  return "rainy";
}
