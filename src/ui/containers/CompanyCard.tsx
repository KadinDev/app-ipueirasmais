import type { CompanyPreviewHome } from "@/domains/company/Company";
import { Badge } from "../components/Badge";
import { Box } from "../components/Box";
import { RemoteImage } from "../components/RemoteImage";
import { Text } from "../components/Text";
import { formatWhatsAppFromCompany } from "../utils/format";

type CompanyCardProps = {
  company: CompanyPreviewHome;
  compact?: boolean;
  featuredLayout?: boolean;
};

export function CompanyCard({
  company,
  compact,
  featuredLayout,
}: CompanyCardProps) {
  if (compact) {
    return (
      <Box
        width={100}
        height={128}
        alignItems="center"
        justifyContent="center"
        gap="sm"
        padding="sm"
        marginRight="sm"
        backgroundColor="card"
        borderRadius="lg"
        borderWidth={1}
        borderColor="border"
      >
        <Box width={64} height={64} borderRadius="pill" overflow="hidden">
          <RemoteImage
            uri={company.logoUrl || company.coverUrl}
            height={64}
            radius="none"
          />
        </Box>
        <Text variant="badge" numberOfLines={2} textAlign="center">
          {company.name}
        </Text>
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
        borderColor={company.isFeatured ? "primary" : "border"}
      >
        <RemoteImage
          uri={company.coverUrl || company.logoUrl}
          height={104}
          radius="none"
        />
        <Box padding="md" gap="sm">
          <Box flexDirection="row" alignItems="center" gap="sm">
            <Box
              width={50}
              height={50}
              borderRadius="pill"
              overflow="hidden"
              backgroundColor="surfaceAlt"
            >
              <RemoteImage
                uri={company.logoUrl || company.coverUrl}
                height={50}
                radius="none"
              />
            </Box>
            <Box flex={1}>
              <Text variant="cardTitle" numberOfLines={1}>
                {company.name}
              </Text>
              <Text variant="caption" numberOfLines={2}>
                {company.description || "Informações em breve."}
              </Text>
            </Box>
            {company.isFeatured ? <Badge label="DESTAQUE" /> : null}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      gap="sm"
      padding="md"
      marginBottom="sm"
      backgroundColor="card"
      borderRadius="lg"
      borderWidth={1}
      borderColor="border"
    >
      <Box width={58} height={58} borderRadius="pill" overflow="hidden">
        <RemoteImage
          uri={company.logoUrl || company.coverUrl}
          height={58}
          radius="none"
        />
      </Box>
      <Box flex={1}>
        <Text variant="cardTitle" numberOfLines={1}>
          {company.name}
        </Text>
        <Text variant="caption" numberOfLines={1}>
          {formatWhatsAppFromCompany(company.whatsapp)}
        </Text>
      </Box>
    </Box>
  );
}
