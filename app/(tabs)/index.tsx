import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useHome } from "@/domains/home/operations/useHome";
import { useNewsList } from "@/domains/news/operations/useNewsList";
import { Box } from "@/ui/components/Box";
import { OfflineState } from "@/ui/components/OfflineState";
import { Screen } from "@/ui/components/Screen";
import { Text } from "@/ui/components/Text";
import { CompanyCard } from "@/ui/containers/CompanyCard";
import { EventCard } from "@/ui/containers/EventCard";
import { Header } from "@/ui/containers/Header";
import { HappeningNowGrid } from "@/ui/containers/HappeningNowGrid";
import { NewsCard } from "@/ui/containers/NewsCard";
import { NotificationsModal } from "@/ui/containers/NotificationsModal";
import { SectionHeader } from "@/ui/components/SectionHeader";
import { SuperBannerCard } from "@/ui/containers/SuperBannerCard";
import { WeatherPreviewCard } from "@/ui/containers/WeatherPreviewCard";
import { UsefulServicesHomeCard } from "@/ui/containers/UsefulServicesHomeCard";

export default function HomeScreen() {
  //const { data, loading, error } = useHome();
  const {
    data,
    loading,
    error,
    refreshing,
    offlineWithoutCache,
    refetch,
    refreshIfStale,
  } = useHome();
  //
  const { data: newsData } = useNewsList();
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  // Salvar no dispositivo as notificações que o usuário já viu, para saber quando avisar no sino(Animação)
  // quando o usuário terá novas notificações
  const [lastSeenNotificationId, setLastSeenNotificationId] = useState<
    string | null
  >(null);

  const latestNotificationId = useMemo(() => {
    return data?.notifications?.[0]?.id ?? null;
  }, [data?.notifications]);

  useEffect(() => {
    AsyncStorage.getItem("@ipueiras:last_seen_notification_id").then(
      setLastSeenNotificationId,
    );
  }, []);

  const hasNewNotification =
    !!latestNotificationId && latestNotificationId !== lastSeenNotificationId;

  async function handleOpenNotifications() {
    setNotificationsVisible(true);

    if (latestNotificationId) {
      await AsyncStorage.setItem(
        "@ipueiras:last_seen_notification_id",
        latestNotificationId,
      );

      setLastSeenNotificationId(latestNotificationId);
    }
  }
  //
  //

  const homeCompanies = [...(data?.homeCompanies ?? [])]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 10);

  const homeEvents = [...(data?.homeEvents ?? [])]
    .sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
    })
    .slice(0, 10);

  const latestNews = (newsData ?? data?.latestNews ?? []).slice(0, 10);

  // Adicionado
  useFocusEffect(
    useCallback(() => {
      refreshIfStale();
    }, [refreshIfStale]),
  );
  //

  if (offlineWithoutCache) {
    return (
      <Screen>
        <OfflineState onRetry={refetch} />
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen>
        <Box flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator color="#FF7A00" />
        </Box>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        cityName={data?.city?.name || "Ipueiras"}
        onPressNotifications={handleOpenNotifications}
        hasNewNotification={hasNewNotification}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 124 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            tintColor="#FF7A00"
            colors={["#FF7A00"]}
          />
        }
      >
        {error ? (
          <Box
            margin="lg"
            padding="md"
            backgroundColor="surface"
            borderRadius="md"
          >
            <Text variant="body">
              Não foi possível carregar os dados agora.
            </Text>
          </Box>
        ) : null}

        {/* Banner Número 1 */}
        {data?.superBanners?.[0] && (
          <Box marginTop="lg" paddingHorizontal="lg">
            <SuperBannerCard banner={data.superBanners[0]} />
          </Box>
        )}

        <WeatherPreviewCard />

        <HappeningNowGrid
          summary={
            data?.happeningNow ?? {
              promotionsCount: 0,
              todayEventsCount: 0,
              jobsCount: 0,
              alertsCount: 0,
              updatesCount: 0,
              pharmacyDutyCount: 0,
            }
          }
        />

        <Box paddingHorizontal="lg" marginTop="lg">
          <UsefulServicesHomeCard
            pharmacyDutyCount={data?.happeningNow.pharmacyDutyCount}
            onPress={() => router.push("/useful-services" as any)}
          />
        </Box>

        {/* Banner Número 2 */}
        {data?.superBanners?.[1] && (
          <Box marginTop="lg" paddingHorizontal="lg">
            <SuperBannerCard banner={data.superBanners[1]} />
          </Box>
        )}

        {/* Eventos */}
        <Box paddingHorizontal="lg" marginTop="lg">
          <SectionHeader
            title="Próximos eventos"
            actionLabel="Ver todos"
            onPressAction={() => router.push("/events")}
          />
          <FlatList
            data={homeEvents}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`/event-details/${item.id}`)}
              >
                <EventCard
                  event={item}
                  compact // Estou passando que esse Card será o do compact
                />
              </Pressable>
            )}
          />
        </Box>

        {/* Banner Número 3 */}
        {data?.superBanners?.[2] && (
          <Box marginTop="lg" paddingHorizontal="lg">
            <SuperBannerCard banner={data.superBanners[2]} />
          </Box>
        )}

        {/* Empresas */}
        <Box paddingHorizontal="lg" marginTop="xl">
          <SectionHeader
            title="Empresas em destaque"
            actionLabel="Ver todas"
            onPressAction={() => router.push("/companies")}
          />
          <FlatList
            data={homeCompanies}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`/company-details/${item.id}`)}
              >
                <CompanyCard
                  company={item}
                  compact // Estou passando que esse Card será o do compact
                />
              </Pressable>
            )}
          />
        </Box>

        {/* Banner Número 4 */}
        {data?.superBanners?.[3] && (
          <Box marginTop="lg" paddingHorizontal="lg">
            <SuperBannerCard banner={data.superBanners[3]} />
          </Box>
        )}

        {/* Notícias */}
        <Box paddingHorizontal="lg" marginTop="xl">
          <SectionHeader
            title="Últimas notícias"
            actionLabel="Ver todas"
            onPressAction={() => router.push("/news")}
          />
          {latestNews.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push(`/news-details/${item.id}`)}
            >
              <NewsCard news={item} />
            </Pressable>
          ))}
        </Box>

        {/* Banner Número 5 */}
        {data?.superBanners?.[4] && (
          <Box marginTop="lg" paddingHorizontal="lg">
            <SuperBannerCard banner={data.superBanners[4]} />
          </Box>
        )}

        {/* Footer */}
        <Box
          paddingHorizontal="lg"
          paddingTop="xxl"
          paddingBottom="lg"
          alignItems="center"
        >
          <Text variant="cardTitle" color="text" marginTop="xs">
            @ipueirasmais
          </Text>
          <Text variant="caption">Siga o Ipueiras+ no Instagram</Text>

          <Text variant="caption" fontSize={10}>
            © 2026 Ipueiras+
          </Text>
        </Box>
      </ScrollView>

      <NotificationsModal
        visible={notificationsVisible}
        notifications={data?.notifications ?? []}
        onClose={() => setNotificationsVisible(false)}
      />
    </Screen>
  );
}
