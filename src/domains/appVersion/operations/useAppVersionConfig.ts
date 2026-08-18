import { useCallback } from "react";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { useRepositories } from "@/repositories/RepositoryProvider";

export function useAppVersionConfig(platform: "android" | "ios") {
  const { appVersionRepo } = useRepositories();
  const fetcher = useCallback(
    () => appVersionRepo.getConfig(platform),
    [appVersionRepo, platform],
  );

  return useCachedQuery({
    queryKey: queryKeys.appVersion(platform),
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.appVersion,
    manualRefreshCooldownMs: CACHE_TTL_MS.appVersion,
  });
}
