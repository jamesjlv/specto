import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { IShow } from "@/domain/models";
import { SvgIcon } from "../ui/svg-icon";
import { useFavoritesStore } from "@/presentation/store/use-favorites-store";

interface ShowCompactCardProps {
  show: IShow;
  onPress: () => void;
}

export const ShowCompactCard = React.memo(function ShowCompactCard({ show, onPress }: ShowCompactCardProps) {
  const isFavorite = useFavoritesStore((state) => Boolean(state.favorites[show.id]));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const posterUrl = show.image?.medium ?? show.image?.original;

  return (
    <Pressable
      onPress={onPress}
      className="h-44 w-32 justify-between overflow-hidden rounded-2xl border border-border/40 bg-card p-2.5 active:opacity-90"
    >
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {posterUrl && (
          <Image
            source={{ uri: posterUrl }}
            contentFit="cover"
            cachePolicy="memory-disk"
            style={StyleSheet.absoluteFill}
          />
        )}
        <LinearGradient
          colors={["transparent", "rgba(2, 20, 27, 0.85)"]}
          locations={[0.5, 1.0]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View className="items-end">
        <Pressable
          hitSlop={8}
          onPress={() => toggleFavorite(show)}
          className="size-7 items-center justify-center rounded-full bg-background/60 backdrop-blur-md"
        >
          <SvgIcon name="bookmark" size={14} color={isFavorite ? "#F5B83D" : "#F5F7F8"} />
        </Pressable>
      </View>

      <Text numberOfLines={1} className="font-geist-semibold text-xs text-foreground">
        {show.name}
      </Text>
    </Pressable>
  );
});
