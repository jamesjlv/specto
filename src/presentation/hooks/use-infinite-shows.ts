import { useInfiniteQuery } from "@tanstack/react-query";
import { manufactureRemoteGetShows } from "@/main";
import { IShow } from "@/domain/models";

export function useInfiniteShows() {
  return useInfiniteQuery<IShow[], Error>({
    queryKey: ["shows", "infinite"],
    queryFn: async ({ pageParam = 0 }) => {
      const service = manufactureRemoteGetShows();
      return service.exec({ page: pageParam as number });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length === 0) {
        return undefined;
      }
      return allPages.length;
    },
    staleTime: 1000 * 60 * 15,
  });
}
