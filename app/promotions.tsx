import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import { useCategories } from "@/domains/category/operations/useCategories";
import { usePromotions } from "@/domains/promotion/operations/usePromotions";
import { Box } from "@/ui/components/Box";
import { CategoryChips } from "@/ui/components/CategoryChips";
import { EmptyState } from "@/ui/components/EmptyState";
import { OfflineState } from "@/ui/components/OfflineState";
import { Screen } from "@/ui/components/Screen";
import { ScreenHeader } from "@/ui/components/ScreenHeader";
import { PromotionCard } from "@/ui/containers/PromotionCard";

export default function PromotionsScreen() {
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const {
    data,
    loading,
    refreshing,
    offlineWithoutCache,
    refetch,
    refreshIfStale,
  } = usePromotions(categorySlug);
  const { data: categoriesData } = useCategories("promotion");
  const categories = categoriesData ?? [];

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
        <Box gap="md" marginBottom="lg">
          <ScreenHeader title="Promoções" />
          <CategoryChips
            categories={categories}
            selectedSlug={categorySlug}
            onSelect={setCategorySlug}
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
            title={
              categorySlug
                ? "Nenhuma promoção nesta categoria"
                : "Nenhuma promoção disponível"
            }
            description={
              categorySlug
                ? "Selecione outra categoria para conferir mais ofertas."
                : "Novas ofertas aparecerão aqui em breve."
            }
          />
        ) : (
          (data ?? []).map((promotion) => (
            <PromotionCard key={promotion.id} promotion={promotion} />
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
