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
import { useEventDetails } from "@/domains/event/operations/useEventDetails";
import { Badge } from "@/ui/components/Badge";
import { Box } from "@/ui/components/Box";
import { CooldownPressable } from "@/ui/components/CooldownPressable";
import { MapPreview } from "@/ui/components/MapPreview";
import { OfflineState } from "@/ui/components/OfflineState";
import { RemoteImage } from "@/ui/components/RemoteImage";
import { Screen } from "@/ui/components/Screen";
import { Text } from "@/ui/components/Text";
import { ShareStoryCard } from "@/ui/containers/ShareStoryCard";
import { formatFullDate, formatTime } from "@/ui/utils/format";
import { openExternalUrl, whatsappUrl } from "@/ui/utils/links";
import { theme } from "@/ui/theme/theme";

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: event,
    loading,
    offlineWithoutCache,
    refetch,
    refreshIfStale,
  } = useEventDetails(id);
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
        dialogTitle: "Compartilhar evento",
      });
    } catch {
      if (event) await Share.share({ message: `${event.title} - Ipueiras+` });
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

  if (!event) return null;

  const fullAddress = [event.venueName, event.addressLine]
    .filter(Boolean)
    .join(" - ");
  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 126 }}
      >
        <Box>
          <RemoteImage uri={event.coverUrl} height={236} radius="none" />
          <HeaderButton
            icon="arrow-left"
            left={16}
            onPress={() => router.back()}
          />
        </Box>

        <Box padding="lg" gap="lg" marginTop="sm">
          {event.isFeatured ? (
            <Box alignSelf="flex-start">
              <Badge label="EM DESTAQUE" />
            </Box>
          ) : null}

          <Box>
            <Text variant="title">{event.title}</Text>
            {event.categoryName ? (
              <Text
                variant="body"
                style={{ color: theme.colors.warning, opacity: 0.8 }}
              >
                {event.categoryName}
              </Text>
            ) : null}
          </Box>

          <InfoRow icon="calendar" text={formatFullDate(event.startsAt)} />
          <InfoRow icon="clock" text={formatTime(event.startsAt)} />
          <InfoRow icon="map-pin" text={fullAddress || "Local a definir"} />
          {event.priceLabel?.trim() ? (
            <InfoRow icon="dollar-sign" text={event.priceLabel} />
          ) : null}

          <Text variant="body">
            {event.description || "Informações em breve."}
          </Text>

          <MapPreview
            latitude={event.latitude}
            longitude={event.longitude}
            address={fullAddress}
          />

          <CooldownPressable onPress={shareStory}>
            <ActionButton label="Compartilhar" tone="primary" />
          </CooldownPressable>

          {event.ticketUrl ? (
            <CooldownPressable onPress={() => openExternalUrl(event.ticketUrl)}>
              <ActionButton label="Ingressos" tone="primary" />
            </CooldownPressable>
          ) : null}

          {event.whatsapp ? (
            <CooldownPressable
              onPress={() =>
                openExternalUrl(
                  whatsappUrl(
                    event.whatsapp,
                    `Olá, vi o evento ${event.title} no Ipueiras+`,
                  ),
                )
              }
            >
              <ActionButton label="WhatsApp" tone="green" />
            </CooldownPressable>
          ) : null}
        </Box>
      </ScrollView>

      <ShareStoryCard
        ref={storyRef}
        type="event"
        title={event.title}
        description={event.description}
        imageUrl={event.coverUrl}
      />
    </Screen>
  );
}

function HeaderButton({
  icon,
  onPress,
  left,
}: {
  icon: "arrow-left";
  onPress: () => void;
  left?: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{ position: "absolute", top: 20, left }}
    >
      <Box
        width={40}
        height={40}
        borderRadius="pill"
        backgroundColor="surface"
        alignItems="center"
        justifyContent="center"
      >
        <Feather name={icon} size={21} color="#FFFFFF" />
      </Box>
    </Pressable>
  );
}

function InfoRow({
  icon,
  text,
}: {
  icon: "calendar" | "clock" | "map-pin" | "dollar-sign";
  text: string;
}) {
  return (
    <Box flexDirection="row" alignItems="center" gap="sm">
      <Feather name={icon} size={17} color="#FFFFFF" />
      <Text variant="body" flex={1}>
        {text}
      </Text>
    </Box>
  );
}

function ActionButton({
  label,
  tone,
}: {
  label: string;
  tone: "primary" | "green";
}) {
  return (
    <Box
      backgroundColor={tone}
      borderRadius="md"
      padding="md"
      alignItems="center"
    >
      <Text fontWeight="800">{label}</Text>
    </Box>
  );
}
