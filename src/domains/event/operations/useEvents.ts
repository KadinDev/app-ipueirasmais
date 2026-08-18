import { useCallback, useMemo } from "react";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { useRepositories } from "@/repositories/RepositoryProvider";

export function useEvents(categorySlug?: string | null) {
  const { eventRepo } = useRepositories();
  const fetcher = useCallback(() => eventRepo.list(null), [eventRepo]);
  const operation = useCachedQuery({
    queryKey: queryKeys.events.all,
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.events,
  });

  const filteredData = useMemo(() => {
    if (!categorySlug) return operation.data;
    return (
      operation.data?.filter((event) => event.categorySlug === categorySlug) ??
      null
    );
  }, [categorySlug, operation.data]);

  return {
    ...operation,
    data: filteredData,
  };
}
