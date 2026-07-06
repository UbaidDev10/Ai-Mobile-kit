import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import GoogleLogo from "@/components/GoogleLogo";
import Input from "@/components/Input";
import KeyboardScreen from "@/components/KeyboardScreen";
import Loader from "@/components/Loader";
import Screen from "@/components/Screen";
import { useTheme } from "@/hooks/useTheme";
import { getDisplayName } from "@/utils/getDisplayName";

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { isLoaded, signOut } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
  }, [user?.id, user?.firstName, user?.lastName]);

  if (!isLoaded || !userLoaded || !user) {
    return (
      <Screen>
        <Loader />
      </Screen>
    );
  }

  const displayName = getDisplayName(user);
  const email = user.primaryEmailAddress?.emailAddress ?? "";
  const hasPassword = user.passwordEnabled;
  const isGoogleUser = user.externalAccounts.some(
    (account) => account.provider.includes("google")
  );

  async function handleSaveProfile() {
    if (!user) return;

    setSavingProfile(true);
    setProfileErr(null);
    setProfileMsg(null);

    try {
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      setProfileMsg("Profile updated.");
    } catch (err) {
      setProfileErr(
        err instanceof Error ? err.message : "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword() {
    if (!user) return;

    if (newPassword !== confirmPassword) {
      setPwErr("New passwords do not match.");
      return;
    }

    setSavingPw(true);
    setPwErr(null);
    setPwMsg(null);

    try {
      await user.updatePassword({
        currentPassword,
        newPassword,
      });
      setPwMsg("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwErr(
        err instanceof Error ? err.message : "Failed to update password."
      );
    } finally {
      setSavingPw(false);
    }
  }

  async function handleSetPassword() {
    if (!user) return;

    if (newPassword !== confirmPassword) {
      setPwErr("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPwErr("Password must be at least 8 characters.");
      return;
    }

    setSavingPw(true);
    setPwErr(null);
    setPwMsg(null);

    try {
      await user.updatePassword({ newPassword });
      setPwMsg("Password set successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwErr(
        err instanceof Error ? err.message : "Failed to set password."
      );
    } finally {
      setSavingPw(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/(auth)/sign-in");
  }

  return (
    <Screen>
      <KeyboardScreen bottomInset={tabBarHeight} contentContainerStyle={styles.content}>
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Avatar name={displayName} imageUrl={user.imageUrl} size={72} />
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {displayName}
            </Text>
            <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
              {email || "No email on file"}
            </Text>
            {isGoogleUser ? (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: theme.colors.surfaceSecondary },
                ]}
              >
                <GoogleLogo size={14} />
                <Text
                  style={[styles.badgeText, { color: theme.colors.textSecondary }]}
                >
                  Signed in with Google
                </Text>
              </View>
            ) : null}
          </View>

          <Section title="Profile" theme={theme}>
            <Input
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              autoCapitalize="words"
            />
            <Input
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              autoCapitalize="words"
            />

            <View style={styles.readOnlyField}>
              <Text
                style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}
              >
                Email
              </Text>
              <Text style={[styles.fieldValue, { color: theme.colors.text }]}>
                {email || "Not available"}
              </Text>
            </View>

            {profileErr ? (
              <Text style={[styles.msg, { color: theme.colors.danger }]}>
                {profileErr}
              </Text>
            ) : null}
            {profileMsg ? (
              <Text style={[styles.msg, { color: theme.colors.success }]}>
                {profileMsg}
              </Text>
            ) : null}

            <Button
              title="Save profile"
              onPress={handleSaveProfile}
              loading={savingProfile}
            />
          </Section>

          {hasPassword ? (
            <Section title="Security" theme={theme}>
              <Input
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Current password"
                secureTextEntry
                textContentType="password"
              />
              <Input
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New password"
                secureTextEntry
                textContentType="newPassword"
              />
              <Input
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry
                textContentType="newPassword"
              />

              {pwErr ? (
                <Text style={[styles.msg, { color: theme.colors.danger }]}>
                  {pwErr}
                </Text>
              ) : null}
              {pwMsg ? (
                <Text style={[styles.msg, { color: theme.colors.success }]}>
                  {pwMsg}
                </Text>
              ) : null}

              <Button
                title="Update password"
                onPress={handleChangePassword}
                loading={savingPw}
                disabled={
                  !currentPassword || !newPassword || !confirmPassword
                }
              />
            </Section>
          ) : (
            <Section title="Security" theme={theme}>
              <Text
                style={[styles.securityHint, { color: theme.colors.textSecondary }]}
              >
                {isGoogleUser
                  ? "Add a password to sign in with email as well."
                  : "Set a password for your account."}
              </Text>
              <Input
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New password"
                secureTextEntry
                textContentType="newPassword"
              />
              <Input
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry
                textContentType="newPassword"
              />

              {pwErr ? (
                <Text style={[styles.msg, { color: theme.colors.danger }]}>
                  {pwErr}
                </Text>
              ) : null}
              {pwMsg ? (
                <Text style={[styles.msg, { color: theme.colors.success }]}>
                  {pwMsg}
                </Text>
              ) : null}

              <Button
                title="Set password"
                onPress={handleSetPassword}
                loading={savingPw}
                disabled={!newPassword || !confirmPassword}
              />
            </Section>
          )}

          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => [
              styles.signOut,
              {
                borderColor: theme.colors.danger,
                opacity: pressed ? 0.6 : 1,
              },
            ]}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={theme.colors.danger}
            />
            <Text style={[styles.signOutText, { color: theme.colors.danger }]}>
              Sign out
            </Text>
          </Pressable>
      </KeyboardScreen>
    </Screen>
  );
}

function Section({
  title,
  theme,
  children,
}: {
  title: string;
  theme: ReturnType<typeof useTheme>;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
        {title.toUpperCase()}
      </Text>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 32, gap: 8 },
  heroCard: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    gap: 6,
  },
  name: { fontSize: 22, fontWeight: "700", marginTop: 8 },
  email: { fontSize: 14 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  badgeText: { fontSize: 13, fontWeight: "500" },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: { borderWidth: 1, borderRadius: 16, padding: 16 },
  readOnlyField: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, marginBottom: 4 },
  fieldValue: { fontSize: 15, fontWeight: "500" },
  msg: { fontSize: 13, marginBottom: 12 },
  securityHint: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  signOut: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    height: 50,
    marginTop: 8,
  },
  signOutText: { fontSize: 16, fontWeight: "600" },
});
