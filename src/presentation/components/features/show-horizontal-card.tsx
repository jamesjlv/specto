import React from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { IShow } from "@/domain/models";
import { SvgIcon } from "../ui/svg-icon";
import { useFavoritesStore } from "@/presentation/store/use-favorites-store";

interface ShowHorizontalCardProps {
  show: IShow;
  onPress: () => void;
}

export const ShowHorizontalCard = React.memo(function ShowHorizontalCard({ show, onPress }: ShowHorizontalCardProps) {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(show.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const backdropUrl = show.image?.original ?? show.image?.medium;
  const year = show.premiered ? show.premiered.slice(0, 4) : "TBA";
  const rating = show.rating.average ? show.rating.average.toFixed(1) : "—";

  return (
    <Pressable
      onPress={onPress}
      className="relative mr-3 h-36 w-64 overflow-hidden rounded-2xl bg-card active:opacity-90"
    >
      {backdropUrl && (
        <Image
          source={{ uri: backdropUrl }}
          contentFit="cover"
          cachePolicy="memory-disk"
          className="absolute inset-0 size-full"
        />
      )}

      <View className="absolute inset-0 bg-[#06181F]/70" />

      <Pressable
        hitSlop={8}
        onPress={() => toggleFavorite(show)}
        className="absolute right-3 top-3 size-8 items-center justify-center rounded-full bg-background/50 backdrop-blur-md"
      >
        <SvgIcon
          name={isFavorite ? "bookmark-filled" : "bookmark"}
          size={16}
          color={isFavorite ? "#F5B83D" : "#F5F7F8"}
        />
      </Pressable>

      <View className="absolute bottom-3 left-3 right-12">
        <Text numberOfLines={1} className="font-geist-semibold text-lg text-foreground">
          {show.name}
        </Text>
        <Text className="mt-0.5 font-geist text-xs text-muted-foreground">
          {year} • {rating}
        </Text>
      </View>

      <View className="absolute bottom-3 right-3 size-8 items-center justify-center rounded-full bg-accent">
        <SvgIcon name="play" size={14} color="#02141B" />
      </View>
    </Pressable>
  );
});
