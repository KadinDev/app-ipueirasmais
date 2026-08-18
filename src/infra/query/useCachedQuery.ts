import {
  hashKey,
  type QueryKey,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import {
  APP_CACHE_TTL_MS,
  APP_MANUAL_REFRESH_COOLDOWN_MS,
} from "@/infra/cache/cacheConfig";

type CachedQueryOptions<T> = {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
  staleTime?: number;
  manualRefreshCooldownMs?: number;
};

export function useCachedQuery<T>({
  queryKey,
  queryFn,
  staleTime = APP_CACHE_TTL_MS,
  manualRefreshCooldownMs = APP_MANUAL_REFRESH_COOLDOWN_MS,
}: CachedQueryOptions<T>) {
  const queryClient = useQueryClient();
  const queryKeyHash = hashKey(queryKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableQueryKey = useMemo(() => queryKey, [queryKeyHash]);
  const [manualRefreshing, setManualRefreshing] = useState(false);

  const query = useQuery({
    queryKey: stableQueryKey,
    queryFn,
    staleTime,
  });
  const refetchQuery = query.refetch;

  const refreshIfStale = useCallback(async () => {
    const state = queryClient.getQueryState<T>(stableQueryKey);
    const isStale =
      !state?.dataUpdatedAt || Date.now() - state.dataUpdatedAt >= staleTime;

    if (isStale && state?.fetchStatus !== "fetching") {
      await refetchQuery({ cancelRefetch: false });
    }
  }, [queryClient, refetchQuery, stableQueryKey, staleTime]);

  const refetch = useCallback(async () => {
    const state = queryClient.getQueryState<T>(stableQueryKey);
    const lastUpdatedAt = state?.dataUpdatedAt ?? 0;
    const canRefresh =
      !lastUpdatedAt || Date.now() - lastUpdatedAt >= manualRefreshCooldownMs;

    if (!canRefresh || state?.fetchStatus === "fetching") return;

    setManualRefreshing(true);
    try {
      await refetchQuery({ cancelRefetch: false });
    } finally {
      setManualRefreshing(false);
    }
  }, [manualRefreshCooldownMs, queryClient, refetchQuery, stableQueryKey]);

  const offlineWithoutCache =
    query.data === undefined && query.fetchStatus === "paused";

  return {
    data: query.data ?? null,
    loading:
      query.isPending &&
      query.data === undefined &&
      query.fetchStatus !== "paused",
    refreshing: manualRefreshing,
    offlineWithoutCache,
    error: query.error instanceof Error ? query.error : null,
    lastUpdatedAt: query.dataUpdatedAt,
    refetch,
    refreshIfStale,
  };
}
