import { useCallback } from "react";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { useRepositories } from "@/repositories/RepositoryProvider";

export function useNewsList() {
  const { newsRepo } = useRepositories();
  const fetcher = useCallback(() => newsRepo.list(), [newsRepo]);

  return useCachedQuery({
    queryKey: queryKeys.news.all,
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.news,
  });
}
