import { useCallback } from "react";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { useRepositories } from "@/repositories/RepositoryProvider";

export function useUsefulServices() {
  const { usefulServiceRepo } = useRepositories();
  const fetcher = useCallback(
    () => usefulServiceRepo.listUsefulServices(),
    [usefulServiceRepo],
  );

  return useCachedQuery({
    queryKey: queryKeys.usefulServices.all,
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.usefulServices,
  });
}
