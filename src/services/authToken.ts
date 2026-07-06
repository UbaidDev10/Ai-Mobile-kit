type TokenGetter = () => Promise<string | null>;

let getter: TokenGetter | null = null;

export function setAuthTokenGetter(fn: TokenGetter | null) {
  getter = fn;
}

export async function getAuthToken(): Promise<string | null> {
  if (!getter) return null;
  return getter();
}
