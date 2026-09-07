import React from "react";
import { router } from "expo-router";
import { HomeScreen } from "@/presentation/screens";

export function makeHomeScreen(): React.JSX.Element {
  return (
    <HomeScreen
      onSelectShow={(showId) => router.push(`/show/${showId}`)}
      onSeeAllTrending={() => router.push("/(tabs)/discover")}
      onSeeAllUpcoming={() => router.push("/(tabs)/discover")}
    />
  );
}
