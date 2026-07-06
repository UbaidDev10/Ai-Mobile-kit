import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";

const SUGGESTIONS = [
  { icon: "bulb-outline" as const, text: "Explain a concept simply" },
  { icon: "mail-outline" as const, text: "Write a professional email" },
  { icon: "document-text-outline" as const, text: "Summarize a document" },
  { icon: "code-slash-outline" as const, text: "Help me debug code" },
];

interface Props {
  userName: string;
  onPick: (question: string) => void;
}

export default function ChatEmptyState({ userName, onPick }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.logoWrap,
          { backgroundColor: theme.colors.surfaceSecondary },
        ]}
      >
        <Ionicons name="sparkles" size={28} color={theme.colors.primary} />
      </View>

      <Text style={[styles.greeting, { color: theme.colors.text }]}>
        Hello, {userName}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        How can I help you today?
      </Text>

      <View style={styles.grid}>
        {SUGGESTIONS.map((item) => (
          <Pressable
            key={item.text}
            onPress={() => onPick(item.text)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Ionicons
              name={item.icon}
              size={20}
              color={theme.colors.primary}
            />
            <Text style={[styles.cardText, { color: theme.colors.text }]}>
              {item.text}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
  },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 28,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "47%",
    flexGrow: 1,
    minHeight: 96,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
});
