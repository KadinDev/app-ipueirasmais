import { useCallback, useMemo } from "react";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { useRepositories } from "@/repositories/RepositoryProvider";

export function usePromotions(categorySlug?: string | null) {
  const { promotionRepo } = useRepositories();
  const fetcher = useCallback(() => promotionRepo.list(null), [promotionRepo]);
  const operation = useCachedQuery({
    queryKey: queryKeys.promotions,
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.promotions,
  });

  const filteredData = useMemo(() => {
    if (!categorySlug) return operation.data;
    return (
      operation.data?.filter((item) => item.categorySlug === categorySlug) ??
      null
    );
  }, [categorySlug, operation.data]);

  return {
    ...operation,
    data: filteredData,
  };
}
