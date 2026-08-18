import Feather from "@expo/vector-icons/Feather";
import { Pressable } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";

type OfflineStateProps = {
  onRetry: () => void | Promise<unknown>;
  onBack?: () => void;
};

export function OfflineState({ onRetry, onBack }: OfflineStateProps) {
  return (
    <Box flex={1} minHeight={320} padding="lg">
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={12}
          onPress={onBack}
        >
          <Box
            width={40}
            height={40}
            borderRadius="pill"
            backgroundColor="surface"
            alignItems="center"
            justifyContent="center"
          >
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </Box>
        </Pressable>
      ) : null}

      <Box flex={1} alignItems="center" justifyContent="center" gap="md">
        <Box
          width={72}
          height={72}
          borderRadius="pill"
          backgroundColor="surfaceAlt"
          alignItems="center"
          justifyContent="center"
        >
          <Feather name="wifi-off" size={32} color="#FF7A00" />
        </Box>

        <Box maxWidth={320} alignItems="center" gap="sm">
          <Text variant="sectionTitle" textAlign="center">
            Sem conexão com a internet
          </Text>
          <Text variant="body" textAlign="center">
            Conecte-se para carregar este conteúdo pela primeira vez.
          </Text>
        </Box>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tentar carregar o conteúdo novamente"
          onPress={() => void onRetry()}
        >
          {({ pressed }) => (
            <Box
              minWidth={172}
              minHeight={48}
              paddingHorizontal="xl"
              paddingVertical="md"
              borderRadius="md"
              backgroundColor="primary"
              alignItems="center"
              justifyContent="center"
              opacity={pressed ? 0.8 : 1}
            >
              <Text fontWeight="800">Tentar novamente</Text>
            </Box>
          )}
        </Pressable>
      </Box>
    </Box>
  );
}
