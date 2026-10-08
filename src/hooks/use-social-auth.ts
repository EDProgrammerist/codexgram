import { isClerkAPIResponseError, useAuth, useSSO } from "@clerk/expo";
import { useHostedAuth } from "@clerk/expo/hosted-auth";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

export type AuthProvider = "Google" | "Apple";

export function useSocialAuth() {
  const { isLoaded } = useAuth();
  const { startSSOFlow } = useSSO();
  const { startHostedAuth } = useHostedAuth();
  const locked = useRef(false);
  const [pending, setPending] = useState<AuthProvider | "completion" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsCompletion, setNeedsCompletion] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync().catch(() => {});
    return () => { void WebBrowser.coolDownAsync().catch(() => {}); };
  }, []);

  async function run(provider: AuthProvider | "completion") {
    if (!isLoaded || locked.current) return;
    locked.current = true;
    setPending(provider);
    setError(null);
    try {
      const redirectUrl = AuthSession.makeRedirectUri({ scheme: "codexgram", path: "sso-callback" });
      if (provider === "completion") {
        await startHostedAuth({ redirectUrl });
        return;
      }
      setNeedsCompletion(false);
      const result = await startSSOFlow({
        strategy: provider === "Google" ? "oauth_google" : "oauth_apple",
        redirectUrl,
      });
      if (result.createdSessionId && result.setActive) {
        await result.setActive({ session: result.createdSessionId });
      } else if (result.authSessionResult?.type === "success") {
        setNeedsCompletion(Platform.OS !== "web");
        setError("Your account needs an additional verification step before sign-in can finish.");
      } else if (!result.authSessionResult) {
        setError("Sign-in is still loading. Please try again in a moment.");
      }
      // Closing or cancelling the browser leaves the welcome screen unchanged.
    } catch (err) {
      const code = typeof err === "object" && err !== null && "code" in err ? err.code : null;
      if (code === "ERR_CANCELED" || code === "ERR_REQUEST_CANCELED") return;
      setError(isClerkAPIResponseError(err)
        ? err.errors[0]?.longMessage || err.errors[0]?.message || "Sign-in failed. Please try again."
        : "Could not finish sign-in. Check your connection and try again.");
    } finally {
      locked.current = false;
      setPending(null);
    }
  }

  return { pending, error, needsCompletion, ready: isLoaded, signIn: (provider: AuthProvider) => run(provider), completeSignIn: () => run("completion") };
}
