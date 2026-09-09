import { View, Text, Pressable, useWindowDimensions, Linking, StyleSheet, Modal, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgIcon, EpisodeRow, CastCard, Skeleton, StateFeedback } from "@/presentation/components";
import { useShowDetail } from "@/presentation/hooks";
import { useFavoritesStore } from "@/presentation/store";
import { IEpisode } from "@/domain/models";
import { useCallback, useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { FlashList } from "@shopify/flash-list";

interface ShowDetailScreenProps {
  showId: number;
  onBack: () => void;
}

export function ShowDetailScreen({ showId, onBack }: ShowDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const heroImageHeight = screenHeight * 0.4;

  const { data, isLoading, isError, refetch } = useShowDetail(showId);

  const isFavorite = useFavoritesStore((state) => Boolean(state.favorites[showId]));

  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const [seeAllEpisodes, setSeeAllEpisodes] = useState(false);
  const [seeAllCast, setSeeAllCast] = useState(false);

  const episodesBySeason = useMemo(() => {
    if (!data?.episodes) {
      return {};
    }

    return data.episodes.reduce(
      (acc, episode) => {
        if (!acc[episode.season]) {
          acc[episode.season] = [];
        }

        acc[episode.season].push(episode);

        return acc;
      },
      {} as Record<number, IEpisode[]>,
    );
  }, [data?.episodes]);

  const seasonsList = useMemo(
    () =>
      Object.keys(episodesBySeason)
        .map(Number)
        .filter((season) => !Number.isNaN(season))
        .sort((a, b) => a - b),
    [episodesBySeason],
  );

  const firstSeason = seasonsList[0];

  const episodeData = useMemo(() => {
    if (!seeAllEpisodes) {
      return episodesBySeason[firstSeason] ?? [];
    }

    return seasonsList.flatMap((season) => episodesBySeason[season] ?? []);
  }, [seeAllEpisodes, episodesBySeason, seasonsList, firstSeason]);

  const renderEpisode = useCallback(
    ({ item, index }: { item: IEpisode; index: number }) => {
      const previousEpisode = episodeData[index - 1];

      const showSeasonHeader = seeAllEpisodes && (!previousEpisode || previousEpisode.season !== item.season);

      return (
        <View>
          {showSeasonHeader && (
            <Text className="mb-1.5 mt-2 font-geist-semibold text-sm leading-5 text-accent">Season {item.season}</Text>
          )}

          <EpisodeRow episode={item} onPress={() => Linking.openURL(item.url)} />
        </View>
      );
    },
    [episodeData, seeAllEpisodes],
  );

  const keyExtractor = useCallback((item: IEpisode) => `Episode_${item.id}`, []);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background px-5" style={{ paddingTop: insets.top + 20 }}>
        <Skeleton style={{ height: heroImageHeight }} className="w-full rounded-2xl" />

        <Skeleton className="mt-2 h-8 w-48 rounded-md" />

        <Skeleton className="mt-2 h-11 w-full rounded-[10px]" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <StateFeedback
        icon="film"
        title="Details Unavailable"
        description="Could not retrieve show information."
        actionTitle="Retry"
        onAction={refetch}
      />
    );
  }

  const { show, cast } = data;

  const rawHero = show.image?.original ?? show.image?.medium;
  const heroImageUri = rawHero ? rawHero.replace("http://", "https://") : null;
  const genresText = show.genres.slice(0, 2).join(" - ") || show.type;
  const yearText = show.premiered ? show.premiered.slice(0, 4) : "";
  const ratingText = show.rating.average ? show.rating.average.toFixed(1) : "";
  const summaryClean = show.summary ? show.summary.replace(/<[^>]*>?/gm, "").trim() : "";
  const networkName = show.network?.name ?? show.webChannel?.name ?? "Broadcast";
  const airDay =
    show.schedule.days.length > 1
      ? `${show.schedule.days.map((weekday) => weekday.slice(0, 3)).join(", ")}`
      : show.schedule.days[0];

  const handlePlay = async () => {
    const targetUrl = show.officialSite ?? show.url;

    if (targetUrl) {
      await Linking.openURL(targetUrl);
    }
  };

  const header = (
    <View>
      <View className="absolute left-0 top-0 w-full" style={{ height: heroImageHeight }}>
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
          colors={["rgba(2, 20, 27, 0.4)", "transparent", "rgba(2, 20, 27, 0.7)", "#02141B"]}
          locations={[0, 0.25, 0.7, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      </View>

      <View
        className="absolute left-[10px] right-4 z-10 flex-row items-center justify-between"
        style={{ top: insets.top + 12 }}
      >
        <Pressable
          onPress={onBack}
          hitSlop={10}
          className="size-9 items-center justify-center rounded-full bg-card active:opacity-80"
        >
          <SvgIcon name="chevron-left" size={20} color="#FDFDFC" />
        </Pressable>

        <Pressable
          onPress={() => toggleFavorite(show)}
          hitSlop={8}
          className="size-9 items-center justify-center rounded-full bg-card active:opacity-80"
        >
          <SvgIcon name="bookmark" size={18} color={isFavorite ? "#FAC554" : "#FDFDFC"} />
        </Pressable>
      </View>

      <View
        className="px-5"
        style={{
          marginTop: heroImageHeight - 55,
        }}
      >
        <Text
          numberOfLines={1}
          className="mb-2 font-geist-medium text-[28px] leading-[34px] tracking-[-0.02px] text-[#FDFDFC]"
          style={{
            textShadowColor: "#000000",
            textShadowOffset: {
              width: 5,
              height: 4,
            },
            textShadowRadius: 10.7,
          }}
        >
          {show.name}
        </Text>

        <View className="mb-2 flex-row items-center">
          <Text className="font-geist text-xs leading-4 tracking-[-0.02px] text-white/80">
            {genresText ? `${genresText} - ` : ""} {yearText ? `${yearText}` : ""}
          </Text>
          {ratingText && (
            <View className="flex-row items-center">
              <SvgIcon
                name="star"
                size={13}
                color="#FAC554"
                style={{
                  marginRight: 4,
                  marginTop: -2,
                }}
              />

              <Text className="font-geist-medium text-xs leading-4 tracking-[-0.02px] text-accent">- {ratingText}</Text>
            </View>
          )}
        </View>

        <View className="mb-2 flex-row items-center gap-3">
          <Pressable
            onPress={handlePlay}
            className="h-[43px] flex-1 flex-row items-center justify-center rounded-[10px] bg-accent active:opacity-85"
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
            onPress={() => toggleFavorite(show)}
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
        </View>

        <Text numberOfLines={4} className="mb-2 mt-2 font-geist text-sm leading-5 tracking-[0.02px] text-white/90">
          {summaryClean}
        </Text>

        <View className="mb-4 mt-4 flex-row justify-between">
          <View className="h-[61px] w-[85px] items-center justify-center rounded-[10px] bg-[#0A1E23] px-1.5">
            <SvgIcon name="calendar" size={16} color="#FAC554" />

            <Text numberOfLines={1} className="mt-1 text-center font-geist text-[10px] text-[#FDFDFC]">
              {airDay}
            </Text>
          </View>

          <View className="h-[61px] w-[85px] items-center justify-center rounded-[10px] bg-[#0A1E23] px-1.5">
            <SvgIcon name="film" size={16} color="#FAC554" />

            <Text numberOfLines={1} className="mt-1 text-center font-geist text-[10px] text-[#FDFDFC]">
              {seasonsList.length} Seasons
            </Text>
          </View>

          <View className="h-[61px] w-[85px] items-center justify-center rounded-[10px] bg-[#0A1E23] px-1.5">
            <SvgIcon name="signal" size={16} color="#FAC554" />

            <Text numberOfLines={1} className="mt-1 text-center font-geist text-[10px] text-[#FDFDFC]">
              {show.status}
            </Text>
          </View>

          <View className="h-[61px] w-[85px] items-center justify-center rounded-[10px] bg-[#0A1E23] px-1.5">
            <SvgIcon name="video-recorder" size={16} color="#FAC554" />

            <Text numberOfLines={1} className="mt-1 text-center font-geist text-[10px] text-[#FDFDFC]">
              {networkName}
            </Text>
          </View>
        </View>

        <View className="mb-2 flex-row items-center justify-between">
          <Text className="font-geist-semibold text-lg leading-7 text-[#FDFDFC]">Episodes</Text>

          <Pressable
            onPress={() => setSeeAllEpisodes((previous) => !previous)}
            hitSlop={8}
            className="flex-row items-center gap-1"
          >
            <Text className="font-geist-semibold text-xs leading-5 text-accent">
              {seeAllEpisodes ? "Hide all" : "See all"}
            </Text>

            <View
              style={{
                transform: [
                  {
                    rotate: seeAllEpisodes ? "90deg" : "-90deg",
                  },
                ],
              }}
            >
              <SvgIcon name="chevron-left" size={13} color="#FAC554" />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );

  const footer =
    cast.length > 0 ? (
      <View className="mt-4 px-5 pb-[60px]">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="font-geist-semibold text-lg leading-7 text-[#FDFDFC]">Cast</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {cast.map((castItem, index) => (
            <CastCard key={index} castItem={castItem} />
          ))}
        </ScrollView>
      </View>
    ) : (
      <View className="h-[60px]" />
    );

  return (
    <View className="flex-1 bg-background">
      <FlashList
        data={episodeData}
        keyExtractor={keyExtractor}
        renderItem={renderEpisode}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={seeAllCast} animationType="slide" transparent>
        <View
          className="flex-1 bg-background px-5"
          style={{
            paddingTop: insets.top + 12,
          }}
        >
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-geist-semibold text-2xl leading-8 text-[#FDFDFC]">All Cast</Text>

            <Pressable onPress={() => setSeeAllCast(false)} hitSlop={8} className="rounded-full bg-card p-2">
              <Text className="font-geist-semibold text-sm leading-5 text-accent">Close</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap justify-between gap-y-3 pb-10">
              {cast.map((castItem, index) => (
                <CastCard key={index} castItem={castItem} />
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
