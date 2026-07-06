import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";

export default function AuthDivider() {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
      <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
        or
      </Text>
      <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
  },
});
