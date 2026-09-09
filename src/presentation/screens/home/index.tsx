import { useMemo } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useScheduleShows } from "@/presentation/hooks/use-schedule-shows";
import { useFavoritesStore, useOnboardingStore } from "@/presentation/store";
import { ShowCompactCard, SvgIcon } from "@/presentation/components";
import { Skeleton } from "@/presentation/components/ui";
import { StateFeedback } from "@/presentation/components/ui/state-feedback";
import { IShow } from "@/domain/models";
import { shuffle } from "@/presentation/helpers/array";

// Used in gradient for now.
const BG_COLOR = "#02141B";

function FeaturedFavoriteButton({ show }: { show?: IShow | null }) {
  const isFavorite = useFavoritesStore((state) => (show?.id ? Boolean(state.favorites[Number(show.id)]) : false));

  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return (
    <Pressable
      onPress={() => {
        if (show?.id) {
          toggleFavorite(show);
        }
      }}
      hitSlop={8}
      className={`h-[43px] w-[45%] flex-row items-center justify-center rounded-[10px] border ${
        isFavorite
          ? "border-[#FAC554] bg-[rgba(250,197,84,0.15)]"
          : "border-[rgba(253,253,252,0.20)] bg-[rgba(11,32,39,0.85)]"
      } active:opacity-80`}
    >
      <SvgIcon
        name={isFavorite ? "check" : "plus"}
        size={16}
        color={isFavorite ? "#FAC554" : "#FDFDFC"}
        style={{ marginRight: 8 }}
      />

      <Text className={`font-[Geist-SemiBold] text-[14px] ${isFavorite ? "text-[#FAC554]" : "text-[#FDFDFC]"}`}>
        {isFavorite ? "In My List" : "My List"}
      </Text>
    </Pressable>
  );
}

interface HomeScreenProps {
  onSelectShow: (showId: number) => void;
  onSeeAllTrending?: () => void;
  onSeeAllUpcoming?: () => void;
}

