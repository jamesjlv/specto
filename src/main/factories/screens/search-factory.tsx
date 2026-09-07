import React from "react";
import { router } from "expo-router";
import { SearchScreen } from "@/presentation/screens";

export function makeSearchScreen(): React.JSX.Element {
  return <SearchScreen onSelectShow={(showId) => router.push(`/show/${showId}`)} />;
}
