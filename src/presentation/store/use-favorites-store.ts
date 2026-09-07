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
  toggleFavorite: (show?: IShow | null) => void;
  isFavorite: (showId?: number | null) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},
      toggleFavorite: (show?: IShow | null) => {
        if (!show?.id) return;
        const targetId = Number(show.id);

        set((state) => {
          const next = { ...state.favorites };
          if (next[targetId]) {
            delete next[targetId];
          } else {
            next[targetId] = show;
          }
          return { favorites: next };
        });
      },
      isFavorite: (showId?: number | null) => {
        if (!showId) return false;
        return Boolean(get().favorites[Number(showId)]);
      },
    }),
    {
      name: "specto-favorites",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
