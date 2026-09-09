import { useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SvgIcon } from "../ui/svg-icon";

interface GenreCardProps {
  name: string;
  imageUrl?: string;
  isActive: boolean;
  onPress: () => void;
}

export function GenreCard({ name, imageUrl, isActive, onPress }: GenreCardProps) {
  const [imageError, setImageError] = useState(false);

  const showPlaceholder = !imageUrl || imageError;

  return (
    <Pressable
      onPress={onPress}
      className={`relative flex-1 aspect-[158/111] overflow-hidden rounded-lg border bg-[#7D8790] active:opacity-90 ${
        isActive ? "border-[#FAC554]" : "border-white/20"
      }`}
    >
      {showPlaceholder ? (
        <View className="absolute inset-0 items-center justify-center bg-[#0B2027] overflow-hidden rounded-lg">
          <Text className="font-geist-semibold text-[56px] leading-[64px] text-white/20">
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
      ) : (
        <Image
          source={{ uri: imageUrl }}
          contentFit="cover"
          cachePolicy="memory-disk"
          onError={() => setImageError(true)}
          style={{ ...StyleSheet.absoluteFill, overflow: "hidden", borderRadius: 8 }}
        />
      )}

      <LinearGradient
        colors={["transparent", "rgba(2, 20, 27, 0.85)"]}
        locations={[0.3, 1]}
        style={{ ...StyleSheet.absoluteFill, overflow: "hidden", borderRadius: 8 }}
        pointerEvents="none"
      />

      {isActive && (
        <View className="absolute right-[10px] top-[10px] z-10 h-5 w-5 items-center justify-center rounded-full bg-[#FAC554]">
          <SvgIcon name="check" size={12} color="#02141B" />
        </View>
      )}

      <Text
        numberOfLines={1}
        className="absolute bottom-2 left-2 right-2 z-10 font-geist-medium text-[14px] text-[#FDFDFC]"
        style={{
          textShadowColor: "rgba(0, 0, 0, 0.9)",
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 3,
        }}
      >
        {name}
      </Text>
    </Pressable>
  );
}
