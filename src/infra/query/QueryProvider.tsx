import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { focusManager, onlineManager } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import * as Network from "expo-network";
import { PropsWithChildren, useEffect } from "react";
import { AppState, Platform, type AppStateStatus } from "react-native";
import {
  APP_CACHE_MAX_AGE_MS,
  APP_QUERY_CACHE_BUSTER,
  APP_QUERY_CACHE_STORAGE_KEY,
} from "@/infra/cache/cacheConfig";
import { appQueryClient } from "./queryClient";

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: APP_QUERY_CACHE_STORAGE_KEY,
  throttleTime: 1_000,
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export function QueryProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") return;

    onlineManager.setEventListener((setOnline) => {
      let initialized = false;
      const subscription = Network.addNetworkStateListener((state) => {
        initialized = true;
        setOnline(Boolean(state.isConnected));
      });

      void Network.getNetworkStateAsync()
        .then((state) => {
          if (!initialized) setOnline(Boolean(state.isConnected));
        })
        .catch(() => {
          // Keep the last known state if the native API is unavailable.
        });

      return () => subscription.remove();
    });
  }, []);

  return (
    <PersistQueryClientProvider
      client={appQueryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: APP_CACHE_MAX_AGE_MS,
        buster: APP_QUERY_CACHE_BUSTER,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.state.status === "success",
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
