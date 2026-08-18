import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "./Box";

export function Screen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: "#0B0714" }}
    >
      <Box flex={1} backgroundColor="background">
        {children}
      </Box>
    </SafeAreaView>
  );
}
