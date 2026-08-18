import { useCallback, useMemo } from "react";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { useRepositories } from "@/repositories/RepositoryProvider";

export function useJobs(categorySlug?: string | null) {
  const { jobRepo } = useRepositories();
  const fetcher = useCallback(() => jobRepo.list(null), [jobRepo]);
  const operation = useCachedQuery({
    queryKey: queryKeys.jobs,
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.jobs,
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
