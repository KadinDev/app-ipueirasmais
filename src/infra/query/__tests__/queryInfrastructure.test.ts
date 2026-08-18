import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import type { PersistedClient } from "@tanstack/react-query-persist-client";
import {
  APP_CACHE_GC_TIME_MS,
  APP_CACHE_TTL_MS,
  CACHE_TTL_MS,
} from "@/infra/cache/cacheConfig";
import { createAppQueryClient } from "../queryClient";
import { queryKeys } from "../queryKeys";

describe("query infrastructure", () => {
  it("defines the expected cache time for each domain", () => {
    expect(CACHE_TTL_MS).toEqual({
      home: 20 * 60 * 1000,
      news: 20 * 60 * 1000,
      alerts: 20 * 60 * 1000,
      cityUpdates: 20 * 60 * 1000,
      events: 40 * 60 * 1000,
      jobs: 40 * 60 * 1000,
      promotions: 40 * 60 * 1000,
      companies: 2 * 60 * 60 * 1000,
      categories: 24 * 60 * 60 * 1000,
      weather: 2 * 60 * 60 * 1000,
      usefulServices: 4 * 60 * 60 * 1000,
      appVersion: 10 * 60 * 60 * 1000,
    });
  });

  it("uses conservative defaults that protect Supabase usage", () => {
    const client = createAppQueryClient();
    const options = client.getDefaultOptions().queries;

    expect(options?.staleTime).toBe(APP_CACHE_TTL_MS);
    expect(options?.gcTime).toBe(APP_CACHE_GC_TIME_MS);
    expect(options?.retry).toBe(1);
    expect(options?.refetchOnMount).toBe(true);
    expect(options?.refetchOnReconnect).toBe(false);
    expect(options?.refetchOnWindowFocus).toBe(false);
    expect(options?.refetchInterval).toBe(false);
  });

  it("keeps list and detail query keys isolated", () => {
    expect(queryKeys.news.all).not.toEqual(queryKeys.news.detail("news-1"));
    expect(queryKeys.news.detail("news-1")).not.toEqual(
      queryKeys.news.detail("news-2"),
    );
    expect(queryKeys.companies.detail("company-1")).not.toEqual(
      queryKeys.events.detail("company-1"),
    );
    expect(queryKeys.companies.list(null, null)).not.toEqual(
      queryKeys.companies.list("farmacias", null),
    );
    expect(queryKeys.companies.list(null, "pizza")).not.toEqual(
      queryKeys.companies.list(null, "farmacia"),
    );
    expect(queryKeys.categories("company")).not.toEqual(
      queryKeys.categories("event"),
    );
  });

  it("persists and restores a query cache payload", async () => {
    const memory = new Map<string, string>();
    const storage = {
      getItem: jest.fn(async (key: string) => memory.get(key) ?? null),
      setItem: jest.fn(async (key: string, value: string) => {
        memory.set(key, value);
      }),
      removeItem: jest.fn(async (key: string) => {
        memory.delete(key);
      }),
    };
    const persister = createAsyncStoragePersister({
      storage,
      key: "test-query-cache",
      throttleTime: 0,
    });
    const persistedClient: PersistedClient = {
      timestamp: Date.now(),
      buster: "test-v1",
      clientState: {
        mutations: [],
        queries: [],
      },
    };

    await persister.persistClient(persistedClient);
    await expect(persister.restoreClient()).resolves.toEqual(persistedClient);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
  });
});
