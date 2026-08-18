import Feather from "@expo/vector-icons/Feather";
import { Modal, Pressable, ScrollView } from "react-native";
import type { NotificationPreview } from "@/domains/notification/Notification";
import { Box } from "../components/Box";
import { Text } from "../components/Text";
import { formatDate } from "../utils/format";

type NotificationsModalProps = {
  visible: boolean;
  notifications: NotificationPreview[];
  onClose: () => void;
};

export function NotificationsModal({
  visible,
  notifications,
  onClose,
}: NotificationsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Box
        flex={1}
        justifyContent="flex-end"
        style={{ backgroundColor: "rgba(0,0,0,0.62)" }}
      >
        <Box
          maxHeight="72%"
          backgroundColor="surface"
          borderTopLeftRadius="lg"
          borderTopRightRadius="lg"
          padding="lg"
          gap="md"
          borderColor="border"
          borderWidth={1}
        >
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Text variant="title">Notificações</Text>
              <Text variant="caption">Acompanhe as notificações</Text>
            </Box>
            <Pressable onPress={onClose} hitSlop={12}>
              <Box
                width={38}
                height={38}
                borderRadius="pill"
                backgroundColor="surfaceAlt"
                alignItems="center"
                justifyContent="center"
              >
                <Feather name="x" size={20} color="#FFFFFF" />
              </Box>
            </Pressable>
          </Box>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {notifications.length ? (
              notifications.map((item) => (
                <Box
                  key={item.id}
                  flexDirection="row"
                  gap="md"
                  padding="md"
                  marginBottom="sm"
                  backgroundColor="card"
                  borderRadius="lg"
                  borderColor="border"
                  borderWidth={1}
                >
                  <Box
                    width={42}
                    height={42}
                    borderRadius="pill"
                    backgroundColor="surfaceAlt"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Feather name="bell" size={18} color="#FFFFFF" />
                  </Box>
                  <Box flex={1} gap="xs">
                    <Text variant="cardTitle" numberOfLines={2}>
                      {item.title}
                    </Text>
                    {item.body ? (
                      <Text variant="caption" numberOfLines={3}>
                        {item.body}
                      </Text>
                    ) : null}
                    <Text variant="badge" numberOfLines={3}>
                      {item?.entityType === "event"
                        ? "Veja em Eventos"
                        : item.entityType === "news"
                          ? "Veja em Notícias"
                          : "Avisos"}
                    </Text>
                    <Text variant="caption">
                      {formatDate(item.publishedAt)}
                    </Text>
                  </Box>
                </Box>
              ))
            ) : (
              <Box height={130} alignItems="center" justifyContent="center">
                <Text variant="body">
                  Nenhuma notificação nova por enquanto.
                </Text>
              </Box>
            )}
          </ScrollView>
        </Box>
      </Box>
    </Modal>
  );
}
