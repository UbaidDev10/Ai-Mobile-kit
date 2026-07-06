import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/hooks/useTheme";

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onCancel?: () => void;
  disabled?: boolean;
  streaming?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  value,
  onChangeText,
  onSend,
  onCancel,
  disabled = false,
  streaming = false,
  placeholder = "Message...",
}: ChatInputProps) {
  const theme = useTheme();
  const canSend = value.trim().length > 0 && !disabled && !streaming;

  return (
    <View
      style={[
        styles.container,
        {
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        multiline
        editable={!disabled && !streaming}
        style={[
          styles.input,
          {
            borderColor: theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
          },
        ]}
      />

      <Pressable
        onPress={streaming ? onCancel : onSend}
        disabled={streaming ? !onCancel : !canSend}
        style={[
          styles.button,
          {
            backgroundColor: streaming
              ? theme.colors.danger
              : theme.colors.primary,
            opacity: streaming || canSend ? 1 : 0.5,
          },
        ]}
      >
        <Ionicons
          name={streaming ? "stop" : "send"}
          size={20}
          color="#fff"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 120,
    borderWidth: 1,
    borderRadius: 23,
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontSize: 16,
  },
  button: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
});
