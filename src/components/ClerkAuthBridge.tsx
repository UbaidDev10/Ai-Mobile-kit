import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";

import { setAuthTokenGetter } from "@/services/authToken";

export default function ClerkAuthBridge() {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(() => getToken());
    return () => setAuthTokenGetter(null);
  }, [getToken]);

  return null;
}
