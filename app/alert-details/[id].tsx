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
import { useAlertDetails } from "@/domains/alert/operations/useAlertDetails";
import { Badge } from "@/ui/components/Badge";
import { Box } from "@/ui/components/Box";
import { CooldownPressable } from "@/ui/components/CooldownPressable";
import { OfflineState } from "@/ui/components/OfflineState";
import { Screen } from "@/ui/components/Screen";
import { Text } from "@/ui/components/Text";
import { ShareStoryCard } from "@/ui/containers/ShareStoryCard";
import { formatDate } from "@/ui/utils/format";

export default function AlertDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: alert,
    loading,
    offlineWithoutCache,
    refetch,
    refreshIfStale,
  } = useAlertDetails(id);
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
        dialogTitle: "Compartilhar aviso",
      });
    } catch {
      if (alert) await Share.share({ message: `${alert.title} - Ipueiras+` });
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

  if (!alert) return null;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 124 }}
      >
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom="xl"
        >
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </Pressable>
          <Text variant="sectionTitle">Detalhe do Aviso</Text>
          <CooldownPressable onPress={shareStory} hitSlop={12}>
            <Feather name="share-2" size={20} color="#FFFFFF" />
          </CooldownPressable>
        </Box>

        <Box
          backgroundColor="card"
          borderRadius="lg"
          borderWidth={1}
          borderColor="border"
          padding="lg"
          gap="lg"
        >
          <Box flexDirection="row" gap="md" alignItems="center">
            <Box
              width={64}
              height={64}
              borderRadius="pill"
              backgroundColor={
                alert.importance === "urgent"
                  ? "danger"
                  : alert.importance === "important"
                    ? "primary"
                    : "blue"
              }
              alignItems="center"
              justifyContent="center"
            >
              <Feather name="volume-2" size={26} color="#FFFFFF" />
            </Box>

            <Box flex={1} gap="xs">
              {alert.importance !== "normal" ? (
                <Box alignSelf="flex-start">
                  <Badge
                    label={
                      alert.importance === "urgent" ? "URGENTE" : "IMPORTANTE"
                    }
                    tone={alert.importance === "urgent" ? "danger" : "primary"}
                  />
                </Box>
              ) : null}
              <Text variant="title" numberOfLines={4}>
                {alert.title}
              </Text>
            </Box>
          </Box>

          {alert.summary ? <Text variant="body">{alert.summary}</Text> : null}

          {alert.body ? <Text variant="body">{alert.body}</Text> : null}

          {alert.affectedAreas ? (
            <InfoBlock title="Bairros afetados" text={alert.affectedAreas} />
          ) : null}

          {alert.expectedResolution ? (
            <InfoBlock
              title="Previsão de normalização"
              text={alert.expectedResolution}
            />
          ) : null}

          {alert.publishedAt ? (
            <Text variant="caption">
              Publicado em {formatDate(alert.publishedAt)}
            </Text>
          ) : null}
        </Box>
      </ScrollView>

      <ShareStoryCard
        ref={storyRef}
        type="alert"
        title={alert.title}
        description={alert.summary || alert.body}
      />
    </Screen>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <Box gap="xs">
      <Text variant="cardTitle">{title}</Text>
      <Text variant="body">{text}</Text>
    </Box>
  );
}
