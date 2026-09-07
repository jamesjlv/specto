import React from "react";
import { router } from "expo-router";
import { OnboardingScreen } from "@/presentation/screens";
import { useOnboardingStore } from "@/presentation/store/use-onboarding-store";

export function makeOnboardingScreen(): React.JSX.Element {
  const isCompleted = useOnboardingStore((state) => state.isCompleted);

  return (
    <OnboardingScreen
      onComplete={() => {
        if (isCompleted) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(onboarding)/preferences");
        }
      }}
    />
  );
}
