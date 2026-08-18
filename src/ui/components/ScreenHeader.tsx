import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { Pressable } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
};

export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <Box flexDirection="row" alignItems="center" gap="md">
      <Pressable onPress={() => router.back()} hitSlop={12}>
        <Box
          width={38}
          height={38}
          borderRadius="pill"
          backgroundColor="surface"
          alignItems="center"
          justifyContent="center"
        >
          <Feather name="arrow-left" size={21} color="#FFFFFF" />
        </Box>
      </Pressable>

      <Box flex={1}>
        <Text variant="title" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </Box>
    </Box>
  );
}
