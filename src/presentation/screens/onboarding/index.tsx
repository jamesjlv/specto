import React, { useCallback, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SvgIcon } from "@/presentation/components/ui/svg-icon";

const ANIMATION_DURATION = 6500;
const EXIT_DURATION = 350;
const BUTTON_INTERACTION_THRESHOLD = 0.82;

interface OnboardingScreenProps {
  onComplete?: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);
  const exitOpacity = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: ANIMATION_DURATION,
      easing: Easing.linear,
    });

    return () => {
      cancelAnimation(progress);
      cancelAnimation(exitOpacity);
    };
  }, [progress, exitOpacity]);

  /*
   * ─────────────────────────────────────────────
   * ANIMATIONS
   * ─────────────────────────────────────────────
   */

  // Fades foreground content into the solid dark background
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: exitOpacity.value,
  }));

  const exploreStyle = useAnimatedStyle(() => wordStyle(progress.value, 0.0, 0.19));
  const discoverStyle = useAnimatedStyle(() => wordStyle(progress.value, 0.19, 0.38));
  const rememberStyle = useAnimatedStyle(() => wordStyle(progress.value, 0.38, 0.55));

  // Logo: Appears in the exact visual center
  const logoStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0.48, 0.58, 0.7], [0, 1, 1], "clamp");
    const scale = interpolate(progress.value, [0.48, 0.58], [0.92, 1], "clamp");
    const translateY = interpolate(progress.value, [0.48, 0.58], [10, 0], "clamp");

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  // Description / Tagline
  const taglineStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0.62, 0.74], [0, 1], "clamp");
    const translateY = interpolate(progress.value, [0.62, 0.74], [8, 0], "clamp");

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Background: Fixed position, subtle fade + exit fade
  const backgroundStyle = useAnimatedStyle(() => {
    const introOpacity = interpolate(progress.value, [0.25, 0.65], [0, 0.5], "clamp");
    return {
      opacity: introOpacity * exitOpacity.value,
    };
  });

  const buttonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0.82, 0.94], [0, 1], "clamp");
    const scale = interpolate(progress.value, [0.82, 0.94], [0.9, 1], "clamp");

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const handlePress = useCallback(() => {
    if (progress.value < BUTTON_INTERACTION_THRESHOLD || exitOpacity.value < 1) {
      return;
    }

    exitOpacity.value = withTiming(
      0,
      {
        duration: EXIT_DURATION,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      },
    );
  }, [onComplete, progress, exitOpacity]);

  return (
    // ✅ Root container stays solid #02141B, never becomes transparent
    <View className="flex-1 bg-background">
      {/* ─────────────────────────────────────────
          BACKGROUND (Fades out directly into solid dark background)
      ───────────────────────────────────────── */}
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, backgroundStyle]}>
        <Image
          source={require("@/assets/images/onboarding_full.webp")}
          contentFit="cover"
          priority="high"
          cachePolicy="memory-disk"
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Cinematic tint overlay */}
      <View pointerEvents="none" className="absolute inset-0 bg-background/50" />

      {/* ─────────────────────────────────────────
          FOREGROUND CONTENT WRAPPER
      ───────────────────────────────────────── */}
      <Animated.View style={[{ flex: 1 }, contentAnimatedStyle]}>
        {/* CENTER HERO: WORDS & SPECTO LOGO */}
        <View className="flex-1 items-center justify-center">
          {/* EXPLORE */}
          <Animated.Text
            pointerEvents="none"
            style={exploreStyle}
            className="absolute text-center font-geist-semibold text-5xl tracking-wider text-foreground"
          >
            EXPLORE
          </Animated.Text>

          {/* DISCOVER */}
          <Animated.Text
            pointerEvents="none"
            style={discoverStyle}
            className="absolute text-center font-geist-semibold text-5xl tracking-wider text-foreground"
          >
            DISCOVER
          </Animated.Text>

          {/* REMEMBER */}
          <Animated.Text
            pointerEvents="none"
            style={rememberStyle}
            className="absolute text-center font-geist-semibold text-5xl tracking-wider text-foreground"
          >
            REMEMBER
          </Animated.Text>

          {/* SPECTO LOGO (Dead Center) */}
          <Animated.View
            pointerEvents="none"
            style={[logoStyle, { position: "absolute" }]}
            className="items-center justify-center"
          >
            <Image
              source={require("@/assets/images/logo.png")}
              contentFit="contain"
              priority="high"
              style={{ width: 220, height: 48 }}
            />
          </Animated.View>

          {/* Tagline */}
          <Animated.View
            pointerEvents="none"
            style={[taglineStyle, { position: "absolute", top: "50%", marginTop: 44 }]}
            className="items-center"
          >
            <Text className="text-center font-geist text-sm leading-5 text-muted-foreground">
              More than entertainment.
              {"\n"}A universe to explore.
            </Text>
          </Animated.View>
        </View>

        {/* BOTTOM CTA BUTTON */}
        <View
          className="absolute left-0 right-0 items-center px-6"
          style={{ bottom: Math.max(insets.bottom, 16) + 20 }}
        >
          <Animated.View style={buttonStyle}>
            <Pressable
              onPress={handlePress}
              accessibilityRole="button"
              accessibilityLabel="Continue to application"
              hitSlop={8}
              android_ripple={{
                color: "rgba(2, 20, 27, 0.15)",
                borderless: true,
                radius: 24,
              }}
              className="size-12 items-center justify-center rounded-full bg-accent active:opacity-80"
            >
              <SvgIcon name="arrow-right" size={20} color="#02141B" />
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

function wordStyle(progress: number, start: number, end: number) {
  "worklet";

  const duration = end - start;
  const enterEnd = start + duration * 0.18;
  const exitStart = start + duration * 0.78;

  const opacity = interpolate(progress, [start, enterEnd, exitStart, end], [0, 1, 1, 0], "clamp");

  const translateY = interpolate(progress, [start, enterEnd, exitStart, end], [16, 0, 0, -12], "clamp");

  return {
    opacity,
    transform: [{ translateY }],
  };
}
