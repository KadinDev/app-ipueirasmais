import { createTheme } from "@shopify/restyle";

export const theme = createTheme({
  colors: {
    background: "#0B0714",
    surface: "#151022",
    surfaceAlt: "#211733",
    card: "#181027",
    border: "rgba(255,255,255,0.10)",
    text: "#FFFFFF",
    textMuted: "#B7A8C8",
    textSoft: "#D8CFE7",
    primary: "#FF7A00",
    primaryDark: "#B94700",
    purple: "#8B1CF6",
    purpleDark: "#351157",
    green: "#16A34A",
    blue: "#2563EB",
    danger: "#EF4444",
    warning: "#F59E0B",
    transparent: "transparent",
    instagram: "#E1306C",
  },
  spacing: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  borderRadii: {
    none: 0,
    sm: 6,
    md: 8,
    lg: 12,
    pill: 999,
  },
  textVariants: {
    defaults: {
      color: "text",
      fontSize: 14,
      lineHeight: 20,
    },
    title: {
      color: "text",
      fontSize: 24,
      lineHeight: 30,
      fontWeight: "800",
    },
    sectionTitle: {
      color: "text",
      fontSize: 17,
      lineHeight: 23,
      fontWeight: "800",
    },
    cardTitle: {
      color: "text",
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "800",
    },
    body: {
      color: "textSoft",
      fontSize: 14,
      lineHeight: 21,
    },
    caption: {
      color: "textMuted",
      fontSize: 12,
      lineHeight: 16,
    },
    badge: {
      color: "text",
      fontSize: 11,
      lineHeight: 14,
      fontWeight: "800",
    },
  },
});

export type Theme = typeof theme;
