import Feather from "@expo/vector-icons/Feather";
import { Image, type ImageProps } from "expo-image";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Box } from "./Box";

type RemoteImageProps = {
  uri?: string | null;
  height?: number;
  radius?: "none" | "sm" | "md" | "lg";
  fallbackSource?: ImageProps["source"];
};

export function RemoteImage({
  uri,
  height = 120,
  radius = "md",
  fallbackSource,
}: RemoteImageProps) {
  const [failed, setFailed] = useState(false);
  const source = !failed && uri ? { uri } : fallbackSource;
  const [loading, setLoading] = useState(Boolean(source));

  useEffect(() => {
    setFailed(false);
    setLoading(Boolean(uri || fallbackSource));
  }, [fallbackSource, uri]);

  return (
    <Box
      height={height}
      borderRadius={radius === "none" ? undefined : radius}
      overflow="hidden"
      backgroundColor="surfaceAlt"
    >
      {source ? (
        <Image
          source={source}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={180}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          onError={() => {
            setFailed(true);
            setLoading(Boolean(fallbackSource));
          }}
        />
      ) : (
        <Box flex={1} alignItems="center" justifyContent="center">
          <Feather name="image" size={22} color="#776987" />
        </Box>
      )}

      {loading ? (
        <Box
          style={StyleSheet.absoluteFill}
          alignItems="center"
          justifyContent="center"
          backgroundColor="surfaceAlt"
        >
          <ActivityIndicator size="small" color="#FF7A00" />
        </Box>
      ) : null}
    </Box>
  );
}
