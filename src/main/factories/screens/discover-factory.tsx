import React from "react";
import { router } from "expo-router";
import { DiscoverScreen } from "@/presentation/screens";

export function makeDiscoverScreen(): React.JSX.Element {
  return <DiscoverScreen onSelectShow={(showId) => router.push(`/show/${showId}`)} />;
}
