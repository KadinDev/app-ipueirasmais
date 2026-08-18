import type { CityUpdateCardPreview } from "@/domains/cityUpdate/CityUpdate";
import { Box } from "../components/Box";
import { RemoteImage } from "../components/RemoteImage";
import { Text } from "../components/Text";
import { formatDate } from "../utils/format";

type CityUpdateCardProps = {
  update: CityUpdateCardPreview;
};

export function CityUpdateCard({ update }: CityUpdateCardProps) {
  return (
    <Box
      flexDirection="row"
      gap="sm"
      padding="sm"
      marginBottom="sm"
      backgroundColor="card"
      borderRadius="lg"
      borderWidth={1}
      borderColor="border"
    >
      <Box width={84}>
        <RemoteImage
          uri={update.imageUrl}
          height={76}
          fallbackSource={require("../../../assets/images/icon.png")}
        />
      </Box>

      <Box flex={1} justifyContent="center" gap="xs">
        <Text variant="cardTitle">{update.title}</Text>
        <Text variant="caption">{update.body} </Text>
        <Text variant="caption">{formatDate(update.publishedAt)}</Text>
      </Box>
    </Box>
  );
}
