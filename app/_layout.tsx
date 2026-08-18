import { ThemeProvider } from "@shopify/restyle";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryProvider } from "@/infra/query/QueryProvider";
import { RepositoryProvider } from "@/repositories/RepositoryProvider";
import { theme } from "@/ui/theme/theme";
import { AppUpdateGate } from "@/ui/containers/AppUpdateGate";

void SplashScreen.preventAutoHideAsync();

if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("../ReactotronConfig");
}

export default function RootLayout() {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
          <QueryProvider>
            <RepositoryProvider>
              <StatusBar
                style="light"
                translucent
                backgroundColor="transparent"
              />
              <Stack
                screenOptions={{
                  headerShown: false,
                  fullScreenGestureEnabled: true,
                  contentStyle: { backgroundColor: theme.colors.background },
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="company-details/[id]" />
                <Stack.Screen name="event-details/[id]" />
                <Stack.Screen name="news-details/[id]" />
                <Stack.Screen name="+not-found" />
                <Stack.Screen name="alert-details/[id]" />
                <Stack.Screen name="useful-services" />
              </Stack>
              <AppUpdateGate />
              <Toast />
            </RepositoryProvider>
          </QueryProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
