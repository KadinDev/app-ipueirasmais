import { useCallback } from "react";
import type { Category } from "../Category";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { useRepositories } from "@/repositories/RepositoryProvider";

export function useCategories(kind: Category["kind"]) {
  const { categoryRepo } = useRepositories();
  const fetcher = useCallback(() => categoryRepo.list(kind), [categoryRepo, kind]);

  return useCachedQuery({
    queryKey: queryKeys.categories(kind),
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.categories,
  });
}
