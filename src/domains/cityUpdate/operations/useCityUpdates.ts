import { useCallback } from "react";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { useRepositories } from "@/repositories/RepositoryProvider";

export function useCityUpdates() {
  const { cityUpdateRepo } = useRepositories();
  const fetcher = useCallback(() => cityUpdateRepo.list(null), [cityUpdateRepo]);

  return useCachedQuery({
    queryKey: queryKeys.cityUpdates,
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.cityUpdates,
  });
}
