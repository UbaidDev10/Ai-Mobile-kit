import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AuthDivider from "@/components/AuthDivider";
import AuthHeader from "@/components/AuthHeader";
import AuthIconInput from "@/components/AuthIconInput";
import Button from "@/components/Button";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import KeyboardScreen from "@/components/KeyboardScreen";
import Screen from "@/components/Screen";
import { useTheme } from "@/hooks/useTheme";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";

export default function SignInScreen() {
  useWarmUpBrowser();

  const theme = useTheme();
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSignIn() {
    if (!isLoaded) return;

    setLoading(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(tabs)");
        return;
      }

      setError("Additional verification is required.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setError(null);

    try {
      const { createdSessionId, setActive: ssoSetActive } =
        await startSSOFlow({
          strategy: "oauth_google",
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      if (createdSessionId && ssoSetActive) {
        await ssoSetActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
  }

  const busy = loading || googleLoading;

  return (
    <Screen>
      <KeyboardScreen contentContainerStyle={styles.scroll}>
        <AuthHeader
          title="Welcome back"
          subtitle="Sign in to continue chatting with your AI assistant"
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <AuthIconInput
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            editable={!busy}
          />

          <AuthIconInput
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            isPassword
            textContentType="password"
            editable={!busy}
          />

          {error ? (
            <View
              style={[
                styles.errorBox,
                { backgroundColor: `${theme.colors.danger}15` },
              ]}
            >
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={theme.colors.danger}
              />
              <Text style={[styles.errorText, { color: theme.colors.danger }]}>
                {error}
              </Text>
            </View>
          ) : null}

          <Button
            title="Sign in"
            onPress={handleSignIn}
            loading={loading}
            disabled={!email.trim() || !password || googleLoading}
          />

          <AuthDivider />

          <GoogleSignInButton
            onPress={handleGoogle}
            loading={googleLoading}
            disabled={loading}
          />
        </View>

        <Link href="/(auth)/sign-up" style={styles.footerLink}>
          <Text style={{ color: theme.colors.textSecondary }}>
            Don't have an account?{" "}
            <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
              Sign up
            </Text>
          </Text>
        </Link>
      </KeyboardScreen>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    justifyContent: "center",
  },
  card: { borderWidth: 1, borderRadius: 20, padding: 20 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  errorText: { flex: 1, fontSize: 14 },
  footerLink: { marginTop: 24, alignItems: "center" },
});
