import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  children: ReactNode;
  scroll?: boolean;
  bottomInset?: number;
  contentContainerStyle?: ViewStyle;
}

export default function KeyboardScreen({
  children,
  scroll = true,
  bottomInset = 0,
  contentContainerStyle,
}: Props) {
  const insets = useSafeAreaInsets();

  const keyboardVerticalOffset =
    bottomInset + (Platform.OS === "ios" ? insets.top : 0);

  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scroll, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {content}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingVertical: 24,
  },
});
