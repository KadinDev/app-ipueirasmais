import { Pressable, ScrollView } from "react-native";
import type { Category } from "@/domains/category/Category";
import { Box } from "./Box";
import { Text } from "./Text";

type CategoryChipsProps = {
  categories: Category[];
  selectedSlug?: string | null;
  onSelect: (slug: string | null) => void;
};

export function CategoryChips({
  categories,
  selectedSlug,
  onSelect,
}: CategoryChipsProps) {
  const chips = [{ id: "all", name: "Todos", slug: null }, ...categories];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {chips.map((category) => {
        const selected = category.slug === selectedSlug;
        return (
          <Pressable key={category.id} onPress={() => onSelect(category.slug)}>
            <Box
              backgroundColor={selected ? "primary" : "surfaceAlt"}
              borderColor={selected ? "primary" : "border"}
              borderWidth={1}
              borderRadius="pill"
              paddingHorizontal="md"
              paddingVertical="sm"
            >
              <Text
                variant="badge"
                color={selected ? "text" : "textSoft"}
                numberOfLines={1}
              >
                {category.name}
              </Text>
            </Box>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
