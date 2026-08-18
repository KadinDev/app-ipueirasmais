import { QueryClient } from "@tanstack/react-query";
import {
  APP_CACHE_GC_TIME_MS,
  APP_CACHE_TTL_MS,
} from "@/infra/cache/cacheConfig";

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: APP_CACHE_TTL_MS,
        gcTime: APP_CACHE_GC_TIME_MS,
        retry: 1,
        retryDelay: 1_000,
        refetchOnMount: true,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        networkMode: "online",
      },
      mutations: {
        retry: 0,
        networkMode: "online",
      },
    },
  });
}

export const appQueryClient = createAppQueryClient();
