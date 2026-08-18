import { useCallback } from "react";
import type { Company } from "@/domains/company/Company";
import type { News } from "../News";
import { CACHE_TTL_MS } from "@/infra/cache/cacheConfig";
import { queryKeys } from "@/infra/query/queryKeys";
import { useCachedQuery } from "@/infra/query/useCachedQuery";
import { useRepositories } from "@/repositories/RepositoryProvider";

type NewsDetailsPayload = {
  news: News | null;
  sponsor: Company | null;
};

export function useNewsDetails(id?: string | null) {
  const { newsRepo, companyRepo } = useRepositories();
  const fetcher = useCallback(async (): Promise<NewsDetailsPayload> => {
    if (!id) return { news: null, sponsor: null };

    const news = await newsRepo.findById(id);
    const sponsor = news?.cityId
      ? await companyRepo.getRandomFeaturedForNews(news.cityId)
      : null;

    return { news, sponsor };
  }, [companyRepo, id, newsRepo]);

  return useCachedQuery({
    queryKey: queryKeys.news.detail(id),
    queryFn: fetcher,
    staleTime: CACHE_TTL_MS.news,
  });
}
