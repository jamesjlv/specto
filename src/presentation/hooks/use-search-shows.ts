import { useQuery } from "@tanstack/react-query";
import { manufactureRemoteSearchShows } from "@/main/services";
import { TMultipleShowSearch } from "@/domain/models";

export function useSearchShows(searchTerm: string) {
  const query = searchTerm.trim();

  return useQuery<TMultipleShowSearch, Error>({
    queryKey: ["shows", "search", query],
    queryFn: async () => {
      const service = manufactureRemoteSearchShows();
      return service.exec({ q: query });
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 60 * 24, // 24 hours persistence
    retry: (failureCount, error) => {
      if (error.message.includes("Rate limit")) return false;
      return failureCount < 2;
    },
  });
}
