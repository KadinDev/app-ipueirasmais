import { Box } from "./Box";
import { Text } from "./Text";

type BadgeProps = {
  label: string;
  tone?: "primary" | "purple" | "green" | "blue" | "danger";
};

export function Badge({ label, tone = "primary" }: BadgeProps) {
  const backgroundColor =
    tone === "danger"
      ? "danger"
      : tone === "green"
      ? "green"
      : tone === "blue"
        ? "blue"
        : tone === "purple"
          ? "purple"
          : "primary";

  return (
    <Box
      backgroundColor={backgroundColor}
      borderRadius="pill"
      paddingHorizontal="sm"
      paddingVertical="xs"
    >
      <Text variant="badge">{label}</Text>
    </Box>
  );
}
