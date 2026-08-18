import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { Dimensions, Pressable } from "react-native";
import type { HappeningNowSummary } from "@/domains/home/HomePayload";
import { Box } from "../components/Box";
import { Text } from "../components/Text";

type HappeningNowGridProps = {
  summary: HappeningNowSummary;
};

const items = [
  {
    key: "promotions",
    title: "Promoções",
    description: "Aproveite as melhores ofertas",
    icon: "tag",
    color: "primary",
    route: "/promotions",
    countKey: "promotionsCount",
    suffix: "novas",
  },
  {
    key: "todayEvents",
    title: "Eventos Hoje",
    description: "Confira os eventos de hoje",
    icon: "zap",
    color: "purple",
    route: "/events",
    countKey: "todayEventsCount",
    suffix: "eventos",
  },
  {
    key: "jobs",
    title: "Vagas",
    description: "Oportunidades de trabalho",
    icon: "briefcase",
    color: "blue",
    route: "/jobs",
    countKey: "jobsCount",
    suffix: "novas",
  },
  {
    key: "alerts",
    title: "Avisos",
    description: "Fique por dentro dos comunicados",
    icon: "volume-2",
    color: "danger",
    route: "/alerts",
    countKey: "alertsCount",
    suffix: "novo aviso",
  },
  {
    key: "updates",
    title: "Novidades",
    description: "Novidades da cidade para você",
    icon: "sun",
    color: "warning",
    route: "/city-updates",
    countKey: "updatesCount",
    suffix: "atualizações",
  },
] as const;

export function HappeningNowGrid({ summary }: HappeningNowGridProps) {
  const gap = 8;
  const horizontalPadding = 32;
  const cardWidth =
    (Dimensions.get("window").width - horizontalPadding - gap * 2) / 3;

  return (
    <Box paddingHorizontal="lg" marginTop="sm">
      <Box flexDirection="row" alignItems="center" gap="sm" marginBottom="md">
        <Feather name="zap" size={17} color="#FF7A00" />
        <Text variant="sectionTitle">Acontecendo Agora</Text>
      </Box>

      <Box flexDirection="row" flexWrap="wrap" gap="sm">
        {items.map((item) => {
          const count = summary[item.countKey] ?? 0;

          return (
            <Pressable
              key={item.key}
              onPress={() => router.push(item.route as any)}
              style={{ width: cardWidth }}
            >
              <Box
                height={116}
                backgroundColor="card"
                borderRadius="lg"
                borderWidth={1}
                borderColor="border"
                padding="sm"
                gap="xs"
              >
                <Box
                  width={34}
                  height={34}
                  borderRadius="md"
                  backgroundColor={item.color}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Feather name={item.icon} size={18} color="#FFFFFF" />
                </Box>

                <Box>
                  <Text variant="badge" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text variant="badge" color={item.color} numberOfLines={1}>
                    {count} {item.suffix}
                  </Text>
                </Box>

                <Text variant="caption" numberOfLines={2} fontSize={10}>
                  {item.description}
                </Text>
              </Box>
            </Pressable>
          );
        })}
      </Box>
    </Box>
  );
}
