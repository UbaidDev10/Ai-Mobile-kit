import type { UserResource } from "@clerk/types";

export function getDisplayName(user: UserResource): string {
  if (user.fullName?.trim()) return user.fullName.trim();
  if (user.username?.trim()) return user.username.trim();

  const email = user.primaryEmailAddress?.emailAddress;
  if (email) return email.split("@")[0];

  return "User";
}

export function getFirstName(user: UserResource): string {
  if (user.firstName?.trim()) return user.firstName.trim();

  const email = user.primaryEmailAddress?.emailAddress;
  if (email) return email.split("@")[0];

  return getDisplayName(user);
}
