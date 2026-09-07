import { QueryClient } from "@tanstack/react-query";
import { createMMKV } from "react-native-mmkv";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const queryStorage = createMMKV({ id: "specto-query-cache" });

export const clientPersister = createAsyncStoragePersister({
  storage: {
    setItem: (key, value) => queryStorage.set(key, value),
    getItem: (key) => queryStorage.getString(key) ?? null,
    removeItem: (key) => {
      queryStorage.remove(key);
    },
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes (renders cached shows instantly)
      gcTime: 1000 * 60 * 60 * 24 * 7, // Retain on disk for 7 days (Maybe more? Shows are not that big and don't update frequently)
      refetchOnWindowFocus: false,
      refetchOnReconnect: "always",
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes("Rate limit")) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});
