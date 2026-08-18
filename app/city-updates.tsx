import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import { useCityUpdates } from "@/domains/cityUpdate/operations/useCityUpdates";
import { Box } from "@/ui/components/Box";
import { EmptyState } from "@/ui/components/EmptyState";
import { OfflineState } from "@/ui/components/OfflineState";
import { Screen } from "@/ui/components/Screen";
import { ScreenHeader } from "@/ui/components/ScreenHeader";
import { CityUpdateCard } from "@/ui/containers/CityUpdateCard";

export default function CityUpdatesScreen() {
  const {
    data,
    loading,
    refreshing,
    offlineWithoutCache,
    refetch,
    refreshIfStale,
  } = useCityUpdates();

  useFocusEffect(
    useCallback(() => {
      refreshIfStale();
    }, [refreshIfStale]),
  );

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 124 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            tintColor="#FF7A00"
            colors={["#FF7A00"]}
          />
        }
      >
        <Box marginBottom="lg">
          <ScreenHeader
            title="Novidades da Cidade"
            subtitle="O que chegou de novo no Ipueiras+."
          />
        </Box>

        {offlineWithoutCache ? (
          <OfflineState onRetry={refetch} />
        ) : loading ? (
          <Box height={220} alignItems="center" justifyContent="center">
            <ActivityIndicator color="#FF7A00" />
          </Box>
        ) : (data ?? []).length === 0 ? (
          <EmptyState
            title="Nenhuma novidade publicada"
            description="As próximas novidades da cidade aparecerão aqui."
          />
        ) : (
          (data ?? []).map((update) => (
            <CityUpdateCard key={update.id} update={update} />
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
