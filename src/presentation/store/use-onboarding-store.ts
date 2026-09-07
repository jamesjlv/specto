import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({ id: "specto-onboarding-storage" });

const mmkvStorage: StateStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.remove(name),
};

interface OnboardingState {
  selectedGenres: string[];
  isCompleted: boolean;
  toggleGenre: (genre: string) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      selectedGenres: ["Action", "Sci-Fi"],
      isCompleted: false,
      toggleGenre: (genre: string) => {
        const current = get().selectedGenres;
        const exists = current.includes(genre);
        set({
          selectedGenres: exists ? current.filter((g) => g !== genre) : [...current, genre],
        });
      },
      completeOnboarding: () => set({ isCompleted: true }),
      resetOnboarding: () => set({ isCompleted: false, selectedGenres: [] }),
    }),
    {
      name: "specto-onboarding",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
