import { Pressable, StyleSheet, Text } from "react-native";

import GoogleLogo from "@/components/GoogleLogo";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function GoogleSignInButton({
  onPress,
  loading = false,
  disabled = false,
}: Props) {
  const theme = useTheme();
  const busy = loading || disabled;

  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      style={({ pressed }) => [
        styles.button,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.background,
          opacity: pressed || busy ? 0.7 : 1,
        },
      ]}
    >
      {loading ? (
        <Text style={{ color: theme.colors.textSecondary }}>Connecting...</Text>
      ) : (
        <>
          <GoogleLogo size={20} />
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Continue with Google
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
});
