// src/presentation/hooks/use-show-detail.ts
import { useQuery } from "@tanstack/react-query";
import {
  manufactureRemoteGetShowInfo,
  manufactureRemoteGetShowEpisodes,
  manufactureRemoteGetShowCast,
} from "@/main/services";
import { IShow, IEpisode, TShowCast } from "@/domain/models";

export interface ShowDetailData {
  show: IShow;
  episodes: IEpisode[];
  cast: TShowCast;
}

export function useShowDetail(showId: number) {
  return useQuery<ShowDetailData, Error>({
    queryKey: ["shows", "detail", showId],
    queryFn: async () => {
      if (!showId || isNaN(showId)) {
        throw new Error("Invalid show identifier.");
      }

      const showInfoPromise = manufactureRemoteGetShowInfo(showId).exec({});
      const episodesPromise = manufactureRemoteGetShowEpisodes(showId).exec({});
      const castPromise = manufactureRemoteGetShowCast(showId).exec({});

      // Allow cast or episodes to be empty without breaking the whole page
      const [showResult, episodesResult, castResult] = await Promise.allSettled([
        showInfoPromise,
        episodesPromise,
        castPromise,
      ]);

      if (showResult.status === "rejected") {
        throw new Error("Failed to load show metadata.");
      }

      const show = showResult.value;
      const episodes = episodesResult.status === "fulfilled" ? episodesResult.value : [];
      const cast = castResult.status === "fulfilled" ? (castResult.value as unknown as TShowCast) : [];

      return { show, episodes, cast };
    },
    staleTime: 1000 * 60 * 15,
  });
}
