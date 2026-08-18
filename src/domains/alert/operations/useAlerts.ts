import { useCallback } from "react";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { useRepositories } from "@/repositories/RepositoryProvider";

export function useAlerts() {
  const { alertRepo } = useRepositories();
  const fetcher = useCallback(() => alertRepo.list(), [alertRepo]);

  return useCachedQuery({
    queryKey: queryKeys.alerts.all,
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.alerts,
  });
}
