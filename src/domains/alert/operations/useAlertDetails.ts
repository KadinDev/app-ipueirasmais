import { useCallback } from "react";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { useRepositories } from "@/repositories/RepositoryProvider";

export function useAlertDetails(id?: string | null) {
  const { alertRepo } = useRepositories();
  const fetcher = useCallback(() => {
    if (!id) return Promise.resolve(null);
    return alertRepo.findById(id);
  }, [alertRepo, id]);

  return useCachedQuery({
    queryKey: queryKeys.alerts.detail(id),
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.alerts,
  });
}
