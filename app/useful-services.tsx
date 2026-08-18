import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo } from "react";
import { ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import type { PharmacyDuty } from "@/domains/usefulService/PharmacyDuty";
import type {
  UsefulService,
  UsefulServiceType,
} from "@/domains/usefulService/UsefulService";
import { usePharmacyDuty } from "@/domains/usefulService/operations/usePharmacyDuty";
import { useUsefulServices } from "@/domains/usefulService/operations/useUsefulServices";
import { Box } from "@/ui/components/Box";
import { CooldownPressable } from "@/ui/components/CooldownPressable";
import { OfflineState } from "@/ui/components/OfflineState";
import { RemoteImage } from "@/ui/components/RemoteImage";
import { Screen } from "@/ui/components/Screen";
import { ScreenHeader } from "@/ui/components/ScreenHeader";
import { Text } from "@/ui/components/Text";
import { mapUrl, openExternalUrl, whatsappUrl } from "@/ui/utils/links";

const SERVICE_ICONS: Record<UsefulServiceType, keyof typeof Feather.glyphMap> =
  {
    pharmacy: "plus-square",
    hospital: "heart",
    samu: "activity",
    police: "shield",
    firefighters: "alert-triangle",
    city_hall: "home",
    enel: "zap",
    cagece: "droplet",
    other: "phone",
  };

function phoneUrl(value?: string | null) {
  if (!value) return null;
  const number = value.replace(/[^\d+]/g, "");
  return number ? `tel:${number}` : null;
}

function formatDutyPeriod(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const date = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (start.toDateString() === end.toDateString()) {
    return `${date.format(start)}, das ${time.format(start)} às ${time.format(end)}`;
  }

  return `${date.format(start)} às ${time.format(start)} até ${date.format(end)} às ${time.format(end)}`;
}

function dutyStatus(item: PharmacyDuty) {
  const now = Date.now();
  const startsAt = new Date(item.startsAt).getTime();
  const endsAt = new Date(item.endsAt).getTime();
  if (now < startsAt) return { open: false, label: "PRÓXIMO PLANTÃO" };
  if (now <= endsAt) return { open: true, label: "ABERTA AGORA" };
  return { open: false, label: "PLANTÃO ENCERRADO" };
}

export default function UsefulServicesScreen() {
  const pharmacy = usePharmacyDuty();
  const services = useUsefulServices();
  const refreshPharmacyIfStale = pharmacy.refreshIfStale;
  const refreshServicesIfStale = services.refreshIfStale;
  const refetchPharmacy = pharmacy.refetch;
  const refetchServices = services.refetch;

  const orderedPharmacies = useMemo(
    () =>
      [...(pharmacy.data ?? [])].sort(
        (a, b) => a.manualPriority - b.manualPriority,
      ),
    [pharmacy.data],
  );
  const orderedServices = useMemo(
    () =>
      [...(services.data ?? [])]
        .filter((item) => item.serviceType !== "pharmacy")
        .sort((a, b) => a.manualPriority - b.manualPriority),
    [services.data],
  );

  const refreshIfStale = useCallback(() => {
    void Promise.all([refreshPharmacyIfStale(), refreshServicesIfStale()]);
  }, [refreshPharmacyIfStale, refreshServicesIfStale]);

  useFocusEffect(refreshIfStale);

  const retry = useCallback(() => {
    void Promise.all([refetchPharmacy(), refetchServices()]);
  }, [refetchPharmacy, refetchServices]);

  const loading = pharmacy.loading || services.loading;
  const refreshing = pharmacy.refreshing || services.refreshing;
  const offlineWithoutCache =
    pharmacy.offlineWithoutCache && services.offlineWithoutCache;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 124 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={retry}
            tintColor="#FF7A00"
            colors={["#FF7A00"]}
          />
        }
      >
        <ScreenHeader
          title="Serviços úteis"
          subtitle="Informações importantes para o seu dia a dia."
        />

        {offlineWithoutCache ? (
          <Box marginTop="xxl">
            <OfflineState onRetry={retry} />
          </Box>
        ) : loading ? (
          <Box height={260} alignItems="center" justifyContent="center">
            <ActivityIndicator color="#FF7A00" />
          </Box>
        ) : (
          <>
            <SectionTitle icon="plus-square" title="Farmácia de plantão" />
            {orderedPharmacies.length ? (
              orderedPharmacies.map((item) => (
                <PharmacyDutyCard key={item.shiftId} item={item} />
              ))
            ) : (
              <EmptyCard text="Nenhuma farmácia de plantão informada agora." />
            )}

            <SectionTitle icon="phone-call" title="Telefones úteis" />
            {orderedServices.length ? (
              orderedServices.map((item) => (
                <UsefulServiceCard key={item.id} item={item} />
              ))
            ) : (
              <EmptyCard text="Nenhum telefone útil cadastrado." />
            )}

            {pharmacy.error || services.error ? (
              <Text variant="caption" textAlign="center" marginTop="lg">
                Algumas informações podem não ter sido atualizadas. Puxe a tela
                para tentar novamente.
              </Text>
            ) : null}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
}) {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      gap="sm"
      marginTop="xxl"
      marginBottom="md"
    >
      <Feather name={icon} size={21} color="#FF7A00" />
      <Text variant="sectionTitle">{title}</Text>
    </Box>
  );
}

