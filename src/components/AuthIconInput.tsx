import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { useTheme } from "@/hooks/useTheme";

type IconName = keyof typeof Ionicons.glyphMap;

interface Props extends TextInputProps {
  icon: IconName;
  isPassword?: boolean;
}

export default function AuthIconInput({
  icon,
  isPassword = false,
  ...props
}: Props) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <View
      style={[
        styles.wrapper,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={theme.colors.textSecondary}
        style={styles.leadingIcon}
      />

      <TextInput
        placeholderTextColor={theme.colors.textSecondary}
        secureTextEntry={isPassword && !visible}
        style={[styles.input, { color: theme.colors.text }]}
        {...props}
      />

      {isPassword ? (
        <Pressable
          onPress={() => setVisible((v) => !v)}
          hitSlop={8}
          style={styles.trailingIcon}
        >
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={theme.colors.textSecondary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    height: 52,
    marginBottom: 14,
    paddingHorizontal: 14,
  },
  leadingIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  trailingIcon: {
    marginLeft: 8,
    padding: 2,
  },
});
