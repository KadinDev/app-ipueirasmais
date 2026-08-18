import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useNewsList } from "@/domains/news/operations/useNewsList";
import { Box } from "@/ui/components/Box";
import { EmptyState } from "@/ui/components/EmptyState";
import { OfflineState } from "@/ui/components/OfflineState";
import { Screen } from "@/ui/components/Screen";
import { Text } from "@/ui/components/Text";
import { NewsCard } from "@/ui/containers/NewsCard";

export default function NewsScreen() {
  const {
    data,
    loading,
    refreshing,
    offlineWithoutCache,
    refetch,
    refreshIfStale,
  } = useNewsList();

  useFocusEffect(
    useCallback(() => {
      refreshIfStale();
    }, [refreshIfStale]),
  );

  return (
    <Screen>
      <Box padding="lg">
        <Text variant="title">Notícias</Text>
        <Text variant="caption">Tudo o que acontece na cidade.</Text>
      </Box>
      {offlineWithoutCache ? (
        <OfflineState onRetry={refetch} />
      ) : loading ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator color="#FF7A00" />
        </Box>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 124 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refetch}
              tintColor="#FF7A00"
              colors={["#FF7A00"]}
            />
          }
        >
          {(data ?? []).length === 0 ? (
            <EmptyState
              title="Nenhuma notícia publicada"
              description="As próximas notícias de Ipueiras aparecerão aqui."
            />
          ) : (
            (data ?? []).map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/news-details/${item.id}`)}
              >
                <NewsCard news={item} />
              </Pressable>
            ))
          )}
        </ScrollView>
      )}
    </Screen>
  );
}
