import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";
import { IShow } from "@/domain/models";

const storage = createMMKV({ id: "specto-favorites-storage" });

const mmkvStorage: StateStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.remove(name),
};

interface FavoritesState {
  favorites: Record<number, IShow>;
  toggleFavorite: (show: IShow) => void;
  isFavorite: (showId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},
      toggleFavorite: (show: IShow) => {
        set((state) => {
          const next = { ...state.favorites };
          if (next[show.id]) {
            delete next[show.id];
          } else {
            next[show.id] = show;
          }
          return { favorites: next };
        });
      },
      isFavorite: (showId: number) => Boolean(get().favorites[showId]),
    }),
    {
      name: "specto-favorites",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
