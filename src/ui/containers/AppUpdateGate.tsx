import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "@expo/vector-icons/Feather";
import * as Application from "expo-application";
import Constants from "expo-constants";
import { useEffect, useMemo, useState } from "react";
import { Modal, Platform, Pressable } from "react-native";
import { useAppVersionConfig } from "@/domains/appVersion/operations/useAppVersionConfig";
import { getUpdateStatus } from "@/domains/appVersion/versionPolicy";
import { Box } from "@/ui/components/Box";
import { CooldownPressable } from "@/ui/components/CooldownPressable";
import { Text } from "@/ui/components/Text";
import { openExternalUrl } from "@/ui/utils/links";

const DISMISSED_UPDATE_KEY = "@ipueiras:dismissed_update_version";

export function AppUpdateGate() {
  if (Platform.OS !== "android" && Platform.OS !== "ios") return null;
  return <NativeAppUpdateGate platform={Platform.OS} />;
}

function NativeAppUpdateGate({ platform }: { platform: "android" | "ios" }) {
  const { data } = useAppVersionConfig(platform);
  const [dismissalChecked, setDismissalChecked] = useState(false);
  const [dismissedVersion, setDismissedVersion] = useState<string | null>(null);
  const installedVersion =
    (__DEV__ ? Constants.expoConfig?.version : null) ??
    Application.nativeApplicationVersion ??
    Constants.expoConfig?.version ??
    "0.0.0";

  const updateUrl =
    platform === "ios" ? data?.iosUrl ?? null : data?.androidUrl ?? null;
  const validUpdateUrl =
    updateUrl && /^https?:\/\//i.test(updateUrl) ? updateUrl : null;
  const status = useMemo(
    () => (data ? getUpdateStatus(installedVersion, data) : "none"),
    [data, installedVersion],
  );

  useEffect(() => {
    let active = true;
    setDismissalChecked(false);

    void AsyncStorage.getItem(DISMISSED_UPDATE_KEY)
      .then((value) => {
        if (active) setDismissedVersion(value);
      })
      .finally(() => {
        if (active) setDismissalChecked(true);
      });

    return () => {
      active = false;
    };
  }, [data?.latestVersion]);

  const required = status === "required" && Boolean(validUpdateUrl);
  const optional =
    status === "optional" &&
    Boolean(validUpdateUrl) &&
    dismissalChecked &&
    dismissedVersion !== data?.latestVersion;
  const visible = required || optional;

  async function dismissOptionalUpdate() {
    if (!data || required) return;
    await AsyncStorage.setItem(DISMISSED_UPDATE_KEY, data.latestVersion);
    setDismissedVersion(data.latestVersion);
  }

  if (!data || !visible) return null;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        if (!required) void dismissOptionalUpdate();
      }}
    >
      <Box
        flex={1}
        backgroundColor="transparent"
        alignItems="center"
        justifyContent="center"
        padding="xl"
        style={{ backgroundColor: "rgba(5, 2, 12, 0.88)" }}
      >
        <Box
          width="100%"
          maxWidth={430}
          backgroundColor="surface"
          borderRadius="lg"
          borderWidth={1}
          borderColor="border"
          padding="xl"
        >
          <Box
            width={58}
            height={58}
            borderRadius="pill"
            backgroundColor="purpleDark"
            alignItems="center"
            justifyContent="center"
            marginBottom="lg"
          >
            <Feather name="download-cloud" size={28} color="#FF7A00" />
          </Box>

          <Text variant="title">
            {required ? "Atualização necessária" : "Nova versão disponível"}
          </Text>
          <Text variant="body" marginTop="md">
            {data.message ||
              "Atualize o Ipueiras+ para aproveitar a versão mais recente."}
          </Text>
          <Text variant="caption" marginTop="md">
            Versão instalada: {installedVersion} · Nova versão: {data.latestVersion}
          </Text>

          <CooldownPressable
            accessibilityRole="button"
            accessibilityLabel="Atualizar aplicativo"
            onPress={() => void openExternalUrl(validUpdateUrl)}
          >
            <Box
              minHeight={50}
              backgroundColor="primary"
              borderRadius="lg"
              alignItems="center"
              justifyContent="center"
              marginTop="xl"
            >
              <Text variant="cardTitle">Atualizar aplicativo</Text>
            </Box>
          </CooldownPressable>

          {!required ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Atualizar depois"
              onPress={() => void dismissOptionalUpdate()}
            >
              <Box minHeight={46} alignItems="center" justifyContent="center" marginTop="sm">
                <Text variant="body">Agora não</Text>
              </Box>
            </Pressable>
          ) : null}
        </Box>
      </Box>
    </Modal>
  );
}
