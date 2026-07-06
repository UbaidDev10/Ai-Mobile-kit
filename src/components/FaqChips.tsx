import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/hooks/useTheme";

const FAQS = [
  "What can you help me with?",
  "Summarize a document for me",
  "Write a professional email",
  "Explain a concept simply",
];

interface Props {
  onPick: (question: string) => void;
}

export default function FaqChips({ onPick }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name="sparkles" size={32} color={theme.colors.primary} />
      </View>

      <Text style={[styles.title, { color: theme.colors.text }]}>
        How can I help you today?
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Try one of these to get started
      </Text>

      <View style={styles.chips}>
        {FAQS.map((question) => (
          <Pressable
            key={question}
            onPress={() => onPick(question)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                opacity: pressed ? 0.6 : 1,
              },
            ]}
          >
            <Text style={[styles.chipText, { color: theme.colors.text }]}>
              {question}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={theme.colors.textSecondary}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 48,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  chips: {
    width: "100%",
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  chipText: {
    fontSize: 15,
    flex: 1,
  },
});
