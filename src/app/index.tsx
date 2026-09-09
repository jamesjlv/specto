import { Redirect } from "expo-router";
import { useOnboardingStore } from "@/presentation/store/use-onboarding-store";

export default function IndexRoute() {
  const isCompleted = useOnboardingStore((state) => state.isCompleted);

  // If already onboarded, jump straight into Home tabs
  if (isCompleted) {
    return <Redirect href="/(tabs)" />;
  }

  // Otherwise, start the onboarding flow
  return <Redirect href="/(onboarding)" />;
}
