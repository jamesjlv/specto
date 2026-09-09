import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({ id: "specto-onboarding-storage" });

const mmkvStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.remove(name),
};

interface OnboardingState {
  selectedGenres: string[];
  isCompleted: boolean;
  setSelectedGenres: (genres: string[]) => void;
  toggleGenre: (genre: string) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      selectedGenres: [],
      isCompleted: false,
      setSelectedGenres: (genres) =>
        set({
          selectedGenres: [...new Set(genres)],
        }),
      toggleGenre: (genre) => {
        const current = get().selectedGenres;
        const exists = current.includes(genre);
        set({
          selectedGenres: exists ? current.filter((g) => g !== genre) : [...current, genre],
        });
      },
      completeOnboarding: () => set({ isCompleted: true }),
      resetOnboarding: () =>
        set({
          isCompleted: false,
          selectedGenres: [],
        }),
    }),
    {
      name: "specto-onboarding",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
