import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ChatMessage } from "@/types/chat";
import { useTheme } from "@/hooks/useTheme";
import TypingIndicator from "./TypingIndicator";

interface Props {
  message: ChatMessage;
  isStreaming?: boolean;
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function ChatBubble({ message, isStreaming = false }: Props) {
  const theme = useTheme();

  const isUser = message.role === "user";
  const showTyping = !isUser && !message.content && isStreaming;

  return (
    <View
      style={[
        styles.row,
        { justifyContent: isUser ? "flex-end" : "flex-start" },
      ]}
    >
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="sparkles" size={14} color="#fff" />
        </View>
      )}

      <View style={styles.bubbleWrap}>
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isUser
                ? theme.colors.primary
                : theme.colors.surface,
              borderColor: isUser ? theme.colors.primary : theme.colors.border,
              borderBottomRightRadius: isUser ? 4 : 18,
              borderBottomLeftRadius: isUser ? 18 : 4,
            },
          ]}
        >
          {showTyping ? (
            <TypingIndicator />
          ) : (
            <Text
              style={{
                color: isUser ? "#fff" : theme.colors.text,
                fontSize: 15,
                lineHeight: 21,
              }}
            >
              {message.content}
            </Text>
          )}
        </View>

        {!showTyping && (
          <Text
            style={[
              styles.time,
              {
                color: theme.colors.textSecondary,
                textAlign: isUser ? "right" : "left",
              },
            ]}
          >
            {formatTime(message.createdAt)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6,
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  bubbleWrap: {
    maxWidth: "78%",
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
  },
  time: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 4,
  },
});
