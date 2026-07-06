import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CHAT_PLACEHOLDER } from "@/constants/app";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onCancel?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  streaming?: boolean;
  placeholder?: string;
}

export default function ChatComposer({
  value,
  onChangeText,
  onSend,
  onCancel,
  onFocus,
  disabled = false,
  streaming = false,
  placeholder = CHAT_PLACEHOLDER,
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const canSend = value.trim().length > 0 && !disabled && !streaming;

  function handleSend() {
    if (!canSend) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend();
  }

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: Math.max(insets.bottom, 12),
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          editable={!disabled && !streaming}
          style={[styles.input, { color: theme.colors.text }]}
        />

        <Pressable
          onPress={streaming ? onCancel : handleSend}
          disabled={streaming ? !onCancel : !canSend}
          style={[
            styles.button,
            {
              backgroundColor: streaming
                ? theme.colors.danger
                : canSend
                  ? theme.colors.primary
                  : theme.colors.border,
            },
          ]}
        >
          <Ionicons
            name={streaming ? "stop" : "arrow-up"}
            size={20}
            color="#fff"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    borderWidth: 1,
    borderRadius: 28,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 6,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    paddingVertical: 10,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
