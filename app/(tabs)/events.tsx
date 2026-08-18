import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useCategories } from "@/domains/category/operations/useCategories";
import { useEvents } from "@/domains/event/operations/useEvents";
import { Box } from "@/ui/components/Box";
import { CategoryChips } from "@/ui/components/CategoryChips";
import { FilterInput } from "@/ui/components/FilterInput";
import { EmptyState } from "@/ui/components/EmptyState";
import { OfflineState } from "@/ui/components/OfflineState";
import { Screen } from "@/ui/components/Screen";
import { Text } from "@/ui/components/Text";
import { EventCard } from "@/ui/containers/EventCard";

export default function EventsScreen() {
  const [search, setSearch] = useState("");
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const {
    data,
    loading,
    refreshing,
    offlineWithoutCache,
    refetch,
    refreshIfStale,
  } = useEvents(categorySlug);
  const { data: categoriesData } = useCategories("event");
  const categories = categoriesData ?? [];

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (data ?? []).filter((event) => {
      if (!query) return true;
      return [
        event.title,
        event.description,
        event.venueName,
        event.categoryName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [data, search]);

  const byDate = (a: { startsAt: string }, b: { startsAt: string }) =>
    new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
  const featured = filtered.filter((event) => event.isFeatured).sort(byDate);
  const allEvents = filtered.sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return byDate(a, b);
  });

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
            <Text variant="title">Eventos</Text>
            <Text variant="caption">Os melhores eventos estão aqui.</Text>
          </Box>

          <FilterInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar eventos..."
          />
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
                {featured.map((event) => (
                  <Pressable
                    key={event.id}
                    onPress={() => router.push(`/event-details/${event.id}`)}
                  >
                    <EventCard event={event} featuredLayout />
                  </Pressable>
                ))}
              </Box>
            ) : null}

            {allEvents.length === 0 ? (
              <EmptyState
                title={
                  search.trim() || categorySlug
                    ? "Nenhum evento encontrado"
                    : "Nenhum evento disponível"
                }
                description={
                  search.trim() || categorySlug
                    ? "Tente buscar outro evento ou selecionar uma categoria diferente."
                    : "Os próximos eventos de Ipueiras aparecerão aqui."
                }
              />
            ) : (
              <>
                <Text variant="sectionTitle" marginBottom="md">
                  Todos os eventos
                </Text>
                {allEvents.map((event) => (
                  <Pressable
                    key={event.id}
                    onPress={() => router.push(`/event-details/${event.id}`)}
                  >
                    <EventCard event={event} />
                  </Pressable>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
