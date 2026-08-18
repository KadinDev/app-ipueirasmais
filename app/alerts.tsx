import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useAlerts } from "@/domains/alert/operations/useAlerts";
import { Box } from "@/ui/components/Box";
import { EmptyState } from "@/ui/components/EmptyState";
import { OfflineState } from "@/ui/components/OfflineState";
import { Screen } from "@/ui/components/Screen";
import { ScreenHeader } from "@/ui/components/ScreenHeader";
import { AlertCard } from "@/ui/containers/AlertCard";

export default function AlertsScreen() {
  const {
    data,
    loading,
    refreshing,
    offlineWithoutCache,
    refetch,
    refreshIfStale,
  } = useAlerts();

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
            title="Avisos da Prefeitura"
            subtitle="Comunicados importantes da cidade."
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
            title="Nenhum aviso publicado"
            description="Os próximos comunicados da Prefeitura aparecerão aqui."
          />
        ) : (
          (data ?? []).map((alert) => (
            <Pressable
              key={alert.id}
              onPress={() => router.push(`/alert-details/${alert.id}` as any)}
            >
              <AlertCard alert={alert} />
            </Pressable>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
