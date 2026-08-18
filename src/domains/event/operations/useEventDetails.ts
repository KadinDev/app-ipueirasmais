import { useCallback } from "react";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { useRepositories } from "@/repositories/RepositoryProvider";

export function useEventDetails(id?: string | null) {
  const { eventRepo } = useRepositories();
  const fetcher = useCallback(async () => {
    if (!id) return null;
    return eventRepo.findById(id);
  }, [eventRepo, id]);

  return useCachedQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.events,
  });
}