export function HomeScreen({ onSelectShow, onSeeAllTrending, onSeeAllUpcoming }: HomeScreenProps) {
  const { data: shows, isLoading, isError, refetch } = useScheduleShows();
  const selectedGenres = useOnboardingStore((state) => state.selectedGenres);
  const featuredShow = useMemo(() => {
    if (!shows?.length) {
      return null;
    }

    return shows[Math.floor(Math.random() * shows.length)];
  }, [shows]);

  const trendingShows = useMemo(() => {
    if (!shows?.length) {
      return [];
    }

    // No preferences we set them completely random
    if (!selectedGenres.length) {
      return shuffle(shows).slice(0, 7);
    }

    const normalizedGenres = new Set(selectedGenres.map((genre) => genre.toLowerCase()));

    const personalizedShows = [];
    const otherShows = [];

    for (const show of shows) {
      const matchesGenre = show.genres.some((genre) => normalizedGenres.has(genre.toLowerCase()));

      if (matchesGenre) {
        personalizedShows.push(show);
      } else {
        otherShows.push(show);
      }
    }

    // preferred genres first from the onboarding, then fill remaining randomly
    return [...shuffle(personalizedShows), ...shuffle(otherShows)].slice(0, 7);
  }, [shows, selectedGenres]);

  const upcomingShows = useMemo(() => shows?.slice(8, 16) ?? [], [shows]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#02141B] px-[25px] pt-[20px]">
        <Skeleton className="h-[40%] w-full rounded-[16px]" />

        <Skeleton className="mt-[24px] h-[24px] w-[120px] rounded-[6px]" />

        <View className="mt-[14px] flex-row gap-[12px]">
          <Skeleton className="h-[139px] w-[103px] rounded-[10px]" />
          <Skeleton className="h-[139px] w-[103px] rounded-[10px]" />
          <Skeleton className="h-[139px] w-[103px] rounded-[10px]" />
        </View>
      </View>
    );
  }

  if (isError || !featuredShow) {
    return (
      <StateFeedback
        icon="film"
        title="Failed to Load Shows"
        description="Could not synchronize programming feed from TVMaze."
        actionTitle="Retry"
        onAction={refetch}
      />
    );
  }

  const heroImageUri = featuredShow.image?.original ?? featuredShow.image?.medium;

  const genresText = featuredShow.genres.slice(0, 2).join(" - ") || "Sci-Fi - Drama";

  const yearText = featuredShow.premiered ? featuredShow.premiered.slice(0, 4) : "2021";

  const ratingText = featuredShow.rating.average ? featuredShow.rating.average.toFixed(1) : "8.5";

  const summaryClean = featuredShow.summary ? featuredShow.summary.replace(/<[^>]*>?/gm, "").trim() : "";

  return (
    <ScrollView
      className="flex-1 bg-[#02141B]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View className="absolute left-0 top-0 h-[40%] w-full">
        {heroImageUri && (
          <Image
            source={{ uri: heroImageUri }}
            contentFit="cover"
            priority="high"
            cachePolicy="memory-disk"
            style={StyleSheet.absoluteFill}
          />
        )}

        <LinearGradient
          colors={["rgba(2, 20, 27, 0.3)", "transparent", "rgba(2, 20, 27, 0.75)", BG_COLOR]}
          locations={[0, 0.3, 0.7, 1.0]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      </View>

      <View className="ml-[25px] mt-[60px]">
        <Image
          source={require("@/assets/images/logo.png")}
          contentFit="contain"
          priority="high"
          style={{ width: 104, height: 24 }}
        />
      </View>

      <View className="ml-[25px] mt-[186px]">
        <Text className="mb-[6px] font-[Geist-Medium] text-[12px] leading-[14px] tracking-[-0.02px] text-[#FAC554]">
          FEATURED
        </Text>

        <Text
          numberOfLines={1}
          className="mb-[8px] pr-[25px] font-[Geist-Medium] text-[30px] leading-[34px] tracking-[-0.02px] text-[#FDFDFC]"
        >
          {featuredShow.name}
        </Text>

        <View className="mb-[8px] flex-row items-center">
          <Text className="font-[Geist-Regular] text-[12px] tracking-[-0.02px] text-[rgba(253,253,252,0.80)]">
            {genresText} - {yearText} -{" "}
          </Text>

          <SvgIcon name="star" size={13} color="#FAC554" style={{ marginRight: 4 }} />

          <Text className="font-[Geist-Medium] text-[12px] tracking-[-0.02px] text-[#FAC554]">{ratingText}</Text>
        </View>

        <Text
          numberOfLines={3}
          className="mb-[12px] max-h-[60px] w-[331px] font-[Geist-Regular] text-[14px] leading-[20px] tracking-[0.02px] text-[rgba(253,253,252,0.90)]"
        >
          {summaryClean}
        </Text>

        <View className="w-full flex-row items-center gap-[12px]">
          <Pressable
            onPress={() => onSelectShow(featuredShow.id)}
            className="h-[43px] w-[45%] flex-row items-center justify-center rounded-[10px] bg-[#FAC554] active:opacity-85"
          >
            <SvgIcon name="discover" size={16} color="#02141B" style={{ marginRight: 8 }} />

            <Text className="font-[Geist-SemiBold] text-[14px] text-[#02141B]">Details</Text>
          </Pressable>

          <FeaturedFavoriteButton show={featuredShow} />
        </View>
      </View>

      <View className="mt-[19px]">
        <View className="mb-[12px] flex-row items-center justify-between px-[25px]">
          <Text className="font-[Geist-SemiBold] text-[18px] leading-[32px] text-[#FDFDFC]">Trending now</Text>

          <Pressable onPress={onSeeAllTrending} hitSlop={8}>
            <Text className="font-[Geist-SemiBold] text-[12px] leading-[16px] tracking-[0.02px] text-[#FAC554]">
              See all →
            </Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 25,
            gap: 12,
          }}
        >
          {trendingShows.map((show) => (
            <ShowCompactCard key={show.id} show={show} onPress={() => onSelectShow(show.id)} />
          ))}
        </ScrollView>
      </View>

      <View className="mt-[24px]">
        <View className="mb-[12px] flex-row items-center justify-between px-[25px]">
          <Text className="font-[Geist-SemiBold] text-[18px] leading-[32px] text-[#FDFDFC]">Upcoming</Text>

          <Pressable onPress={onSeeAllUpcoming} hitSlop={8}>
            <Text className="font-[Geist-SemiBold] text-[12px] leading-[16px] tracking-[0.02px] text-[#FAC554]">
              See all →
            </Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 25,
            gap: 12,
          }}
        >
          {upcomingShows.map((show) => (
            <ShowCompactCard key={show.id} show={show} onPress={() => onSelectShow(show.id)} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
