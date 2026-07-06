import { StyleSheet } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { ReactNode } from "react";
import { useTheme } from "@/hooks/useTheme";

interface ScreenProps {
  children: ReactNode;
  noPadding?: boolean;
  edges?: Edge[];
}

export default function Screen({
  children,
  noPadding = false,
  edges = ["top", "left", "right"],
}: ScreenProps) {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        noPadding && styles.noPadding,
        { backgroundColor: theme.colors.background },
      ]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  noPadding: {
    padding: 0,
  },
});
