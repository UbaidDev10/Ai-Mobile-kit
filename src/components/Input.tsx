import {
  StyleSheet,
  TextInput,
  TextInputProps,
} from "react-native";

import { useTheme } from "@/hooks/useTheme";

export default function Input(
  props: TextInputProps
) {
  const theme = useTheme();

  return (
    <TextInput
      placeholderTextColor={
        theme.colors.textSecondary
      }
      style={[
        styles.input,
        {
          borderColor: theme.colors.border,
          color: theme.colors.text,
        },
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});