import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ChatComposer from "@/components/ChatComposer";
import ChatDrawer from "@/components/ChatDrawer";
import ChatEmptyState from "@/components/ChatEmptyState";
import ChatMessageRow from "@/components/ChatMessageRow";
import Loader from "@/components/Loader";
import Screen from "@/components/Screen";
import { APP_NAME } from "@/constants/app";
import { useChat } from "@/hooks/useChat";
import { useTheme } from "@/hooks/useTheme";
import { getFirstName } from "@/utils/getDisplayName";

export default function ChatScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { isLoaded } = useAuth();
  const { user } = useUser();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [input, setInput] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    messages,
    activeConversation,
    conversations,
    streaming,
    error,
    sendStreamingMessage,
    regenerateLastResponse,
    cancelStream,
    newChat,
    clearAll,
    selectConversation,
  } = useChat();

  const hasMessages = messages.length > 0;
  const userName = user ? getFirstName(user) : "there";
  const lastAssistantIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].role === "assistant") return i;
    }
    return -1;
  })();

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: drawerOpen
        ? { display: "none" }
        : {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            height: Platform.OS === "ios" ? 88 : 64,
            paddingTop: 8,
            paddingBottom: Platform.OS === "ios" ? 28 : 10,
          },
    });
  }, [drawerOpen, navigation, theme.colors.border, theme.colors.surface]);

  function scrollToBottom() {
    listRef.current?.scrollToEnd({ animated: true });
  }

  useEffect(() => {
    if (hasMessages) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, hasMessages]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;

    setInput("");
    await sendStreamingMessage(text);
  }

  function handleClearAll() {
    setDrawerOpen(false);

    setTimeout(() => {
      Alert.alert(
        "Clear all chats",
        "This will permanently delete every conversation.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Clear all",
            style: "destructive",
            onPress: clearAll,
          },
        ]
      );
    }, 300);
  }

  if (!isLoaded) {
    return (
      <Screen>
        <Loader />
      </Screen>
    );
  }

  return (
    <Screen noPadding edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <Pressable
            onPress={() => setDrawerOpen(true)}
            hitSlop={10}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Ionicons name="menu" size={24} color={theme.colors.text} />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text
              numberOfLines={1}
              style={[styles.headerTitle, { color: theme.colors.text }]}
            >
              {activeConversation?.title ?? APP_NAME}
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}
            >
              {streaming ? "Typing..." : "Online"}
            </Text>
          </View>

          <Pressable
            onPress={newChat}
            hitSlop={10}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Ionicons
              name="create-outline"
              size={22}
              color={theme.colors.textSecondary}
            />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={
            tabBarHeight + (Platform.OS === "ios" ? insets.top : 0)
          }
        >
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            renderItem={({ item, index }) => (
              <ChatMessageRow
                message={item}
                isStreaming={
                  streaming &&
                  index === messages.length - 1 &&
                  item.role === "assistant"
                }
                isLastAssistant={
                  item.role === "assistant" && index === lastAssistantIndex
                }
                onRegenerate={
                  item.role === "assistant" && !streaming
                    ? regenerateLastResponse
                    : undefined
                }
              />
            )}
            contentContainerStyle={
              hasMessages ? styles.list : styles.listEmpty
            }
            ListEmptyComponent={
              <ChatEmptyState
                userName={userName}
                onPick={(q) => sendStreamingMessage(q)}
              />
            }
          />

          {error ? (
            <Text style={[styles.error, { color: theme.colors.danger }]}>
              {error}
            </Text>
          ) : null}

          <ChatComposer
            value={input}
            onChangeText={setInput}
            onSend={handleSend}
            onCancel={cancelStream}
            onFocus={scrollToBottom}
            streaming={streaming}
          />
        </KeyboardAvoidingView>
      </View>

      <ChatDrawer
        visible={drawerOpen}
        conversations={conversations}
        activeId={activeConversation?.id ?? null}
        onClose={() => setDrawerOpen(false)}
        onSelect={selectConversation}
        onNewChat={newChat}
        onClearAll={handleClearAll}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 8,
    flexGrow: 1,
  },
  listEmpty: {
    flexGrow: 1,
  },
  error: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    fontSize: 14,
  },
});
