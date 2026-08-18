import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, Pressable, ScrollView } from "react-native";
import type { Company } from "@/domains/company/Company";
import { useCompanyDetails } from "@/domains/company/operations/useCompanyDetails";
import { Badge } from "@/ui/components/Badge";
import { Box } from "@/ui/components/Box";
import { CooldownPressable } from "@/ui/components/CooldownPressable";
import { MapPreview } from "@/ui/components/MapPreview";
import { OfflineState } from "@/ui/components/OfflineState";
import { RemoteImage } from "@/ui/components/RemoteImage";
import { Screen } from "@/ui/components/Screen";
import { Text } from "@/ui/components/Text";
import { formatHour } from "@/ui/utils/format";
import { instagramUrl, openExternalUrl, whatsappUrl } from "@/ui/utils/links";

export default function CompanyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: company,
    loading,
    offlineWithoutCache,
    refetch,
    refreshIfStale,
  } = useCompanyDetails(id);

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

  if (!company) return null;

  const fullAddress = [company.addressLine, company.neighborhood]
    .filter(Boolean)
    .join(" - ");
  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 126 }}
      >
        <Box>
          <RemoteImage
            uri={company.coverUrl || company.logoUrl}
            height={236}
            radius="none"
          />
          <HeaderButton
            icon="arrow-left"
            left={16}
            onPress={() => router.back()}
          />
        </Box>

        <Box padding="lg" gap="lg" marginTop="sm">
          <Box alignItems="center" marginTop="none">
            <Box
              width={110}
              height={110}
              borderRadius="pill"
              overflow="hidden"
              backgroundColor="surfaceAlt"
              style={{ marginTop: -80 }}
            >
              <RemoteImage
                uri={company.logoUrl || company.coverUrl}
                height={110}
                radius="none"
              />
            </Box>
            {company.isFeatured ? (
              <Box marginTop="sm">
                <Badge label="DESTAQUE" />
              </Box>
            ) : null}
            <Text variant="title" textAlign="center" marginTop="sm">
              {company.name}
            </Text>
            {company.categoryName ? (
              <Text variant="body" textAlign="center">
                {company.categoryName}
              </Text>
            ) : null}
            {company.rating != null && (company.ratingCount ?? 0) > 0 ? (
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                gap="xs"
                marginTop="sm"
              >
                <Ionicons name="star" size={17} color="#F59E0B" />
                <Text fontWeight="800">{company.rating.toFixed(1)}</Text>
                <Text variant="caption">
                  ({company.ratingCount}{" "}
                  {company.ratingCount === 1 ? "avaliação" : "avaliações"})
                </Text>
              </Box>
            ) : null}
          </Box>

          <InfoBlock
            title="Sobre"
            text={company.description || "Informações em breve."}
          />

          <InfoBlock
            title="Horário de funcionamento"
            text={formatHours(company)}
          />

          <InfoBlock
            title="Endereço"
            text={fullAddress || "Endereço em breve."}
          />

          <MapPreview
            latitude={company.latitude}
            longitude={company.longitude}
            address={fullAddress}
            mapsUrl={company.mapsUrl}
          />

          {company.instagram ? (
            <CooldownPressable
              onPress={() => openExternalUrl(instagramUrl(company.instagram))}
            >
              <ActionButton label="Ver no Instagram" tone="instagram" />
            </CooldownPressable>
          ) : null}

          {company.whatsapp ? (
            <CooldownPressable
              onPress={() =>
                openExternalUrl(
                  whatsappUrl(
                    company.whatsapp,
                    `Olá, encontrei ${company.name} no Ipueiras+`,
                  ),
                )
              }
            >
              <ActionButton label="WhatsApp" tone="green" />
            </CooldownPressable>
          ) : null}
        </Box>
      </ScrollView>
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

function ActionButton({
  label,
  tone,
}: {
  label: string;
  tone: "primary" | "green" | "instagram";
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

function InfoBlock({ title, text }: { title: string; text?: string | null }) {
  return (
    <Box backgroundColor="card" borderRadius="lg" padding="md" gap="xs">
      <Text variant="cardTitle">{title}</Text>
      <Text variant="body">{text || "-"}</Text>
    </Box>
  );
}

function formatHours(company: Company) {
  if (!company.hours?.length) return "Horário em breve.";
  const openDays = company.hours
    .filter((item) => !item.isClosed)
    .map(
      (item) =>
        `${dayLabel(item.dayOfWeek)} ${formatHour(item.opensAt)} às ${formatHour(item.closesAt)}`,
    );
  return openDays.length ? openDays.join("\n") : "Horário em breve.";
}

function dayLabel(day: number) {
  return (
    ["Dom: ", "Seg: ", "Ter:  ", "Qua: ", "Qui:  ", "Sex:  ", "Sab: "][day] ??
    ""
  );
}
