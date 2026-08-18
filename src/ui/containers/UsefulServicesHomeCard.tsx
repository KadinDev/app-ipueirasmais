import Feather from "@expo/vector-icons/Feather";
import { Pressable } from "react-native";
import { Box } from "@/ui/components/Box";
import { Text } from "@/ui/components/Text";

type UsefulServicesHomeCardProps = {
  onPress: () => void;
  pharmacyDutyCount?: number;
};

export function UsefulServicesHomeCard({
  onPress,
  pharmacyDutyCount = 0,
}: UsefulServicesHomeCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Abrir serviços úteis"
    >
      <Box
        backgroundColor="surface"
        borderRadius="lg"
        borderWidth={1}
        borderColor="border"
        padding="lg"
        flexDirection="row"
        alignItems="center"
        gap="md"
      >
        <Box
          width={52}
          height={52}
          borderRadius="lg"
          backgroundColor="purpleDark"
          alignItems="center"
          justifyContent="center"
        >
          <Feather name="heart" size={25} color="#FF7A00" />
        </Box>

        <Box flex={1}>
          <Text variant="sectionTitle">Serviços úteis</Text>
          <Text variant="caption" marginTop="xs">
            {pharmacyDutyCount > 0
              ? `${pharmacyDutyCount} ${pharmacyDutyCount === 1 ? "farmácia" : "farmácias"} de plantão e telefones importantes`
              : "Farmácia de plantão e telefones importantes"}
          </Text>
        </Box>

        <Feather name="chevron-right" size={23} color="#B7A8C8" />
      </Box>
    </Pressable>
  );
}
