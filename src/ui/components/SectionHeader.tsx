import { Pressable } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export function SectionHeader({
  title,
  actionLabel,
  onPressAction,
}: SectionHeaderProps) {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      marginBottom="md"
    >
      <Text variant="sectionTitle">{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onPressAction}>
          <Text color="primary" fontSize={12} fontWeight="700">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </Box>
  );
}
