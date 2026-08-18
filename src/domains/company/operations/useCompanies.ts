import {
  type InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import type { Company } from "../Company";
import {
  APP_MANUAL_REFRESH_COOLDOWN_MS,
  CACHE_TTL_MS,
} from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useRepositories } from "@/repositories/RepositoryProvider";
import {
  COMPANY_REQUEST_SIZE,
  flattenCompanyPages,
  getNextCompanyOffset,
} from "./companyPagination";

export function useCompanies(
  categorySlug?: string | null,
  search?: string | null,
) {
  const { companyRepo } = useRepositories();
  const queryClient = useQueryClient();
  const normalizedSearch = search?.trim() || null;
  const queryKey = useMemo(
    () => queryKeys.companies.list(categorySlug, normalizedSearch),
    [categorySlug, normalizedSearch],
  );
  const [manualRefreshing, setManualRefreshing] = useState(false);

  const query = useInfiniteQuery({
    queryKey,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      companyRepo.list({
        categorySlug,
        search: normalizedSearch,
        limit: COMPANY_REQUEST_SIZE,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      getNextCompanyOffset(lastPage, lastPageParam),
    staleTime: CACHE_TTL_MS.companies,
    refetchOnMount: false,
  });

  const resetToFirstPage = useCallback(() => {
    const updatedAt = queryClient.getQueryState(queryKey)?.dataUpdatedAt;
    queryClient.setQueryData<InfiniteData<Company[], number>>(
      queryKey,
      (current) => {
        if (!current || current.pages.length <= 1) return current;
        return {
          pages: [current.pages[0]],
          pageParams: [current.pageParams[0] ?? 0],
        };
      },
      { updatedAt },
    );
  }, [queryClient, queryKey]);

  const refetchQuery = query.refetch;
  const refreshIfStale = useCallback(async () => {
    const state = queryClient.getQueryState(queryKey);
    const isStale =
      !state?.dataUpdatedAt ||
      Date.now() - state.dataUpdatedAt >= CACHE_TTL_MS.companies;

    if (!isStale || state?.fetchStatus === "fetching") return;
    resetToFirstPage();
    await refetchQuery({ cancelRefetch: false });
  }, [queryClient, queryKey, refetchQuery, resetToFirstPage]);

  const refetch = useCallback(async () => {
    const state = queryClient.getQueryState(queryKey);
    const lastUpdatedAt = state?.dataUpdatedAt ?? 0;
    const canRefresh =
      !lastUpdatedAt ||
      Date.now() - lastUpdatedAt >= APP_MANUAL_REFRESH_COOLDOWN_MS;

    if (!canRefresh || state?.fetchStatus === "fetching") return;

    setManualRefreshing(true);
    try {
      resetToFirstPage();
      await refetchQuery({ cancelRefetch: false });
    } finally {
      setManualRefreshing(false);
    }
  }, [queryClient, queryKey, refetchQuery, resetToFirstPage]);

  const data = useMemo(
    () => (query.data ? flattenCompanyPages(query.data.pages) : null),
    [query.data],
  );
  const offlineWithoutCache =
    query.data === undefined && query.fetchStatus === "paused";

  return {
    data,
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
    loadMore: query.fetchNextPage,
    hasMore: query.hasNextPage,
    loadingMore: query.isFetchingNextPage,
    loadMoreError: query.isFetchNextPageError,
  };
}
