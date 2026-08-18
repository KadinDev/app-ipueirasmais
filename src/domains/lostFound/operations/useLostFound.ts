import { useCallback, useMemo } from "react";
import type { LostFoundItemType } from "../LostFound";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { useRepositories } from "@/repositories/RepositoryProvider";

export function useLostFound(itemType?: LostFoundItemType | null) {
  const { lostFoundRepo } = useRepositories();

  const fetcher = useCallback(() => lostFoundRepo.list(null), [lostFoundRepo]);

  const operation = useCachedQuery({
    queryKey: queryKeys.lostFound,
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.lostFound,
  });

  const filteredData = useMemo(() => {
    if (!itemType) return operation.data;

    return operation.data?.filter((item) => item.itemType === itemType) ?? null;
  }, [itemType, operation.data]);

  return {
    ...operation,
    data: filteredData,
  };
}
