import { useCallback } from "react";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { useRepositories } from "@/repositories/RepositoryProvider";

export function useCompanyDetails(id?: string | null) {
  const { companyRepo } = useRepositories();
  const fetcher = useCallback(async () => {
    if (!id) return null;
    return companyRepo.findById(id);
  }, [companyRepo, id]);

  return useCachedQuery({
    queryKey: queryKeys.companies.detail(id),
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.companies,
  });
}
