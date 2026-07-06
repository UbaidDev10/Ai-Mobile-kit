import {
  ActivityIndicator,
  View,
} from "react-native";

import { useTheme } from "@/hooks/useTheme";

export default function Loader() {
  const theme = useTheme();

  return (
    <View
      style={{
        padding: 20,
        alignItems: "center",
      }}
    >
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
      />
    </View>
  );
}