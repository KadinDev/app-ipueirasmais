import Feather from "@expo/vector-icons/Feather";
import { Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Box } from "./Box";
import { CooldownPressable } from "./CooldownPressable";
import { Text } from "./Text";
import { mapUrl, openExternalUrl } from "../utils/links";

type MapPreviewProps = {
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  mapsUrl?: string | null;
};

const LATITUDE_DELTA = 0.008;
const LONGITUDE_DELTA = 0.008;

export function MapPreview({
  latitude,
  longitude,
  address,
  mapsUrl,
}: MapPreviewProps) {
  const hasCoords = latitude != null && longitude != null;
  const directionsUrl = mapUrl({ latitude, longitude, address, mapsUrl });

  return (
    <Box gap="sm">
      <Box
        height={200}
        borderRadius="lg"
        overflow="hidden"
        backgroundColor="surfaceAlt"
        borderColor="border"
        borderWidth={1}
      >
        {hasCoords && Platform.OS !== "web" ? (
          <MapView
            style={{ width: "100%", height: "100%" }}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            toolbarEnabled={false}
            showsCompass={false}
            showsMyLocationButton={false}
          >
            <Marker
              coordinate={{ latitude, longitude }}
              title={address || "Localização"}
              pinColor="#FF7A00"
            />
          </MapView>
        ) : (
          <Box flex={1} justifyContent="center" padding="lg" gap="sm">
            <Box
              width={46}
              height={46}
              borderRadius="pill"
              backgroundColor="card"
              alignItems="center"
              justifyContent="center"
            >
              <Feather name="map-pin" size={22} color="#FF7A00" />
            </Box>
            <Text variant="cardTitle">Localização</Text>
            <Text variant="caption" numberOfLines={2}>
              {address || "Localização em breve."}
            </Text>
          </Box>
        )}
      </Box>

      {directionsUrl ? (
        <CooldownPressable onPress={() => openExternalUrl(directionsUrl)}>
          <Box
            minHeight={44}
            borderRadius="md"
            backgroundColor="surfaceAlt"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap="sm"
            padding="sm"
          >
            <Feather name="navigation" size={17} color="#FF7A00" />
            <Text color="primary" fontWeight="800">
              Como chegar
            </Text>
          </Box>
        </CooldownPressable>
      ) : null}
    </Box>
  );
}
