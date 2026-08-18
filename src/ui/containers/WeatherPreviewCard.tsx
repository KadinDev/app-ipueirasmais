import Ionicons from "@expo/vector-icons/Ionicons";
import { useWeather } from "@/domains/weather/operations/useWeather";
import { Box } from "../components/Box";
import { Text } from "../components/Text";

export function WeatherPreviewCard() {
  const { data: weather } = useWeather();
  const now = new Date();
  const currentDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(now);
  const greeting = greetingFromHour(now.getHours());
  const temperature = weather?.temperatureC ?? 31;
  const description = weather?.description ?? "Poucas nuvens";
  const iconName = weather?.iconName ?? "partly-sunny";

  return (
    <Box paddingHorizontal="lg" marginTop="sm">
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="card"
        borderRadius="lg"
        paddingHorizontal="md"
        paddingVertical="sm"
        marginTop="sm"
      >
        <Box flex={1} paddingRight="md">
          <Text variant="cardTitle" numberOfLines={1}>
            {greeting}, Ipueiras!
          </Text>
          <Text variant="caption" numberOfLines={1}>
            {currentDate}
          </Text>
        </Box>

        <Box flexDirection="row" alignItems="center" gap="sm">
          <Box alignItems="flex-end">
            <Box flexDirection="row" alignItems="center">
              <Ionicons name={iconName} size={20} color="#FACC15" />

              <Text variant="sectionTitle" numberOfLines={1} marginLeft="sm">
                {temperature}°C
              </Text>
            </Box>

            <Text variant="caption" numberOfLines={1}>
              {description}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function greetingFromHour(hour: number) {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}
