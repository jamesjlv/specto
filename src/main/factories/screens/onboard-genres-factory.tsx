import React from "react";
import { router } from "expo-router";
import { OnboardGenresScreen } from "@/presentation/screens";
import { useOnboardingStore } from "@/presentation/store/use-onboarding-store";

export function makeOnboardGenresScreen(): React.JSX.Element {
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);

  const handleFinish = () => {
    completeOnboarding();
    router.replace("/(tabs)");
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(onboarding)");
    }
  };

  return <OnboardGenresScreen onContinue={handleFinish} onSkip={handleFinish} onBack={handleBack} />;
}
