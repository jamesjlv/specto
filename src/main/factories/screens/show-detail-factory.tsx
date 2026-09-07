import React from "react";
import { router } from "expo-router";
import { ShowDetailScreen } from "@/presentation/screens";

interface MakeShowDetailScreenProps {
  showId: number;
}

export function makeShowDetailScreen({ showId }: MakeShowDetailScreenProps): React.JSX.Element {
  return <ShowDetailScreen showId={showId} onBack={() => router.back()} />;
}
