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
  return (
    <Pressable
      onPress={onPress}
      className={`relative flex-1 aspect-[158/111] overflow-hidden rounded-lg border bg-[#7D8790] active:opacity-90 ${
        isActive ? "border-[#FAC554]" : "border-white/20"
      }`}
    >
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          contentFit="cover"
          cachePolicy="memory-disk"
          style={StyleSheet.absoluteFill}
        />
      )}

      <LinearGradient
        colors={["transparent", "rgba(2, 20, 27, 0.85)"]}
        locations={[0.3, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {isActive && (
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "#FAC554",
            borderRadius: 999,
            width: 20,
            height: 20,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <SvgIcon name="check" size={12} color="#02141B" />
        </View>
      )}

      <Text
        numberOfLines={1}
        style={{
          position: "absolute",
          bottom: 8,
          left: 8,
          right: 8,
          color: "#FDFDFC",
          fontFamily: "Geist-Medium",
          fontSize: 14,
          fontWeight: "500",
          zIndex: 10,
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
