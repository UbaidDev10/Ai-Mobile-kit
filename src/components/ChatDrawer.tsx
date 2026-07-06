import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Conversation } from "@/store/chatStore";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  visible: boolean;
  conversations: Conversation[];
  activeId: string | null;
  onClose: () => void;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onClearAll: () => void;
}

export default function ChatDrawer({
  visible,
  conversations,
  activeId,
  onClose,
  onSelect,
  onNewChat,
  onClearAll,
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.drawer,
            {
              backgroundColor: theme.colors.surface,
              paddingTop: insets.top + 12,
              paddingBottom: insets.bottom + tabBarHeight + 16,
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Chats
            </Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.textSecondary}
              />
            </Pressable>
          </View>

          <Pressable
            onPress={() => {
              onNewChat();
              onClose();
            }}
            style={({ pressed }) => [
              styles.newChatBtn,
              {
                backgroundColor: theme.colors.surfaceSecondary,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons name="add" size={20} color={theme.colors.primary} />
            <Text style={[styles.newChatText, { color: theme.colors.primary }]}>
              New chat
            </Text>
          </Pressable>

          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {conversations.length === 0 ? (
              <Text
                style={[styles.empty, { color: theme.colors.textSecondary }]}
              >
                No conversations yet
              </Text>
            ) : (
              conversations.map((conversation) => {
                const isActive = conversation.id === activeId;
                return (
                  <Pressable
                    key={conversation.id}
                    onPress={() => {
                      onSelect(conversation.id);
                      onClose();
                    }}
                    style={({ pressed }) => [
                      styles.item,
                      {
                        backgroundColor: isActive
                          ? theme.colors.surfaceSecondary
                          : "transparent",
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={18}
                      color={
                        isActive
                          ? theme.colors.primary
                          : theme.colors.textSecondary
                      }
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.itemText,
                        {
                          color: isActive
                            ? theme.colors.text
                            : theme.colors.textSecondary,
                          fontWeight: isActive ? "600" : "400",
                        },
                      ]}
                    >
                      {conversation.title}
                    </Text>
                  </Pressable>
                );
              })
            )}
          </ScrollView>

          {conversations.length > 0 && (
            <Pressable
              onPress={onClearAll}
              style={({ pressed }) => [
                styles.clearBtn,
                {
                  borderColor: theme.colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={theme.colors.danger}
              />
              <Text style={[styles.clearText, { color: theme.colors.danger }]}>
                Clear all chats
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  drawer: {
    width: "82%",
    maxWidth: 320,
    alignSelf: "stretch",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  newChatBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  newChatText: {
    fontSize: 15,
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 12,
  },
  empty: {
    fontSize: 14,
    paddingVertical: 24,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  clearText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
