import Feather from "@expo/vector-icons/Feather";
import type { Alert } from "@/domains/alert/Alert";
import { Box } from "../components/Box";
import { Text } from "../components/Text";
import { formatDate } from "../utils/format";

type AlertCardProps = {
  alert: Alert;
};

function tone(importance: Alert["importance"]) {
  if (importance === "urgent") return "danger";
  if (importance === "important") return "primary";
  return "blue";
}

export function AlertCard({ alert }: AlertCardProps) {
  const color = tone(alert.importance);

  return (
    <Box
      flexDirection="row"
      gap="md"
      padding="md"
      marginBottom="sm"
      backgroundColor="card"
      borderRadius="lg"
      borderWidth={1}
      borderColor="border"
    >
      <Box
        width={52}
        height={52}
        borderRadius="pill"
        backgroundColor={color}
        alignItems="center"
        justifyContent="center"
      >
        <Feather name="volume-2" size={22} color="#FFFFFF" />
      </Box>

      <Box flex={1} justifyContent="center" gap="xs">
        <Text variant="cardTitle" numberOfLines={1}>
          {alert.title}
        </Text>
        {alert.summary ? (
          <Text variant="caption" numberOfLines={2}>
            {alert.summary}
          </Text>
        ) : null}
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text variant="caption">{formatDate(alert.publishedAt)}</Text>
          <Text variant="caption" color="primary" fontWeight="700">
            Ver mais
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
