import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { IEpisode } from "@/domain/models";
import { SvgIcon } from "../ui/svg-icon";

interface EpisodeRowProps {
  episode: IEpisode;
  onPress?: () => void;
}

export const EpisodeRow = React.memo(function EpisodeRow({ episode, onPress }: EpisodeRowProps) {
  const rawImage = episode.image?.medium ?? episode.image?.original;
  const thumbnail = rawImage ? rawImage.replace("http://", "https://") : null;
  const runtime = episode.runtime ? `${episode.runtime} min` : "—";
  const epCode = `${String(episode.number ?? 0).padStart(2, "0")}`;

  return (
    <Pressable
      onPress={onPress}
      className="mb-2 h-[65px] flex-row items-center justify-between overflow-hidden rounded-lg bg-white/5 pr-2.5 active:opacity-85"
    >
      <View className="flex-1 flex-row items-center">
        <View className="relative h-[65px] w-[116px] bg-[#0A1E23]">
          {thumbnail ? (
            <Image
              source={{ uri: thumbnail }}
              contentFit="cover"
              cachePolicy="memory-disk"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View className="size-full items-center justify-center">
              <SvgIcon name="video-recorder" size={16} color="#8DA1A8" />
            </View>
          )}
        </View>

        <View className="flex-1 justify-center pl-3">
          <Text numberOfLines={1} className="font-geist-semibold text-[11px] leading-4 tracking-[0.02px] text-white/80">
            {epCode} - {episode.name}
          </Text>

          <Text className="font-geist text-[10px]  tracking-[0.02px] text-[#7D8790] ">
            Season {episode.season} - {runtime}
          </Text>

          {episode.airdate && (
            <Text className="mt-0.5 font-geist text-[10px]  tracking-[0.02px] text-[#7D8790]">{episode.airdate}</Text>
          )}
        </View>
      </View>

      <View className="rotate-180">
        <SvgIcon name="chevron-left" size={16} color="#8DA1A8" />
      </View>
    </Pressable>
  );
});
