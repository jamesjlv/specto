import React from "react";
import { router } from "expo-router";
import { FavoritesScreen } from "@/presentation/screens";

export function makeFavoritesScreen(): React.JSX.Element {
  return (
    <FavoritesScreen
      onSelectShow={(showId) => router.push(`/show/${showId}`)}
      onExplore={() => router.push("/(tabs)/discover")}
    />
  );
}
