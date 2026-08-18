import type { EventPreviewHome } from "@/domains/event/Event";
import { formatDate, formatTime } from "../utils/format";
import { Badge } from "../components/Badge";
import { Box } from "../components/Box";
import { RemoteImage } from "../components/RemoteImage";
import { Text } from "../components/Text";

type EventCardProps = {
  event: EventPreviewHome;
  compact?: boolean;
  featuredLayout?: boolean;
};

export function EventCard({ event, compact, featuredLayout }: EventCardProps) {
  if (compact) {
    return (
      <Box
        width={156}
        height={168}
        padding="sm"
        marginRight="sm"
        backgroundColor="card"
        borderRadius="lg"
        borderWidth={1}
        borderColor={event.isFeatured ? "primary" : "border"}
      >
        <RemoteImage uri={event.coverUrl} height={92} />

        {event.isFeatured ? (
          <Box position="absolute" top={5} right={5}>
            <Badge label="DESTAQUE" />
          </Box>
        ) : null}

        <Box marginTop="sm" alignItems="center">
          <Text
            variant="badge"
            numberOfLines={2}
            style={{ textAlign: "center" }}
          >
            {event.title}
          </Text>

          <Text variant="caption" numberOfLines={1} style={{ marginTop: 5 }}>
            {formatDate(event.startsAt)} - {formatTime(event.startsAt)}H
          </Text>
        </Box>
      </Box>
    );
  }

  if (featuredLayout) {
    return (
      <Box
        marginBottom="md"
        backgroundColor="card"
        borderRadius="lg"
        overflow="hidden"
        borderWidth={1}
        borderColor={event.isFeatured ? "primary" : "border"}
      >
        <RemoteImage uri={event.coverUrl} height={104} radius="none" />
        <Box padding="md" gap="sm">
          <Box flexDirection="row" alignItems="center" gap="sm">
            <Box flex={1}>
              <Text variant="cardTitle" numberOfLines={1}>
                {event.title}
              </Text>
              <Text variant="caption" numberOfLines={1}>
                {formatDate(event.startsAt)} - {formatTime(event.startsAt)}
              </Text>
              <Text variant="caption" numberOfLines={1}>
                {event.venueName || event.neighborhood || "Local a definir"}
              </Text>
            </Box>
            {event.isFeatured ? <Badge label="DESTAQUE" /> : null}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      flexDirection="row"
      gap="sm"
      padding="sm"
      marginBottom="sm"
      backgroundColor="card"
      borderRadius="lg"
      borderWidth={1}
      borderColor={event.isFeatured ? "primary" : "border"}
    >
      <Box width={86}>
        <RemoteImage uri={event.coverUrl} height={70} />
      </Box>
      <Box flex={1} justifyContent="center" gap="xs">
        <Text variant="cardTitle" numberOfLines={1}>
          {event.title}
        </Text>
        <Text variant="caption" numberOfLines={1}>
          {formatDate(event.startsAt)} - {formatTime(event.startsAt)}
        </Text>
        <Text variant="caption" numberOfLines={1}>
          {event.venueName || event.neighborhood || "Local a definir"}
        </Text>
      </Box>
      {event.isFeatured ? (
        <Box alignSelf="center">
          <Badge label="DESTAQUE" />
        </Box>
      ) : null}
    </Box>
  );
}
