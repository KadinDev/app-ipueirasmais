import { useCallback } from "react";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { getIpueirasWeather } from "@/infra/weather/weatherApi";

export function useWeather() {
  const fetcher = useCallback(() => getIpueirasWeather(), []);

  return useCachedQuery({
    queryKey: queryKeys.weather,
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.weather,
    manualRefreshCooldownMs: CACHE_TTL_MS.weather,
  });
}
