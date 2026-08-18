import Feather from "@expo/vector-icons/Feather";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useCallback, useRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import type { Company } from "@/domains/company/Company";
import { useNewsDetails } from "@/domains/news/operations/useNewsDetails";
import { Badge } from "@/ui/components/Badge";
import { Box } from "@/ui/components/Box";
import { CooldownPressable } from "@/ui/components/CooldownPressable";
import { OfflineState } from "@/ui/components/OfflineState";
import { RemoteImage } from "@/ui/components/RemoteImage";
import { Screen } from "@/ui/components/Screen";
import { Text } from "@/ui/components/Text";
import { ShareStoryCard } from "@/ui/containers/ShareStoryCard";
import { formatDate } from "@/ui/utils/format";

export default function NewsDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data,
    loading,
    offlineWithoutCache,
    refetch,
    refreshIfStale,
  } = useNewsDetails(id);
  const news = data?.news ?? null;
  const sponsor = data?.sponsor ?? null;
  const storyRef = useRef<View>(null);

  const shareStory = async () => {
    try {
      if (!storyRef.current || !(await Sharing.isAvailableAsync()))
        throw new Error();
      const uri = await captureRef(storyRef, {
        format: "png",
        quality: 1,
        width: 1080,
        height: 1920,
      });
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "Compartilhar notícia",
      });
    } catch {
      if (news) await Share.share({ message: `${news.title} - Ipueiras+` });
    }
  };

  useFocusEffect(
    useCallback(() => {
      refreshIfStale();
    }, [refreshIfStale]),
  );

  if (offlineWithoutCache) {
    return (
      <Screen>
        <OfflineState onRetry={refetch} onBack={() => router.back()} />
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

  if (!news) return null;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 126 }}
      >
        <Box>
          <RemoteImage uri={news.coverUrl} height={226} radius="none" />
          <Pressable
            onPress={() => router.back()}
            style={{ position: "absolute", top: 20, left: 16 }}
          >
            <Box
              width={40}
              height={40}
              borderRadius="pill"
              backgroundColor="surface"
              alignItems="center"
              justifyContent="center"
            >
              <Feather name="arrow-left" size={22} color="#FFFFFF" />
            </Box>
          </Pressable>
          <CooldownPressable
            onPress={shareStory}
            style={{ position: "absolute", top: 20, right: 16 }}
          >
            <Box
              width={40}
              height={40}
              borderRadius="pill"
              backgroundColor="surface"
              alignItems="center"
              justifyContent="center"
            >
              <Feather name="share-2" size={20} color="#FFFFFF" />
            </Box>
          </CooldownPressable>
        </Box>

        <Box padding="lg" gap="lg">
          <Box gap="xs">
            <Text variant="title">{news.title}</Text>
            <Text variant="caption">{formatDate(news.publishedAt)}</Text>
            {news.excerpt ? <Text variant="body">{news.excerpt}</Text> : null}
          </Box>

          {sponsor ? (
            <Box gap="sm">
              <Text variant="caption">Patrocínio</Text>
              <SponsorCard company={sponsor} />
            </Box>
          ) : null}

          <Text variant="body">{news.body || "Conteúdo em breve."}</Text>
        </Box>
      </ScrollView>

      <ShareStoryCard
        ref={storyRef}
        type="news"
        title={news.title}
        description={news.excerpt || news.body}
        imageUrl={news.coverUrl}
      />
    </Screen>
  );
}

function SponsorCard({ company }: { company: Company }) {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      gap="sm"
      padding="md"
      backgroundColor="card"
      borderRadius="lg"
      borderWidth={1}
      borderColor="primary"
    >
      <Box width={52} height={52} borderRadius="pill" overflow="hidden">
        <RemoteImage
          uri={company.logoUrl || company.coverUrl}
          height={52}
          radius="none"
        />
      </Box>
      <Box flex={1}>
        <Text variant="cardTitle" numberOfLines={1}>
          {company.name}
        </Text>
      </Box>
      <Badge label="DESTAQUE" />
    </Box>
  );
}
