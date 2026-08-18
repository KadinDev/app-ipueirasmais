import { useCallback } from "react";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { useRepositories } from "@/repositories/RepositoryProvider";

export function useClassifieds() {
  const { classifiedRepo } = useRepositories();

  const fetcher = useCallback(() => classifiedRepo.list(), [classifiedRepo]);

  return useCachedQuery({
    queryKey: queryKeys.classifieds,
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.classifieds,
  });
}
