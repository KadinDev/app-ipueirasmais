import { useCallback } from "react";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { useRepositories } from "@/repositories/RepositoryProvider";

export function useHome() {
  const { homeRepo } = useRepositories();
  const fetcher = useCallback(() => homeRepo.getHome(), [homeRepo]);

  return useCachedQuery({
    queryKey: queryKeys.home,
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.home,
  });
}
