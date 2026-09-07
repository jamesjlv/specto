// src/presentation/hooks/use-schedule-shows.ts
import { useQuery } from "@tanstack/react-query";
import { manufactureRemoteGetShowSchedule, manufactureRemoteSearchShows } from "@/main";
import { IShow } from "@/domain/models";

interface ScheduleRawEpisode {
  id: number;
  show?: IShow;
  _embedded?: {
    show?: IShow;
  };
}

export function useScheduleShows() {
  return useQuery<IShow[], Error>({
    queryKey: ["shows", "feed", "curated"],
    queryFn: async () => {
      const scheduleService = manufactureRemoteGetShowSchedule("schedule");
      const showsMap = new Map<number, IShow>();

      try {
        const rawItems = (await scheduleService.exec({})) as unknown as ScheduleRawEpisode[];

        if (Array.isArray(rawItems)) {
          for (const item of rawItems) {
            // Check both item.show (TVMaze standard) and item._embedded.show (HAL standard)
            const show = item.show ?? item._embedded?.show;
            if (show && show.image && !showsMap.has(show.id)) {
              showsMap.set(show.id, show);
            }
          }
        }
      } catch (err) {
        console.warn("[useScheduleShows] Live schedule empty, falling back to curated feed:", err);
      }

      // If today's broadcast schedule has no episodes, load the design's sci-fi series (Foundation, Silo, etc.)
      if (showsMap.size < 3) {
        const searchService = manufactureRemoteSearchShows();
        const searchResults = await searchService.exec({ q: "space" });
        if (Array.isArray(searchResults)) {
          for (const item of searchResults) {
            if (item.show && item.show.image && !showsMap.has(item.show.id)) {
              showsMap.set(item.show.id, item.show);
            }
          }
        }
      }

      const results = Array.from(showsMap.values());
      if (results.length === 0) {
        throw new Error("No shows available at this time.");
      }

      return results;
    },
    staleTime: 1000 * 60 * 15,
  });
}
