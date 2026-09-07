import React from "react";
import { View, ViewProps } from "react-native";
import { SvgProps } from "react-native-svg";
import { Image } from "expo-image";

// ─────────────────────────────────────────────
// EXACT ASSET IMPORTS (Ignore error warnings)
// ─────────────────────────────────────────────

import ArrowNarrowRight from "@/assets/svg/arrow-narrow-right.svg";
import ArrowRight from "@/assets/svg/arrow-right.svg";
import Bookmark from "@/assets/svg/bookmark.svg";
import Calendar from "@/assets/svg/calendar.svg";
import CheckButton from "@/assets/svg/check-button.svg";
import ChevronLeft from "@/assets/svg/chevron-left.svg";
import Discover from "@/assets/svg/discover.svg";
import Film from "@/assets/svg/film.svg";
import Filter from "@/assets/svg/filter.svg";
import Home from "@/assets/svg/home.svg";
import PlayButton from "@/assets/svg/play-button.svg";
import Play from "@/assets/svg/play.svg";
import Plus from "@/assets/svg/plus.svg";
import Search from "@/assets/svg/search.svg";
import Signal from "@/assets/svg/signal.svg";
import Star from "@/assets/svg/star.svg";
import VideoRecorder from "@/assets/svg/video-recorder.svg";
import Check from "@/assets/svg/check.svg";
import BookmarkCheck from "@/assets/svg/bookmark-check.svg";
import BookmarkFilled from "@/assets/svg/bookmark-filled.svg";

export type IconName =
  | "arrow-narrow-right"
  | "arrow-right"
  | "bookmark"
  | "calendar"
  | "check-button"
  | "chevron-left"
  | "discover"
  | "film"
  | "filter"
  | "home"
  | "play-button"
  | "play"
  | "plus"
  | "search"
  | "signal"
  | "star"
  | "video-recorder"
  | "check"
  | "bookmark-check"
  | "bookmark-filled";

const ICONS_MAP: Record<IconName, React.FC<SvgProps>> = {
  "arrow-narrow-right": ArrowNarrowRight,
  "arrow-right": ArrowRight,
  bookmark: Bookmark,
  calendar: Calendar,
  "check-button": CheckButton,
  "chevron-left": ChevronLeft,
  discover: Discover,
  film: Film,
  filter: Filter,
  home: Home,
  "play-button": PlayButton,
  play: Play,
  plus: Plus,
  search: Search,
  signal: Signal,
  star: Star,
  "video-recorder": VideoRecorder,
  check: Check,
  "bookmark-check": BookmarkCheck,
  "bookmark-filled": BookmarkFilled,
};

export interface SvgIconProps extends ViewProps {
  name: IconName;
  size?: number;
  color?: string;
  stroke?: string;
  fill?: string;
}
export function SvgIcon({ name, size = 20, color = "#F5F7F8", stroke, fill, style, ...props }: SvgIconProps) {
  const IconComponent = ICONS_MAP[name];

  if (!IconComponent) {
    return null;
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      {...props}
    >
      {typeof IconComponent === "function" ? (
        // Standard react-native-svg component
        <IconComponent width={size} height={size} color={color} fill="none" stroke={color} strokeWidth={1.5} />
      ) : (
        // Safe fallback if Metro loaded the SVG as a numeric asset ID
        <Image
          source={IconComponent as number}
          style={{ width: size, height: size }}
          tintColor={color}
          contentFit="contain"
        />
      )}
    </View>
  );
}
