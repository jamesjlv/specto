import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { IShow } from "@/domain/models";
import { SvgIcon } from "../ui/svg-icon";
import { useFavoritesStore } from "@/presentation/store/use-favorites-store";

interface ShowPosterCardProps {
  show: IShow;
  onPress: () => void;
}

export const ShowPosterCard = React.memo(function ShowPosterCard({ show, onPress }: ShowPosterCardProps) {
  const isFavorite = useFavoritesStore((state) => Boolean(state.favorites[show.id]));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const year = show.premiered ? show.premiered.slice(0, 4) : "TBA";
  const rawPoster = show.image?.medium ?? show.image?.original;
  const posterUrl = rawPoster ? rawPoster.replace("http://", "https://") : null;
  const networkName = show.network?.name ?? show.webChannel?.name;
  const rating = show.rating?.average ? show.rating.average.toFixed(1) : null;

  return (
    <Pressable onPress={onPress} className="mb-3 w-full px-1 active:opacity-90">
      <View className="relative aspect-[2/3] w-full overflow-hidden rounded-[10px] border border-white/15 bg-card">
        {posterUrl ? (
          <Image
            source={{ uri: posterUrl }}
            recyclingKey={posterUrl}
            contentFit="cover"
            priority="high"
            cachePolicy="memory-disk"
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View className="size-full items-center justify-center bg-card">
            <SvgIcon name="film" size={24} color="#8DA1A8" />
          </View>
        )}

        <Pressable
          hitSlop={8}
          onPress={() => toggleFavorite(show)}
          className="absolute right-2 top-2 size-7 items-center justify-center rounded-full bg-[#02141B]/70"
        >
          <SvgIcon name="bookmark" size={13} color={isFavorite ? "#FAC554" : "#FFFFFF"} />
        </Pressable>

        {networkName && (
          <View className="absolute bottom-1.5 left-1.5 rounded bg-[#02141B]/85 px-1.5 py-0.5">
            <Text className="font-geist text-[9px] text-[#FDFDFC]">{networkName}</Text>
          </View>
        )}
      </View>

      <View className="mt-2 flex-row items-center justify-between">
        <Text numberOfLines={1} className="mr-1 flex-1 font-geist-medium text-xs leading-5 text-[#FDFDFC]">
          {show.name}
        </Text>

        {rating && (
          <View className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5">
            <Text className="font-geist text-[9px] leading-3 text-white/90">{rating}</Text>
          </View>
        )}
      </View>

      <Text className="mt-0.5 font-geist text-[10px] leading-4 text-[#7D8790]">
        {year} - {show.status}
      </Text>
    </Pressable>
  );
});
