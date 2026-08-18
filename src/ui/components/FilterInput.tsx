import Feather from "@expo/vector-icons/Feather";
import { TextInput } from "react-native";
import { Box } from "./Box";

type FilterInputProps = {
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
};

export function FilterInput({ value, placeholder, onChangeText }: FilterInputProps) {
  return (
    <Box
      height={44}
      borderRadius="pill"
      backgroundColor="surfaceAlt"
      borderColor="border"
      borderWidth={1}
      flexDirection="row"
      alignItems="center"
      paddingHorizontal="md"
      gap="sm"
    >
      <Feather name="search" size={16} color="#B7A8C8" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8F7FA3"
        style={{ flex: 1, color: "#FFFFFF", fontSize: 13, padding: 0 }}
      />
    </Box>
  );
}
