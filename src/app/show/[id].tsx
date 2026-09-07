import { useLocalSearchParams } from "expo-router";
import { makeShowDetailScreen } from "@/main/factories/screens";

export default function ShowDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const showId = Number(id);

  return makeShowDetailScreen({ showId });
}
