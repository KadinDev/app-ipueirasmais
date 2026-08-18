import {
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { PropsWithChildren } from "react";
import { useCachedQuery } from "../useCachedQuery";

function createTestHarness() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  });
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { queryClient, wrapper };
}

describe("useCachedQuery", () => {
  beforeEach(() => {
    onlineManager.setOnline(true);
  });

  it("loads data and preserves the screen-facing contract", async () => {
    const { wrapper } = createTestHarness();
    const queryFn = jest.fn().mockResolvedValue({ title: "Ipueiras+" });
    const { result } = renderHook(
      () =>
        useCachedQuery({
          queryKey: ["test", "contract"],
          queryFn,
        }),
      { wrapper },
    );

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual({ title: "Ipueiras+" });
    expect(result.current.error).toBeNull();
    expect(result.current.refreshing).toBe(false);
    expect(result.current.lastUpdatedAt).toBeGreaterThan(0);
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it("deduplicates simultaneous requests with the same query key", async () => {
    const { wrapper } = createTestHarness();
    let resolveRequest: (value: string[]) => void = () => undefined;
    const queryFn = jest.fn(
      () =>
        new Promise<string[]>((resolve) => {
          resolveRequest = resolve;
        }),
    );

    const first = renderHook(
      () => useCachedQuery({ queryKey: ["test", "shared"], queryFn }),
      { wrapper },
    );
    const second = renderHook(
      () => useCachedQuery({ queryKey: ["test", "shared"], queryFn }),
      { wrapper },
    );

    expect(queryFn).toHaveBeenCalledTimes(1);
    await act(async () => resolveRequest(["shared"]));
    await waitFor(() => expect(first.result.current.data).toEqual(["shared"]));
    expect(second.result.current.data).toEqual(["shared"]);
  });

  it("respects the manual refresh cooldown", async () => {
    const { queryClient, wrapper } = createTestHarness();
    const queryKey = ["test", "cooldown"] as const;
    const queryFn = jest.fn().mockResolvedValue("fresh");
    const { result } = renderHook(
      () =>
        useCachedQuery({
          queryKey,
          queryFn,
          manualRefreshCooldownMs: 60_000,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.data).toBe("fresh"));
    await act(async () => result.current.refetch());
    expect(queryFn).toHaveBeenCalledTimes(1);

    act(() => {
      queryClient.setQueryData(queryKey, "stale", {
        updatedAt: Date.now() - 60_001,
      });
    });
    await act(async () => result.current.refetch());
    expect(queryFn).toHaveBeenCalledTimes(2);
  });

  it("refreshes only when cached data is stale", async () => {
    const { queryClient, wrapper } = createTestHarness();
    const queryKey = ["test", "stale"] as const;
    const queryFn = jest.fn().mockResolvedValue("value");
    const { result } = renderHook(
      () => useCachedQuery({ queryKey, queryFn, staleTime: 60_000 }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.data).toBe("value"));
    await act(async () => result.current.refreshIfStale());
    expect(queryFn).toHaveBeenCalledTimes(1);

    act(() => {
      queryClient.setQueryData(queryKey, "old", {
        updatedAt: Date.now() - 60_001,
      });
    });
    await act(async () => result.current.refreshIfStale());
    expect(queryFn).toHaveBeenCalledTimes(2);
  });

  it("exposes query failures as Error without discarding the contract", async () => {
    const { wrapper } = createTestHarness();
    const failure = new Error("Falha controlada");
    const { result } = renderHook(
      () =>
        useCachedQuery({
          queryKey: ["test", "error"],
          queryFn: jest.fn().mockRejectedValue(failure),
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.error).toBe(failure));
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("keeps refresh callbacks stable across screen rerenders", async () => {
    const { wrapper } = createTestHarness();
    const queryFn = jest.fn().mockResolvedValue("stable");
    const { result, rerender } = renderHook(
      () =>
        useCachedQuery({
          queryKey: ["test", "stable-callbacks"],
          queryFn,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.data).toBe("stable"));
    const refreshIfStale = result.current.refreshIfStale;
    const refetch = result.current.refetch;

    rerender(undefined);

    expect(result.current.refreshIfStale).toBe(refreshIfStale);
    expect(result.current.refetch).toBe(refetch);
  });

  it("exposes offline without cache instead of an endless loading state", () => {
    onlineManager.setOnline(false);
    const { wrapper } = createTestHarness();
    const queryFn = jest.fn().mockResolvedValue("network data");
    const { result } = renderHook(
      () =>
        useCachedQuery({
          queryKey: ["test", "offline-empty"],
          queryFn,
        }),
      { wrapper },
    );

    expect(result.current.offlineWithoutCache).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(queryFn).not.toHaveBeenCalled();
  });

  it("continues exposing cached data while offline", () => {
    onlineManager.setOnline(false);
    const { queryClient, wrapper } = createTestHarness();
    const queryKey = ["test", "offline-cached"] as const;
    queryClient.setQueryData(queryKey, "cached data");
    const queryFn = jest.fn().mockResolvedValue("network data");
    const { result } = renderHook(
      () => useCachedQuery({ queryKey, queryFn }),
      { wrapper },
    );

    expect(result.current.data).toBe("cached data");
    expect(result.current.offlineWithoutCache).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(queryFn).not.toHaveBeenCalled();
  });
});
