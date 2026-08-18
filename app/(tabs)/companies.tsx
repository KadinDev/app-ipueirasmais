import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useCategories } from "@/domains/category/operations/useCategories";
import { useCompanies } from "@/domains/company/operations/useCompanies";
import { Box } from "@/ui/components/Box";
import { CategoryChips } from "@/ui/components/CategoryChips";
import { FilterInput } from "@/ui/components/FilterInput";
import { EmptyState } from "@/ui/components/EmptyState";
import { OfflineState } from "@/ui/components/OfflineState";
import { Screen } from "@/ui/components/Screen";
import { Text } from "@/ui/components/Text";
import { CompanyCard } from "@/ui/containers/CompanyCard";
import { useDebouncedValue } from "@/ui/hooks/useDebouncedValue";

export default function CompaniesScreen() {
  const [search, setSearch] = useState("");
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const trimmedSearch = search.trim();
  const searchableText = trimmedSearch.length >= 5 ? trimmedSearch : "";
  const debouncedSearch = useDebouncedValue(searchableText, 600);
  const {
    data,
    loading,
    refreshing,
    offlineWithoutCache,
    refetch,
    refreshIfStale,
    loadMore,
    hasMore,
    loadingMore,
    loadMoreError,
  } = useCompanies(categorySlug, debouncedSearch);
  const { data: categoriesData } = useCategories("company");
  const categories = categoriesData ?? [];

  const featured = useMemo(
    () =>
      [...(data ?? [])]
        .filter((company) => company.isFeatured)
        .sort(
          (a, b) =>
            (a.placementPriority ?? 100) - (b.placementPriority ?? 100) ||
            a.name.localeCompare(b.name, "pt-BR"),
        ),
    [data],
  );
  const allCompanies = useMemo(
    () =>
      [...(data ?? [])].sort((a, b) =>
        a.name.localeCompare(b.name, "pt-BR"),
      ),
    [data],
  );
  const waitingForSearch = searchableText !== debouncedSearch;

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
          <Box>
            <Text variant="title">Empresas</Text>
            <Text variant="caption">Encontre tudo o que você precisa.</Text>
          </Box>
          <FilterInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar empresas..."
          />
          {trimmedSearch.length > 0 && trimmedSearch.length < 5 ? (
            <Text variant="caption">
              Digite pelo menos 5 caracteres para pesquisar.
            </Text>
          ) : waitingForSearch ? (
            <Box flexDirection="row" alignItems="center" gap="sm">
              <ActivityIndicator size="small" color="#FF7A00" />
              <Text variant="caption">Aguardando você terminar de digitar...</Text>
            </Box>
          ) : null}
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
        ) : (
          <>
            {featured.length ? (
              <Box marginBottom="lg">
                <Text variant="sectionTitle" marginBottom="md">
                  Destaques
                </Text>
                {featured.map((company) => (
                  <Pressable
                    key={company.id}
                    onPress={() =>
                      router.push(`/company-details/${company.id}`)
                    }
                  >
                    <CompanyCard company={company} featuredLayout />
                  </Pressable>
                ))}
              </Box>
            ) : null}

            {allCompanies.length === 0 ? (
              <EmptyState
                title={
                  search.trim() || categorySlug
                    ? "Nenhuma empresa encontrada"
                    : "Nenhuma empresa disponível"
                }
                description={
                  search.trim() || categorySlug
                    ? "Tente buscar outro nome ou selecionar uma categoria diferente."
                    : "As empresas de Ipueiras aparecerão aqui em breve."
                }
              />
            ) : (
              <>
                <Text variant="sectionTitle" marginBottom="md">
                  Todas as empresas
                </Text>
                {allCompanies.map((company) => (
                  <Pressable
                    key={company.id}
                    onPress={() =>
                      router.push(`/company-details/${company.id}`)
                    }
                  >
                    <CompanyCard company={company} />
                  </Pressable>
                ))}

                {hasMore ? (
                  <Box alignItems="center" marginTop="md">
                    <Pressable
                      disabled={loadingMore}
                      accessibilityRole="button"
                      accessibilityLabel="Ver mais empresas"
                      onPress={() => void loadMore()}
                    >
                      <Box
                        minWidth={190}
                        minHeight={48}
                        paddingHorizontal="lg"
                        borderRadius="lg"
                        borderWidth={1}
                        borderColor="primary"
                        backgroundColor="surface"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                        gap="sm"
                        opacity={loadingMore ? 0.6 : 1}
                      >
                        {loadingMore ? (
                          <ActivityIndicator size="small" color="#FF7A00" />
                        ) : null}
                        <Text color="primary" fontWeight="800">
                          {loadingMore
                            ? "Carregando..."
                            : loadMoreError
                              ? "Tentar novamente"
                              : "Ver mais empresas"}
                        </Text>
                      </Box>
                    </Pressable>
                    {loadMoreError ? (
                      <Text variant="caption" textAlign="center" marginTop="sm">
                        Não foi possível carregar mais empresas.
                      </Text>
                    ) : null}
                  </Box>
                ) : null}
              </>
            )}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
