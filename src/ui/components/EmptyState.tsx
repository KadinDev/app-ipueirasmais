import Feather from "@expo/vector-icons/Feather";
import { Box } from "./Box";
import { Text } from "./Text";

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export function EmptyState({
  title = "Nenhum conteúdo por aqui",
  description = "Assim que houver novidades, elas aparecerão nesta tela.",
}: EmptyStateProps) {
  return (
    <Box
      paddingVertical="xxl"
      paddingHorizontal="lg"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        width={52}
        height={52}
        borderRadius="pill"
        backgroundColor="surface"
        alignItems="center"
        justifyContent="center"
        marginBottom="md"
      >
        <Feather name="inbox" size={24} color="#B7A8C8" />
      </Box>

      <Text variant="sectionTitle" textAlign="center">
        {title}
      </Text>

      <Text variant="body" color="textMuted" textAlign="center" marginTop="sm">
        {description}
      </Text>
    </Box>
  );
}
