import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { IShowCastItem } from "@/domain/models";

interface CastCardProps {
  castItem: IShowCastItem;
}

export const CastCard = React.memo(function CastCard({ castItem }: CastCardProps) {
  const profileUrl = castItem.person.image?.medium ?? castItem.person.image?.original;

  return (
    <View className="mr-3 w-[111px]">
      <View className="relative h-[156px] w-[111px] overflow-hidden rounded bg-white/10">
        {profileUrl && (
          <Image
            source={{ uri: profileUrl }}
            contentFit="cover"
            cachePolicy="memory-disk"
            style={StyleSheet.absoluteFill}
          />
        )}
      </View>

      <Text numberOfLines={1} className="mt-2 font-geist-semibold text-xs leading-4 tracking-[0.02px] text-[#FDFDFC]">
        {castItem.person.name}
      </Text>

      <View className="mt-0.5 flex-row flex-wrap items-center">
        <Text className="mr-1 font-geist-semibold text-[10px] tracking-[0.02px] text-[#7D8790]">as</Text>
        <Text numberOfLines={1} className="flex-1 font-geist-semibold text-[10px] tracking-[0.02px] text-[#FDFDFC]">
          {castItem.character.name}
        </Text>
      </View>
    </View>
  );
});
