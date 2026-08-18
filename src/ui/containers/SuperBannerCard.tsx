import { ActivityIndicator, ImageBackground } from "react-native";
import { useEffect, useState } from "react";
import type { BannerPreview } from "@/domains/banner/Banner";
import { Box } from "../components/Box";
import { Text } from "../components/Text";
import { openExternalUrl, whatsappUrl } from "@/ui/utils/links";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CooldownPressable } from "../components/CooldownPressable";

type SuperBannerCardProps = {
  banner: BannerPreview;
};

export function SuperBannerCard({ banner }: SuperBannerCardProps) {
  const [imageLoading, setImageLoading] = useState(Boolean(banner.imageUrl));

  useEffect(() => {
    setImageLoading(Boolean(banner.imageUrl));
  }, [banner.imageUrl]);

  return (
    <Box
      height={184}
      borderRadius="lg"
      overflow="hidden"
      borderWidth={1}
      borderColor="primary"
      backgroundColor="card"
    >
      <ImageBackground
        source={banner.imageUrl ? { uri: banner.imageUrl } : undefined}
        style={{ flex: 1 }}
        onLoadStart={() => setImageLoading(true)}
        onLoadEnd={() => setImageLoading(false)}
        onError={() => setImageLoading(false)}
      >
        {imageLoading ? (
          <Box
            position="absolute"
            top={0}
            right={0}
            bottom={0}
            left={0}
            alignItems="center"
            justifyContent="center"
            backgroundColor="surfaceAlt"
          >
            <ActivityIndicator size="small" color="#FF7A00" />
          </Box>
        ) : null}
        <Box
          flex={1}
          justifyContent="center"
          paddingHorizontal="xl"
          style={{
            backgroundColor: banner.isActiveBackgroundImage
              ? "rgba(0, 0, 0, 0.65)"
              : undefined,
          }}
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            backgroundColor="primary"
            paddingHorizontal="md"
            paddingVertical="xs"
            borderBottomRightRadius="md"
          >
            <Text variant="badge">SUPER DESTAQUE</Text>
          </Box>

          {banner.notes ? (
            <Box
              position="absolute"
              top={0}
              right={0}
              paddingHorizontal="md"
              paddingVertical="sm"
              borderBottomRightRadius="md"
            >
              <Text variant="badge" numberOfLines={1}>
                {banner.notes}
              </Text>
            </Box>
          ) : null}

          <Box marginTop="lg" gap="xs" paddingRight="xl">
            {banner.title ? (
              <Text variant="sectionTitle" numberOfLines={1} fontSize={20}>
                {banner.title}
              </Text>
            ) : null}

            {banner.subtitle ? (
              <Text variant="caption" numberOfLines={3} color="text">
                {banner.subtitle}
              </Text>
            ) : null}
          </Box>

          <Box
            position="absolute"
            bottom={0}
            right={0}
            paddingHorizontal="md"
            paddingVertical="sm"
            borderBottomRightRadius="md"
          >
            {banner.actionLabel ? (
              <CooldownPressable
                onPress={() => {
                  //
                  // Para as métricas no Dashboard
                  /*
                  await trackCLick({
                    cityId: banner.cityId,
                    entityType: "banner",
                    entityId: banner.id,
                    clickType: "whatsapp",
                  });
                  */

                  openExternalUrl(
                    whatsappUrl(
                      banner.actionLabel,
                      `Olá, encontrei ${banner.title} no Ipueiras+`,
                    ),
                  );
                }}
              >
                <ActionButton tone="green" />
              </CooldownPressable>
            ) : null}
          </Box>
        </Box>
      </ImageBackground>
    </Box>
  );
}

function ActionButton({ tone }: { tone: "primary" | "green" }) {
  return (
    <Box
      backgroundColor={tone}
      borderRadius="pill"
      padding="sm"
      alignItems="center"
    >
      <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
    </Box>
  );
}
