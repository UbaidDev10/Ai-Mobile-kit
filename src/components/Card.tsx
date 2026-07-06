import {
  View,
  StyleSheet,
  ViewProps,
} from "react-native";

import { useTheme } from "@/hooks/useTheme";

export default function Card(
  props: ViewProps
) {
  const theme = useTheme();

  return (
    <View
      {...props}
      style={[
        styles.card,
        {
          backgroundColor:
            theme.colors.surface,
          borderColor:
            theme.colors.border,
        },
        props.style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
});