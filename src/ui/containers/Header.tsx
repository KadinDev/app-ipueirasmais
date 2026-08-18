import Feather from "@expo/vector-icons/Feather";
import { Pressable, Animated } from "react-native";
import { Box } from "../components/Box";
import { Text } from "../components/Text";
import { useEffect, useRef } from "react";
import { theme } from "../theme/theme";

type HeaderProps = {
  cityName?: string;
  onPressNotifications?: () => void;
  hasNewNotification?: boolean; // saber se tem nova notificação, para animação do ícone
};

export function Header({
  cityName = "Ipueiras",
  onPressNotifications,
  hasNewNotification = false,
}: HeaderProps) {
  //
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!hasNewNotification) {
      pulse.setValue(1);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.18,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [hasNewNotification, pulse]);

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      paddingHorizontal="lg"
      paddingTop="lg"
    >
      <Text variant="title" fontSize={28} lineHeight={34}>
        {cityName}
        <Text variant="title" color="primary" fontSize={28} lineHeight={34}>
          +
        </Text>
      </Text>
      <Pressable onPress={onPressNotifications} hitSlop={12}>
        <Animated.View style={{ transform: [{ scale: pulse }] }}>
          <Feather
            name="bell"
            size={21}
            color={
              hasNewNotification ? theme.colors.primary : theme.colors.text
            }
          />
        </Animated.View>
      </Pressable>
    </Box>
  );
}
