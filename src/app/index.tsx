import { AuthScreen } from "@/components/auth/auth-screen";
import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";

export default function Index() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) return <Redirect href="/(tabs)/home" />;
  return <AuthScreen />;
}
