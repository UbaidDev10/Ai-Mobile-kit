import { useSignUp, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import AuthDivider from "@/components/AuthDivider";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import AuthHeader from "@/components/AuthHeader";
import AuthIconInput from "@/components/AuthIconInput";
import Button from "@/components/Button";
import KeyboardScreen from "@/components/KeyboardScreen";
import Screen from "@/components/Screen";
import { useTheme } from "@/hooks/useTheme";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";

export default function SignUpScreen() {
  useWarmUpBrowser();

  const theme = useTheme();
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSignUp() {
    if (!isLoaded) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signUp.create({
        emailAddress: email.trim(),
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!isLoaded) return;

    setLoading(true);
    setError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(tabs)");
        return;
      }

      setError("Verification incomplete. Check the code and try again.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
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
            title={pendingVerification ? "Check your email" : "Create account"}
            subtitle={
              pendingVerification
                ? `We sent a 6-digit code to ${email}`
                : "Get started with your AI assistant in seconds"
            }
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
            {!pendingVerification ? (
              <>
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
                  textContentType="newPassword"
                  editable={!busy}
                />

                <AuthIconInput
                  icon="shield-checkmark-outline"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                  isPassword
                  textContentType="newPassword"
                  editable={!busy}
                />

                {error ? <ErrorBanner message={error} /> : null}

                <Button
                  title="Create account"
                  onPress={handleSignUp}
                  loading={loading}
                  disabled={
                    !email.trim() ||
                    !password ||
                    !confirmPassword ||
                    googleLoading
                  }
                />

                <AuthDivider />

                <GoogleSignInButton
                  onPress={handleGoogle}
                  loading={googleLoading}
                  disabled={loading}
                />
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.codeIcon,
                    { backgroundColor: `${theme.colors.primary}15` },
                  ]}
                >
                  <Ionicons
                    name="mail-open-outline"
                    size={32}
                    color={theme.colors.primary}
                  />
                </View>

                <AuthIconInput
                  icon="keypad-outline"
                  value={code}
                  onChangeText={setCode}
                  placeholder="6-digit verification code"
                  keyboardType="number-pad"
                  maxLength={6}
                  editable={!loading}
                />

                {error ? <ErrorBanner message={error} /> : null}

                <Button
                  title="Verify email"
                  onPress={handleVerify}
                  loading={loading}
                  disabled={!code.trim()}
                />
              </>
            )}
          </View>

          <Link href="/(auth)/sign-in" style={styles.footerLink}>
            <Text style={{ color: theme.colors.textSecondary }}>
              Already have an account?{" "}
              <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
                Sign in
              </Text>
            </Text>
          </Link>
      </KeyboardScreen>
    </Screen>
  );
}

function ErrorBanner({ message }: { message: string }) {
  const theme = useTheme();

  return (
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
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    justifyContent: "center",
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
  },
  codeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
  footerLink: {
    marginTop: 24,
    alignItems: "center",
  },
});
