import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { forwardRef } from "react";
import { StyleSheet, Text, View } from "react-native";

export type ShareStoryCardProps = {
  type: "news" | "event" | "alert";
  title: string;
  description?: string | null;
  imageUrl?: string | null;
};

const labels: Record<ShareStoryCardProps["type"], string> = {
  news: "NOTÍCIA",
  event: "EVENTO",
  alert: "AVISO",
};

/** Card 9:16 renderizado fora da tela e capturado para o compartilhamento. */
export const ShareStoryCard = forwardRef<View, ShareStoryCardProps>(
  function ShareStoryCard({ type, title, description, imageUrl }, ref) {
    const hasImage = type !== "alert" && Boolean(imageUrl);

    return (
      <View
        ref={ref}
        collapsable={false}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.card}
      >
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <View style={styles.header}>
          <Text style={styles.brand}>Ipueiras</Text>
          <Text style={styles.plus}>+</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{labels[type]}</Text>
        </View>

        {hasImage ? (
          <View style={styles.imageFrame}>
            <Image
              source={{ uri: imageUrl! }}
              style={styles.image}
              contentFit="cover"
              transition={0}
            />
          </View>
        ) : type === "alert" ? (
          <View style={styles.alertIcon}>
            <Feather name="volume-2" size={76} color="#FFFFFF" />
          </View>
        ) : null}

        <View style={styles.copy}>
          <Text style={styles.title} numberOfLines={hasImage ? 4 : 6}>
            {title}
          </Text>
          {description ? (
            <Text style={styles.description} numberOfLines={hasImage ? 4 : 6}>
              {description}
            </Text>
          ) : null}
        </View>

        <View style={styles.footerLine} />
        <Text style={styles.footer}>Veja no app Ipueiras+</Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    // Longe o bastante para nunca entrar na área visível durante os gestos
    // e animações horizontais do Stack, mas ainda montado para o captureRef.
    left: -10000,
    top: 0,
    width: 360,
    height: 640,
    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 30,
    overflow: "hidden",
    backgroundColor: "#09060F",
  },
  glowTop: {
    position: "absolute",
    width: 330,
    height: 330,
    borderRadius: 165,
    top: -190,
    right: -120,
    backgroundColor: "#4D1672",
    opacity: 0.65,
  },
  glowBottom: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    bottom: -180,
    left: -130,
    backgroundColor: "#301044",
    opacity: 0.55,
  },
  header: { flexDirection: "row", alignItems: "baseline", marginBottom: 20 },
  brand: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -1,
  },
  plus: { color: "#FF7A00", fontSize: 28, fontWeight: "900" },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: "#FF7A00",
    marginBottom: 18,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.3,
  },
  imageFrame: {
    height: 254,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#241A2D",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 20,
  },
  image: { width: "100%", height: "100%" },
  alertIcon: {
    width: 142,
    height: 142,
    borderRadius: 71,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 26,
    marginBottom: 34,
    backgroundColor: "#FF7A00",
    borderWidth: 8,
    borderColor: "rgba(255,255,255,0.10)",
  },
  copy: { flex: 1 },
  title: {
    color: "#FFFFFF",
    fontSize: 27,
    lineHeight: 31,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  description: {
    color: "#CFC8D6",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    fontWeight: "500",
  },
  footerLine: {
    width: 42,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#FF7A00",
    marginBottom: 10,
  },
  footer: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
});
