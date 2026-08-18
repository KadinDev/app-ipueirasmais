import Feather from "@expo/vector-icons/Feather";
import type { PromotionCardPreview } from "@/domains/promotion/Promotion";
import { Box } from "../components/Box";
import { RemoteImage } from "../components/RemoteImage";
import { Text } from "../components/Text";

type PromotionCardProps = {
  promotion: PromotionCardPreview;
};

export function PromotionCard({ promotion }: PromotionCardProps) {
  return (
    <Box
      flexDirection="row"
      gap="sm"
      padding="sm"
      marginBottom="sm"
      backgroundColor="card"
      borderRadius="lg"
      borderWidth={1}
      borderColor={promotion.companyIsFeatured ? "primary" : "border"}
    >
      <Box width={94}>
        <RemoteImage uri={promotion.imageUrl} height={82} />
      </Box>

      <Box flex={1} justifyContent="center" gap="xs">
        <Box flexDirection="row" gap="xs" alignItems="center">
          <Text variant="cardTitle" numberOfLines={2} flex={1}>
            {promotion.title}
          </Text>
          {promotion.companyIsFeatured ? (
            <Feather name="star" size={14} color="#FF7A00" />
          ) : null}
        </Box>

        {promotion.companyName ? (
          <Text variant="caption" numberOfLines={1}>
            {promotion.companyName}
          </Text>
        ) : null}

        <Text variant="badge" color="primary" numberOfLines={1}>
          {promotion.priceLabel ||
            (promotion.newPriceCents
              ? `por R$ ${(promotion.newPriceCents / 100).toFixed(2).replace(".", ",")}`
              : "Oferta disponível")}
        </Text>

        {promotion.description ? (
          <Text variant="caption">{promotion.description}</Text>
        ) : null}
      </Box>
    </Box>
  );
}
