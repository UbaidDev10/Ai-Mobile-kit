import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import Markdown from "react-native-markdown-display";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import TypingIndicator from "@/components/TypingIndicator";
import { ChatMessage } from "@/types/chat";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  message: ChatMessage;
  isStreaming?: boolean;
  isLastAssistant?: boolean;
  onRegenerate?: () => void;
}

export default function ChatMessageRow({
  message,
  isStreaming = false,
  isLastAssistant = false,
  onRegenerate,
}: Props) {
  const theme = useTheme();
  const isUser = message.role === "user";
  const showTyping = !isUser && !message.content && isStreaming;

  async function handleCopy() {
    await Clipboard.setStringAsync(message.content);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  if (isUser) {
    return (
      <View style={styles.userRow}>
        <Pressable
          onLongPress={handleCopy}
          style={[
            styles.userBubble,
            { backgroundColor: theme.colors.surfaceSecondary },
          ]}
        >
          <Text style={[styles.userText, { color: theme.colors.text }]}>
            {message.content}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.assistantRow}>
      <View
        style={[
          styles.assistantAvatar,
          { backgroundColor: theme.colors.surfaceSecondary },
        ]}
      >
        <Ionicons name="sparkles" size={16} color={theme.colors.primary} />
      </View>

      <View style={styles.assistantContent}>
        {showTyping ? (
          <TypingIndicator />
        ) : (
          <Pressable onLongPress={handleCopy}>
            <Markdown
              style={{
                body: {
                  color: theme.colors.text,
                  fontSize: 15,
                  lineHeight: 24,
                },
                code_inline: {
                  backgroundColor: theme.colors.surfaceSecondary,
                  borderRadius: 4,
                  paddingHorizontal: 4,
                  fontFamily: "monospace",
                },
                fence: {
                  backgroundColor: theme.colors.surfaceSecondary,
                  borderRadius: 8,
                  padding: 10,
                  fontFamily: "monospace",
                },
                link: { color: theme.colors.primary },
              }}
            >
              {message.content || " "}
            </Markdown>
          </Pressable>
        )}

        {!showTyping && message.content && isLastAssistant && onRegenerate ? (
          <View style={styles.actions}>
            <Pressable
              onPress={handleCopy}
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <Ionicons
                name="copy-outline"
                size={18}
                color={theme.colors.textSecondary}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                Alert.alert("Regenerate", "Generate a new response?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Regenerate", onPress: onRegenerate },
                ]);
              }}
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <Ionicons
                name="refresh-outline"
                size={18}
                color={theme.colors.textSecondary}
              />
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userRow: {
    alignItems: "flex-end",
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  userBubble: {
    maxWidth: "85%",
    borderRadius: 20,
    borderBottomRightRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userText: {
    fontSize: 15,
    lineHeight: 22,
  },
  assistantRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  assistantContent: {
    flex: 1,
    paddingRight: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
});
