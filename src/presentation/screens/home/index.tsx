import { useMemo } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScheduleShows } from "@/presentation/hooks/use-schedule-shows";
import { useFavoritesStore } from "@/presentation/store";
import { ShowCompactCard, SvgIcon } from "@/presentation/components";
import { Skeleton } from "@/presentation/components/ui";
import { StateFeedback } from "@/presentation/components/ui/state-feedback";

const BG_COLOR = "#02141B";

interface HomeScreenProps {
  onSelectShow: (showId: number) => void;
  onSeeAllTrending?: () => void;
  onSeeAllUpcoming?: () => void;
}

export function HomeScreen({ onSelectShow, onSeeAllTrending, onSeeAllUpcoming }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const heroImageHeight = screenHeight * 0.4;

  const { data: shows, isLoading, isError, refetch } = useScheduleShows();
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFeaturedFavorite = useFavoritesStore((state) =>
    Boolean(featuredShow?.id && state.favorites[featuredShow.id]),
  );

  const featuredShow = useMemo(() => shows?.[0], [shows]);
  const trendingShows = useMemo(() => shows?.slice(1, 8) ?? [], [shows]);
  const upcomingShows = useMemo(() => shows?.slice(8, 16) ?? [], [shows]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: BG_COLOR, paddingHorizontal: 25, paddingTop: insets.top + 20 }}>
        <Skeleton style={{ height: heroImageHeight, width: "100%", borderRadius: 16 }} />
        <Skeleton style={{ marginTop: 24, height: 24, width: 120, borderRadius: 6 }} />
        <View style={{ marginTop: 14, flexDirection: "row", gap: 12 }}>
          <Skeleton style={{ width: 103, height: 139, borderRadius: 10 }} />
          <Skeleton style={{ width: 103, height: 139, borderRadius: 10 }} />
          <Skeleton style={{ width: 103, height: 139, borderRadius: 10 }} />
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
      style={{ flex: 1, backgroundColor: BG_COLOR }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View style={{ height: heroImageHeight, width: "100%", position: "absolute", top: 0, left: 0 }}>
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

      <View style={{ marginLeft: 25, marginTop: insets.top }}>
        <Image
          source={require("@/assets/images/logo.png")}
          contentFit="contain"
          priority="high"
          style={{ width: 104, height: 24 }}
        />
      </View>

      <View style={{ marginLeft: 25, marginTop: 186 }}>
        <Text
          style={{
            color: "#FAC554",
            fontFamily: "Geist-Medium",
            fontSize: 12,
            lineHeight: 14,
            letterSpacing: -0.02,
            marginBottom: 6,
          }}
        >
          FEATURED
        </Text>

        <Text
          numberOfLines={1}
          style={{
            color: "#FDFDFC",
            fontFamily: "Geist-Medium",
            fontSize: 30,
            lineHeight: 34,
            letterSpacing: -0.02,
            textShadowColor: "#000000",
            textShadowOffset: { width: 5, height: 4 },
            textShadowRadius: 10.7,
            paddingRight: 25,
            marginBottom: 8,
          }}
        >
          {featuredShow.name}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          <Text
            style={{
              color: "rgba(253, 253, 252, 0.80)",
              fontFamily: "Geist-Regular",
              fontSize: 12,
              letterSpacing: -0.02,
            }}
          >
            {genresText} - {yearText} -{" "}
          </Text>
          <SvgIcon name="star" size={13} color="#FAC554" style={{ marginRight: 4 }} />
          <Text
            style={{
              color: "#FAC554",
              fontFamily: "Geist-Medium",
              fontSize: 12,
              letterSpacing: -0.02,
            }}
          >
            {ratingText}
          </Text>
        </View>

        <Text
          numberOfLines={3}
          style={{
            width: 331,
            maxHeight: 60,
            color: "rgba(253, 253, 252, 0.90)",
            fontFamily: "Geist-Regular",
            fontSize: 14,
            lineHeight: 20,
            letterSpacing: 0.02,
            marginBottom: 12,
          }}
        >
          {summaryClean}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, width: "100%" }}>
          <Pressable
            onPress={() => onSelectShow(featuredShow.id)}
            style={{
              width: "45%",
              height: 43,
              borderRadius: 10,
              backgroundColor: "#FAC554",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="active:opacity-85"
          >
            <SvgIcon name="play" size={16} color="#02141B" style={{ marginRight: 8 }} />
            <Text
              style={{
                color: "#02141B",
                fontFamily: "Geist-SemiBold",
                fontSize: 14,
              }}
            >
              Play
            </Text>
          </Pressable>
          <Pressable
            onPress={() => toggleFavorite(featuredShow)}
            style={{
              width: "45%",
              height: 43,
              borderRadius: 10,
              backgroundColor: isFeaturedFavorite ? "rgba(250, 197, 84, 0.15)" : "rgba(11, 32, 39, 0.85)",
              borderWidth: 1,
              borderColor: isFeaturedFavorite ? "#FAC554" : "rgba(253, 253, 252, 0.20)",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="active:opacity-85"
          >
            <SvgIcon
              name={isFeaturedFavorite ? "check" : "plus"}
              size={16}
              color={isFeaturedFavorite ? "#FAC554" : "#FDFDFC"}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: isFeaturedFavorite ? "#FAC554" : "#FDFDFC",
                fontFamily: "Geist-SemiBold",
                fontSize: 14,
              }}
            >
              {isFeaturedFavorite ? "In My List" : "My List"}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={{ marginTop: 19 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 25,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              color: "#FDFDFC",
              fontFamily: "Geist-SemiBold",
              fontSize: 18,
              lineHeight: 32,
              letterSpacing: 0,
            }}
          >
            Trending now
          </Text>
          <Pressable onPress={onSeeAllTrending} hitSlop={8}>
            <Text
              style={{
                color: "#FAC554",
                fontFamily: "Geist-SemiBold",
                fontSize: 12,
                lineHeight: 16,
                letterSpacing: 0.02,
              }}
            >
              See all →
            </Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 25, gap: 12 }}
        >
          {trendingShows.map((show) => (
            <ShowCompactCard key={show.id} show={show} onPress={() => onSelectShow(show.id)} />
          ))}
        </ScrollView>
      </View>

      <View style={{ marginTop: 24 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 25,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              color: "#FDFDFC",
              fontFamily: "Geist-SemiBold",
              fontSize: 18,
              lineHeight: 32,
              letterSpacing: 0,
            }}
          >
            Upcoming
          </Text>
          <Pressable onPress={onSeeAllUpcoming} hitSlop={8}>
            <Text
              style={{
                color: "#FAC554",
                fontFamily: "Geist-SemiBold",
                fontSize: 12,
                lineHeight: 16,
                letterSpacing: 0.02,
              }}
            >
              See all →
            </Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 25, gap: 12 }}
        >
          {upcomingShows.map((show) => (
            <ShowCompactCard key={show.id} show={show} onPress={() => onSelectShow(show.id)} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
