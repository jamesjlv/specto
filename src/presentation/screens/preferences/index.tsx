import { GenreCard } from "@/presentation/components";
import { ScreenHeader } from "@/presentation/components/ui/screen-header";
import { useInfiniteShows } from "@/presentation/hooks/use-infinite-shows";
import { useOnboardingStore } from "@/presentation/store";
import { useMemo } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GENRES_LIST = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

interface OnboardGenresScreenProps {
  onContinue: () => void;
  onSkip?: () => void;
  onBack?: () => void;
}

export function OnboardGenresScreen({ onContinue, onSkip, onBack }: OnboardGenresScreenProps) {
  const insets = useSafeAreaInsets();
  const selectedGenres = useOnboardingStore((state) => state.selectedGenres);
  const toggleGenre = useOnboardingStore((state) => state.toggleGenre);
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);

  const { data } = useInfiniteShows();

  const genreImages = useMemo(() => {
    const map: Record<string, string> = {};
    if (!data?.pages) return map;

    const allShows = data.pages.flat();

    for (const genre of GENRES_LIST) {
      const match = allShows.find(
        (show) =>
          show.genres?.some((g) => g.toLowerCase() === genre.toLowerCase()) &&
          (show.image?.medium || show.image?.original),
      );

      if (match) {
        const raw = match.image?.medium ?? match.image?.original;
        if (raw) {
          map[genre] = raw.replace("http://", "https://");
        }
      }
    }

    return map;
  }, [data?.pages]);

  const handleFinish = () => {
    completeOnboarding();
    onContinue();
  };

  const genrePairs = useMemo(() => {
    const pairs: [string, string?][] = [];
    for (let i = 0; i < GENRES_LIST.length; i += 2) {
      pairs.push([GENRES_LIST[i], GENRES_LIST[i + 1]]);
    }
    return pairs;
  }, []);

  const hasSelection = selectedGenres.length > 0;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader onBack={onBack} />

      <View className="px-5 pb-4">
        <Text className="font-geist-medium text-[28px] leading-7 text-[#FDFDFC]">What do you love?</Text>

        <Text className="mt-3 font-geist-light text-xs leading-4 text-white/80">
          Pick your favorite genres to get{"\n"}personalized recommendations.
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {genrePairs.map(([left, right], idx) => (
          <View key={idx} className="mb-3.5 flex-row gap-3">
            <GenreCard
              name={left}
              imageUrl={genreImages[left]}
              isActive={selectedGenres.includes(left)}
              onPress={() => toggleGenre(left)}
            />
            {right ? (
              <GenreCard
                name={right}
                imageUrl={genreImages[right]}
                isActive={selectedGenres.includes(right)}
                onPress={() => toggleGenre(right)}
              />
            ) : (
              <View className="flex-1" />
            )}
          </View>
        ))}
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 px-5"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 12 }}
      >
        <Pressable
          onPress={hasSelection ? handleFinish : (onSkip ?? handleFinish)}
          style={{
            height: 48,
            width: "100%",
            borderRadius: 24,
            backgroundColor: "#FAC554",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="active:opacity-85"
        >
          <Text
            style={{
              color: "#02141B",
              fontFamily: "Geist-SemiBold",
              fontSize: 16,
            }}
          >
            {hasSelection ? "Continue" : "Skip"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