function PharmacyDutyCard({ item }: { item: PharmacyDuty }) {
  const address = [item.addressLine, item.neighborhood]
    .filter(Boolean)
    .join(" — ");
  const location = mapUrl({
    latitude: item.latitude,
    longitude: item.longitude,
    address,
  });
  const whatsapp = whatsappUrl(item.whatsapp);
  const phone = phoneUrl(item.phone);
  const status = dutyStatus(item);
  const period = formatDutyPeriod(item.startsAt, item.endsAt);

  return (
    <Box
      backgroundColor="surface"
      borderRadius="lg"
      borderWidth={1}
      borderColor="border"
      padding="lg"
      marginBottom="md"
    >
      <Box flexDirection="row" gap="md" alignItems="center">
        {item.logoUrl ? (
          <Box width={62}>
            <RemoteImage uri={item.logoUrl} height={62} radius="lg" />
          </Box>
        ) : (
          <Box
            width={62}
            height={62}
            borderRadius="lg"
            backgroundColor="purpleDark"
            alignItems="center"
            justifyContent="center"
          >
            <Feather name="plus" size={30} color="#FF7A00" />
          </Box>
        )}
        <Box flex={1}>
          <Text variant="sectionTitle">{item.name}</Text>
          <Box
            alignSelf="flex-start"
            backgroundColor={status.open ? "green" : "purpleDark"}
            borderRadius="pill"
            paddingHorizontal="sm"
            paddingVertical="xs"
            marginTop="sm"
          >
            <Text variant="badge">{status.label}</Text>
          </Box>
        </Box>
      </Box>

      {period ? <InfoLine icon="clock" text={period} /> : null}
      {address ? <InfoLine icon="map-pin" text={address} /> : null}
      {item.phone ? <InfoLine icon="phone" text={item.phone} /> : null}
      {item.note ? <InfoLine icon="info" text={item.note} /> : null}

      <Box flexDirection="row" flexWrap="wrap" gap="sm" marginTop="lg">
        {whatsapp ? (
          <ActionButton
            icon="message-circle"
            label="WhatsApp"
            color="#22C55E"
            onPress={() => void openExternalUrl(whatsapp)}
          />
        ) : null}
        {phone ? (
          <ActionButton
            icon="phone"
            label="Ligar"
            color="#FFFFFF"
            onPress={() => void openExternalUrl(phone)}
          />
        ) : null}
        {location ? (
          <ActionButton
            icon="map-pin"
            label="Localização"
            color="#B879FF"
            onPress={() => void openExternalUrl(location)}
          />
        ) : null}
      </Box>
    </Box>
  );
}

function UsefulServiceCard({ item }: { item: UsefulService }) {
  const phone = phoneUrl(item.phone);
  const whatsapp = whatsappUrl(item.whatsapp);
  const location = mapUrl({
    latitude: item.latitude,
    longitude: item.longitude,
    address: item.addressLine,
  });

  return (
    <Box
      backgroundColor="surface"
      borderRadius="lg"
      borderWidth={1}
      borderColor="border"
      padding="md"
      marginBottom="sm"
    >
      <Box flexDirection="row" alignItems="center" gap="md">
        <Box
          width={44}
          height={44}
          borderRadius="lg"
          backgroundColor="purpleDark"
          alignItems="center"
          justifyContent="center"
        >
          <Feather
            name={SERVICE_ICONS[item.serviceType]}
            size={21}
            color="#FF7A00"
          />
        </Box>
        <Box flex={1}>
          <Text variant="cardTitle">{item.name}</Text>
          {item.phone ? <Text variant="body">{item.phone}</Text> : null}
          {item.note ? (
            <Text variant="caption" marginTop="xs">
              {item.note}
            </Text>
          ) : null}
          {item.addressLine ? (
            <Text variant="caption" marginTop="xs">
              {item.addressLine}
            </Text>
          ) : null}
        </Box>
        {phone ? (
          <CooldownPressable
            accessibilityRole="button"
            accessibilityLabel={`Ligar para ${item.name}`}
            hitSlop={10}
            onPress={() => void openExternalUrl(phone)}
          >
            <Box
              width={42}
              height={42}
              borderRadius="pill"
              backgroundColor="surfaceAlt"
              alignItems="center"
              justifyContent="center"
            >
              <Feather name="phone" size={20} color="#B879FF" />
            </Box>
          </CooldownPressable>
        ) : null}
      </Box>
      {whatsapp || location ? (
        <Box flexDirection="row" flexWrap="wrap" gap="sm" marginTop="md">
          {whatsapp ? (
            <ActionButton
              icon="message-circle"
              label="WhatsApp"
              color="#22C55E"
              onPress={() => void openExternalUrl(whatsapp)}
            />
          ) : null}
          {location ? (
            <ActionButton
              icon="map-pin"
              label="Localização"
              color="#B879FF"
              onPress={() => void openExternalUrl(location)}
            />
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
}

function InfoLine({
  icon,
  text,
}: {
  icon: keyof typeof Feather.glyphMap;
  text: string;
}) {
  return (
    <Box flexDirection="row" gap="sm" alignItems="flex-start" marginTop="md">
      <Feather name={icon} size={17} color="#B879FF" />
      <Text variant="body" flex={1}>
        {text}
      </Text>
    </Box>
  );
}

function ActionButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <CooldownPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
    >
      <Box
        minHeight={42}
        borderRadius="md"
        borderWidth={1}
        borderColor="border"
        paddingHorizontal="md"
        flexDirection="row"
        alignItems="center"
        gap="sm"
      >
        <Feather name={icon} size={18} color={color} />
        <Text variant="cardTitle">{label}</Text>
      </Box>
    </CooldownPressable>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <Box
      backgroundColor="surface"
      borderRadius="lg"
      padding="lg"
      borderWidth={1}
      borderColor="border"
    >
      <Text variant="body" textAlign="center">
        {text}
      </Text>
    </Box>
  );
}
